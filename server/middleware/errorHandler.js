/**
 * middleware/errorHandler.js
 * Global error handling middleware – must be last in the middleware chain
 */

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  /* ── Mongoose bad ObjectId ── */
  if (err.name === "CastError") {
    error.message    = `Resource not found with id: ${err.value}`;
    error.statusCode = 404;
  }

  /* ── Mongoose duplicate key ── */
  if (err.code === 11000) {
    const field      = Object.keys(err.keyValue)[0];
    error.message    = `${field} already exists`;
    error.statusCode = 400;
  }

  /* ── Mongoose validation error ── */
  if (err.name === "ValidationError") {
    error.message    = Object.values(err.errors).map((e) => e.message).join(", ");
    error.statusCode = 400;
  }

  /* ── JWT errors ── */
  if (err.name === "JsonWebTokenError") {
    error.message    = "Invalid token";
    error.statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    error.message    = "Token has expired";
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

module.exports = errorHandler;
