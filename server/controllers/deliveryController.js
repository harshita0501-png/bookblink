/**
 * controllers/deliveryController.js
 * Manages delivery assignment, status tracking for delivery staff
 */

const Delivery      = require("../models/Delivery");
const Order         = require("../models/Order");
const ErrorResponse = require("../utils/errorResponse");

/* ─────────────────────────────────────────
   @desc    Assign a delivery task (admin)
   @route   POST /api/delivery
   @access  Private / Admin
───────────────────────────────────────── */
const assignDelivery = async (req, res, next) => {
  try {
    const { orderId, staffId, deliverySlot, notes } = req.body;

    // Check order exists and is approved
    const order = await Order.findById(orderId);
    if (!order) return next(new ErrorResponse("Order not found", 404));

    // Prevent duplicate assignments
    const existing = await Delivery.findOne({ orderId });
    if (existing) {
      return next(new ErrorResponse("Delivery already assigned for this order", 400));
    }

    // Generate a simple QR code string (in production use a QR lib)
    const qrCode = `BB-${orderId}-${Date.now()}`;

    const delivery = await Delivery.create({
      orderId,
      staffId,
      deliverySlot: deliverySlot || order.slot,
      qrCode,
      notes: notes || "",
    });

    // Update order status to Assigned
    await Order.findByIdAndUpdate(orderId, { status: "Assigned" });

    await delivery.populate([
      { path: "orderId", populate: { path: "bookId", select: "title author" } },
      { path: "staffId", select: "name phone" },
    ]);

    res.status(201).json({
      success:  true,
      message:  "Delivery assigned successfully",
      delivery,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get all deliveries (admin) OR own tasks (delivery staff)
   @route   GET /api/delivery
   @access  Private / Admin | Delivery
───────────────────────────────────────── */
const getDeliveries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    // Delivery staff only see their own assignments
    if (req.user.role === "delivery") {
      query.staffId = req.user._id;
    }
    if (status) query.status = status;

    const deliveries = await Delivery.find(query)
      .populate({
        path:     "orderId",
        populate: [
          { path: "bookId", select: "title author imageUrl" },
          { path: "userId", select: "name phone studentId" },
        ],
      })
      .populate("staffId", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: deliveries.length, deliveries });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get a single delivery by ID
   @route   GET /api/delivery/:id
   @access  Private / Admin | Delivery
───────────────────────────────────────── */
const getDeliveryById = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate({
        path:     "orderId",
        populate: [
          { path: "bookId", select: "title author imageUrl" },
          { path: "userId", select: "name phone studentId" },
        ],
      })
      .populate("staffId", "name phone email");

    if (!delivery) return next(new ErrorResponse("Delivery not found", 404));

    // Delivery staff can only view their own
    if (
      req.user.role === "delivery" &&
      delivery.staffId._id.toString() !== req.user._id.toString()
    ) {
      return next(new ErrorResponse("Not authorised", 403));
    }

    res.status(200).json({ success: true, delivery });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Update delivery status (Picked Up → Delivered)
   @route   PUT /api/delivery/:id
   @access  Private / Delivery | Admin
───────────────────────────────────────── */
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) return next(new ErrorResponse("Delivery not found", 404));

    // Delivery staff can only update their own tasks
    if (
      req.user.role === "delivery" &&
      delivery.staffId.toString() !== req.user._id.toString()
    ) {
      return next(new ErrorResponse("Not authorised", 403));
    }

    // Record timestamps for key status changes
    if (status === "Picked Up" && !delivery.pickedAt) {
      delivery.pickedAt = new Date();
    }
    if (status === "Delivered" && !delivery.deliveredAt) {
      delivery.deliveredAt = new Date();
      // Sync order status
      await Order.findByIdAndUpdate(delivery.orderId, { status: "Delivered" });
    }

    delivery.status = status;
    if (notes) delivery.notes = notes;
    await delivery.save();

    await delivery.populate([
      { path: "orderId", populate: { path: "bookId", select: "title author" } },
      { path: "staffId", select: "name phone" },
    ]);

    res.status(200).json({
      success:  true,
      message:  `Delivery status updated to "${status}"`,
      delivery,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignDelivery,
  getDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
};
