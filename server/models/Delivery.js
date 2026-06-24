/**
 * models/Delivery.js
 * Mongoose schema for Delivery Assignments
 */

const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Order",
      required: true,
      unique:   true,
    },
    staffId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    status: {
      type:    String,
      enum:    ["Assigned", "Picked Up", "Delivered", "Failed"],
      default: "Assigned",
    },
    qrCode: {
      type:    String,
      default: "", // QR code string / URL generated at assignment
    },
    deliverySlot: {
      type: String,
    },
    notes: {
      type:    String,
      default: "",
    },
    pickedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
