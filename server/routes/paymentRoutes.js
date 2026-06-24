/**
 * routes/paymentRoutes.js
 */

const express = require("express");
const router  = express.Router();

const {
  createPayment,
  getUserPayments,
  getAllPayments,
} = require("../controllers/paymentController");

const { protect, authorise } = require("../middleware/auth");

router.use(protect);

router.post("/",           authorise("student", "admin"), createPayment);
router.get( "/",           authorise("admin"),             getAllPayments);
router.get( "/:userId",    authorise("student", "admin"), getUserPayments);

module.exports = router;
