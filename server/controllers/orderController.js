/**
 * controllers/orderController.js
 * Handles book rental order creation, retrieval, and status updates
 */

const Order          = require("../models/Order");
const Book           = require("../models/Book");
const ErrorResponse  = require("../utils/errorResponse");
const calculateFine  = require("../utils/calculateFine");

/* ─────────────────────────────────────────
   @desc    Place a new rental order
   @route   POST /api/orders
   @access  Private / Student
───────────────────────────────────────── */
const createOrder = async (req, res, next) => {
  try {
    const { bookId, deliveryAddress, slot } = req.body;

    // Check book exists and has available copies
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return next(new ErrorResponse("Book not found", 404));
    }
    if (book.availableCopies < 1) {
      return next(new ErrorResponse("No copies available for this book", 400));
    }

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    const order = await Order.create({
      userId:          req.user._id,
      bookId,
      deliveryAddress,
      slot,
      rentalAmount:    book.rentalPrice,
    });

    await order.populate(["userId", "bookId"]);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get all orders for a specific user
   @route   GET /api/orders/user/:userId
   @access  Private (own orders or admin)
───────────────────────────────────────── */
const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Students can only view their own orders
    if (req.user.role === "student" && req.user._id.toString() !== userId) {
      return next(new ErrorResponse("Not authorised to view these orders", 403));
    }

    const orders = await Order.find({ userId })
      .populate("bookId", "title author imageUrl rentalPrice category")
      .populate("userId", "name email studentId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get all orders (admin view)
   @route   GET /api/orders
   @access  Private / Admin
───────────────────────────────────────── */
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("bookId", "title author imageUrl rentalPrice")
      .populate("userId", "name email studentId department semester")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success:     true,
      count:       orders.length,
      total,
      totalPages:  Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Update order status
   @route   PUT /api/orders/:id/status
   @access  Private / Admin
───────────────────────────────────────── */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return next(new ErrorResponse("Order not found", 404));

    // On return: restore book copy count + calculate fine
    if (status === "Returned" && order.status !== "Returned") {
      const book = await Book.findById(order.bookId);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }
      order.returnDate = new Date();
      order.fineAmount = calculateFine(order.dueDate, order.returnDate);
    }

    order.status = status;
    await order.save();
    await order.populate(["userId", "bookId"]);

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get a single order by ID
   @route   GET /api/orders/:id
   @access  Private
───────────────────────────────────────── */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("bookId", "title author imageUrl rentalPrice category")
      .populate("userId", "name email studentId phone");

    if (!order) return next(new ErrorResponse("Order not found", 404));

    // Students can only see their own orders
    if (
      req.user.role === "student" &&
      order.userId._id.toString() !== req.user._id.toString()
    ) {
      return next(new ErrorResponse("Not authorised", 403));
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
};
