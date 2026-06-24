/**
 * routes/adminRoutes.js
 */

const express = require("express");
const router  = express.Router();

const {
  getAnalytics,
  getAllUsers,
  toggleUserStatus,
  approveOrder,
} = require("../controllers/adminController");

const { protect, authorise } = require("../middleware/auth");

router.use(protect, authorise("admin"));

router.get("/analytics",             getAnalytics);
router.get("/users",                 getAllUsers);
router.put("/users/:id/toggle",      toggleUserStatus);
router.put("/orders/:id/approve",    approveOrder);

module.exports = router;
