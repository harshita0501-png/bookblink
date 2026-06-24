/**
 * routes/deliveryRoutes.js
 */

const express = require("express");
const router  = express.Router();

const {
  assignDelivery,
  getDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
} = require("../controllers/deliveryController");

const { protect, authorise } = require("../middleware/auth");

router.use(protect);

router.post("/",    authorise("admin"),                  assignDelivery);
router.get( "/",    authorise("admin", "delivery"),      getDeliveries);
router.get( "/:id", authorise("admin", "delivery"),      getDeliveryById);
router.put( "/:id", authorise("admin", "delivery"),      updateDeliveryStatus);

module.exports = router;
