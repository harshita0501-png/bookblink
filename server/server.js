/**
 * server.js
 * BookBlink – Express server entry point
 */

require("dotenv").config();

const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const morgan       = require("morgan");
const connectDB    = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// ── Connect to MongoDB ──────────────────
connectDB();

const app = express();

// ── Security & Utility Middleware ───────
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── API Routes ──────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/books",    require("./routes/bookRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));
app.use("/api/reviews",  require("./routes/reviewRoutes"));
app.use("/api/admin",    require("./routes/adminRoutes"));

// ── Health check ────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BookBlink API is running 🚀",
    env:     process.env.NODE_ENV,
  });
});

// ── 404 handler ─────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ────────────────
app.use(errorHandler);

// ── Start server ────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
