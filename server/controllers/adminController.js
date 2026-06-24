/**
 * controllers/adminController.js
 * Admin-only: analytics dashboard, user management
 */

const User          = require("../models/User");
const Book          = require("../models/Book");
const Order         = require("../models/Order");
const Payment       = require("../models/Payment");
const Delivery      = require("../models/Delivery");
const ErrorResponse = require("../utils/errorResponse");

/* ─────────────────────────────────────────
   @desc    Get dashboard analytics summary
   @route   GET /api/admin/analytics
   @access  Private / Admin
───────────────────────────────────────── */
const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalBooks,
      totalStudents,
      totalOrders,
      activeRentals,
      pendingRequests,
      deliveriesToday,
      revenueAgg,
    ] = await Promise.all([
      Book.countDocuments({ isActive: true }),
      User.countDocuments({ role: "student", isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["Approved", "Assigned", "Out for Delivery", "Delivered"] } }),
      Order.countDocuments({ status: "Requested" }),
      Delivery.countDocuments({
        deliveredAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Payment.aggregate([
        { $match: { status: "Completed", type: { $ne: "refund" } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    // Monthly rentals for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id:   { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$rentalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Top 5 most rented books
    const topBooks = await Order.aggregate([
      { $group: { _id: "$bookId", rentals: { $sum: 1 } } },
      { $sort: { rentals: -1 } },
      { $limit: 5 },
      { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
      { $unwind: "$book" },
      { $project: { title: "$book.title", author: "$book.author", rentals: 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalBooks,
        totalStudents,
        totalOrders,
        activeRentals,
        pendingRequests,
        deliveriesToday,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
      monthlyOrders,
      topBooks,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get all users
   @route   GET /api/admin/users
   @access  Private / Admin
───────────────────────────────────────── */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success:     true,
      count:       users.length,
      total,
      totalPages:  Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      users,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Activate / deactivate a user
   @route   PUT /api/admin/users/:id/toggle
   @access  Private / Admin
───────────────────────────────────────── */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorResponse("User not found", 404));

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Approve a pending order
   @route   PUT /api/admin/orders/:id/approve
   @access  Private / Admin
───────────────────────────────────────── */
const approveOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    ).populate("bookId userId");

    if (!order) return next(new ErrorResponse("Order not found", 404));

    res.status(200).json({ success: true, message: "Order approved", order });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics, getAllUsers, toggleUserStatus, approveOrder };
