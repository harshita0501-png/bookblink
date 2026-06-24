/**
 * controllers/reviewController.js
 * Manages book reviews and ratings from students
 */

const Review        = require("../models/Review");
const Order         = require("../models/Order");
const ErrorResponse = require("../utils/errorResponse");

/* ─────────────────────────────────────────
   @desc    Post a review for a book
   @route   POST /api/reviews
   @access  Private / Student
───────────────────────────────────────── */
const createReview = async (req, res, next) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Ensure the student has actually rented this book
    const delivered = await Order.findOne({
      userId: req.user._id,
      bookId,
      status: { $in: ["Delivered", "Returned"] },
    });

    if (!delivered && req.user.role === "student") {
      return next(
        new ErrorResponse(
          "You can only review books you have rented and received",
          403
        )
      );
    }

    // Upsert: update if existing, create if not
    const review = await Review.findOneAndUpdate(
      { bookId, userId: req.user._id },
      { rating, comment },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    // Trigger rating recalculation
    await Review.calcAverageRating(bookId);

    await review.populate("userId", "name");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get all reviews for a book
   @route   GET /api/reviews/:bookId
   @access  Public
───────────────────────────────────────── */
const getBookReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Review.countDocuments({ bookId: req.params.bookId });

    const reviews = await Review.find({ bookId: req.params.bookId })
      .populate("userId", "name department semester")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success:     true,
      count:       reviews.length,
      total,
      totalPages:  Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Delete a review (own or admin)
   @route   DELETE /api/reviews/:id
   @access  Private
───────────────────────────────────────── */
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new ErrorResponse("Review not found", 404));

    if (
      review.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new ErrorResponse("Not authorised to delete this review", 403));
    }

    await review.deleteOne();
    await Review.calcAverageRating(review.bookId);

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getBookReviews, deleteReview };
