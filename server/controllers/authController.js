/**
 * controllers/authController.js
 * Handles user registration and login
 */

const User          = require("../models/User");
const generateToken = require("../utils/generateToken");
const ErrorResponse = require("../utils/errorResponse");

/* ─────────────────────────────────────────
   @desc    Register a new user
   @route   POST /api/auth/register
   @access  Public
───────────────────────────────────────── */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, department, semester, studentId } = req.body;

    // Check if email already taken
    const existing = await User.findOne({ email });
    if (existing) {
      return next(new ErrorResponse("Email already registered", 400));
    }

    const user = await User.create({
      studentId,
      name,
      email,
      password,
      role:       role || "student",
      phone,
      department,
      semester,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        _id:        user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        department: user.department,
        semester:   user.semester,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Login user & return JWT
   @route   POST /api/auth/login
   @access  Public
───────────────────────────────────────── */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse("Please provide email and password", 400));
    }

    // Explicitly select password (it's excluded by default in the schema)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    if (!user.isActive) {
      return next(new ErrorResponse("Your account has been deactivated", 403));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id:           user._id,
        name:          user.name,
        email:         user.email,
        role:          user.role,
        department:    user.department,
        semester:      user.semester,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Get currently logged-in user profile
   @route   GET /api/auth/me
   @access  Private
───────────────────────────────────────── */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────
   @desc    Update profile
   @route   PUT /api/auth/me
   @access  Private
───────────────────────────────────────── */
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "department", "semester"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new:         true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
