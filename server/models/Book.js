/**
 * models/Book.js
 * Mongoose schema for Books in the library catalog
 */

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, "Book title is required"],
      trim:     true,
    },
    author: {
      type:     String,
      required: [true, "Author is required"],
      trim:     true,
    },
    subject: {
      type:  String,
      trim:  true,
    },
    semester: {
      type: Number,
      min:  1,
      max:  8,
    },
    department: {
      type:  String,
      trim:  true,
    },
    category: {
      type: String,
      enum: ["Core CS", "Programming", "Database", "Networking", "Web Dev", "Mathematics", "AI/ML", "Other"],
      default: "Other",
    },
    ISBN: {
      type:   String,
      unique: true,
      sparse: true,
      trim:   true,
    },
    totalCopies: {
      type:    Number,
      default: 1,
      min:     0,
    },
    availableCopies: {
      type:    Number,
      default: 1,
      min:     0,
    },
    rentalPrice: {
      type:     Number,
      required: [true, "Rental price is required"],
      min:      0,
    },
    rating: {
      type:    Number,
      default: 0,
      min:     0,
      max:     5,
    },
    reviewCount: {
      type:    Number,
      default: 0,
    },
    imageUrl: {
      type:    String,
      default: "",
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ── Text index for search ── */
bookSchema.index({ title: "text", author: "text", subject: "text" });

module.exports = mongoose.model("Book", bookSchema);
