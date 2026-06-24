/**
 * routes/reviewRoutes.js
 */

const express = require("express");
const router  = express.Router();

const {
  createReview,
  getBookReviews,
  deleteReview,
} = require("../controllers/reviewController");

const { protect, authorise } = require("../middleware/auth");

// Public: anyone can read reviews
router.get("/:bookId", getBookReviews);

// Protected
router.post(  "/",    protect, authorise("student"),          createReview);
router.delete("/:id", protect, authorise("student", "admin"), deleteReview);

module.exports = router;
