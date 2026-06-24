/**
 * controllers/paymentController.js
 * Handles payment creation and retrieval (Razorpay-ready, UI-only for academic use)
 */

const Payment       = require("../models/Payment");
const Order         = require("../models/Order");
const ErrorResponse = require("../utils/errorResponse");

/* ─────────────────────────────────────────
   @desc    Create / record a payment
   @route   POST /api/payments
   @access  Private / Student
───────────────────────────────────────── */
const createPayment = async (req, res, next) => {
  try {
    const { orderId, amount, method, type, razorpayOrderId, razorpayPaymentId } = req.body;

    // Verify the order belongs to the requesting user (or admin)
    const order = await Order.findById(orderId);
    if (!order) return next(new ErrorResponse("Order not found", 404));

    if (
      req.user.role === "student" &&
      order.userId.toString() !== req.user._id.toString()
    ) {
      return next(new ErrorResponse("Not authorised to pay for this order", 403));
    }

    const payment = await Payment.create({
      orderId,
      userId:            req.user._id,
      amount,
      method:            method || "upi",
      type:              type   || "rental",
      razorpayOrderId:   razorpayOrderId   || "",
      razorpayPaymentId: razorpayPaymentId || "",
      status:            "Completed",
      paidAt:            new Date(),
    });

    // Mark order as paid
    await Order.findByIdAndUpdate(orderId, { paymentStatus: "Paid" });

    await payment.populate("orderId");

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get all payments for a user
   @route   GET /api/payments/:userId
   @access  Private (own or admin)
───────────────────────────────────────── */
const getUserPayments = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.role === "student" && req.user._id.toString() !== userId) {
      return next(new ErrorResponse("Not authorised", 403));
    }

    const payments = await Payment.find({ userId })
      .populate("orderId", "status rentalAmount fineAmount slot")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get all payments (admin)
   @route   GET /api/payments
   @access  Private / Admin
───────────────────────────────────────── */
const getAllPayments = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type)   query.type   = type;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Payment.countDocuments(query);

    const payments = await Payment.find(query)
      .populate("userId",  "name email studentId")
      .populate("orderId", "status slot rentalAmount")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Aggregate total revenue
    const revenueAgg = await Payment.aggregate([
      { $match: { status: "Completed", type: { $ne: "refund" } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.status(200).json({
      success:       true,
      count:         payments.length,
      total,
      totalPages:    Math.ceil(total / Number(limit)),
      currentPage:   Number(page),
      totalRevenue,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPayment, getUserPayments, getAllPayments };
