/**
 * controllers/bookController.js
 * CRUD operations for Books (catalog management)
 */

const Book          = require("../models/Book");
const ErrorResponse = require("../utils/errorResponse");

/* ─────────────────────────────────────────
   @desc    Get all books (with search & filter)
   @route   GET /api/books
   @access  Public
───────────────────────────────────────── */
const getBooks = async (req, res, next) => {
  try {
    const { search, department, semester, category, available, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (department && department !== "All") query.department = department;
    if (semester    && semester    !== "All") query.semester  = Number(semester);
    if (category    && category    !== "All") query.category  = category;
    if (available === "true") query.availableCopies = { $gt: 0 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success:    true,
      count:      books.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      books,
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get single book by ID
   @route   GET /api/books/:id
   @access  Public
───────────────────────────────────────── */
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.isActive) {
      return next(new ErrorResponse("Book not found", 404));
    }
    res.status(200).json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Add a new book
   @route   POST /api/books
   @access  Private / Admin
───────────────────────────────────────── */
const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, message: "Book added successfully", book });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Update a book
   @route   PUT /api/books/:id
   @access  Private / Admin
───────────────────────────────────────── */
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new:           true,
      runValidators: true,
    });
    if (!book) return next(new ErrorResponse("Book not found", 404));
    res.status(200).json({ success: true, message: "Book updated", book });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Soft-delete a book
   @route   DELETE /api/books/:id
   @access  Private / Admin
───────────────────────────────────────── */
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!book) return next(new ErrorResponse("Book not found", 404));
    res.status(200).json({ success: true, message: "Book removed from catalog" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
