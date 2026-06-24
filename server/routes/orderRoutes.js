/**
 * routes/orderRoutes.js
 */

const express = require("express");
const router  = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} = require("../controllers/orderController");

const { protect, authorise } = require("../middleware/auth");

// All order routes require authentication
router.use(protect);

router.post(  "/",                    authorise("student"),          createOrder);
router.get(   "/",                    authorise("admin"),             getAllOrders);
router.get(   "/user/:userId",        authorise("student", "admin"), getUserOrders);
router.get(   "/:id",                                                 getOrderById);
router.put(   "/:id/status",          authorise("admin"),             updateOrderStatus);

module.exports = router;
