/**
 * models/Payment.js
 * Mongoose schema for Payments (rental fees & fines)
 */

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Order",
      required: true,
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    amount: {
      type:     Number,
      required: true,
      min:      0,
    },
    type: {
      type:    String,
      enum:    ["rental", "fine", "refund"],
      default: "rental",
    },
    method: {
      type:    String,
      enum:    ["upi", "netbanking", "cod", "wallet"],
      default: "upi",
    },
    razorpayOrderId: {
      type:    String,
      default: "",
    },
    razorpayPaymentId: {
      type:    String,
      default: "",
    },
    status: {
      type:    String,
      enum:    ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    paidAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
