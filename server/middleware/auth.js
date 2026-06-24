/**
 * middleware/auth.js
 * JWT authentication + role-based access control middleware
 */

const jwt          = require("jsonwebtoken");
const User         = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

/* ─────────────────────────────────────────
   protect  – verifies JWT, attaches req.user
───────────────────────────────────────── */
const protect = async (req, res, next) => {
  let token;

  // Accept token from Authorization header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorised – no token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorResponse("User not found", 401));
    }
    if (!req.user.isActive) {
      return next(new ErrorResponse("Account is deactivated", 403));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorised – invalid token", 401));
  }
};

/* ─────────────────────────────────────────
   authorise  – restricts to specified roles
   Usage: authorise("admin", "delivery")
───────────────────────────────────────── */
const authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role '${req.user.role}' is not allowed to access this route`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { protect, authorise };
