/**
 * models/Order.js
 * Mongoose schema for Book Rental Orders
 */

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    bookId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Book",
      required: true,
    },
    deliveryAddress: {
      block:  { type: String, required: true },
      room:   { type: String, required: true },
      phone:  { type: String, required: true },
    },
    slot: {
      type:     String,
      enum:     ["Morning (9AM-12PM)", "Afternoon (1PM-4PM)", "Evening (4PM-7PM)"],
      required: true,
    },
    status: {
      type:    String,
      enum:    ["Requested", "Approved", "Assigned", "Out for Delivery", "Delivered", "Returned", "Cancelled"],
      default: "Requested",
    },
    requestDate: {
      type:    Date,
      default: Date.now,
    },
    dueDate: {
      type: Date, // calculated as requestDate + 20 days
    },
    returnDate: {
      type: Date,
    },
    rentalAmount: {
      type:    Number,
      default: 0,
    },
    fineAmount: {
      type:    Number,
      default: 0,
    },
    paymentStatus: {
      type:    String,
      enum:    ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

/* ── Auto-set dueDate 20 days from requestDate ── */
orderSchema.pre("save", function (next) {
  if (this.isNew && !this.dueDate) {
    const due   = new Date(this.requestDate);
    due.setDate(due.getDate() + 20);
    this.dueDate = due;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
