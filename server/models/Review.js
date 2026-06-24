/**
 * models/Review.js
 * Mongoose schema for Book Reviews & Ratings
 */

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Book",
      required: true,
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    rating: {
      type:     Number,
      required: true,
      min:      1,
      max:      5,
    },
    comment: {
      type:    String,
      trim:    true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

/* ── One review per user per book ── */
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

/* ── After saving a review, recalculate book's average rating ── */
reviewSchema.statics.calcAverageRating = async function (bookId) {
  const stats = await this.aggregate([
    { $match: { bookId } },
    {
      $group: {
        _id:   "$bookId",
        avg:   { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Book").findByIdAndUpdate(bookId, {
      rating:      Math.round(stats[0].avg * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await mongoose.model("Book").findByIdAndUpdate(bookId, {
      rating:      0,
      reviewCount: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.bookId);
});

reviewSchema.post("remove", function () {
  this.constructor.calcAverageRating(this.bookId);
});

module.exports = mongoose.model("Review", reviewSchema);
