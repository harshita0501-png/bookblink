/**
 * routes/bookRoutes.js
 */

const express = require("express");
const router  = express.Router();

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { protect, authorise } = require("../middleware/auth");

// Public routes
router.get("/",    getBooks);
router.get("/:id", getBookById);

// Admin-only routes
router.post(  "/",    protect, authorise("admin"), createBook);
router.put(   "/:id", protect, authorise("admin"), updateBook);
router.delete("/:id", protect, authorise("admin"), deleteBook);

module.exports = router;
