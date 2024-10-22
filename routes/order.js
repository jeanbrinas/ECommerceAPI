// Dependencies and Modules
const express = require("express");
const orderController = require("../controllers/order");
const { verify, verifyAdmin } = require("../auth");

// Routing Component
const router = express.Router();

// Create Order
router.post("/checkout", verify, orderController.createOrder); 

// Retrieve logged in user's orders
router.get("/my-orders", verify, orderController.getMyOrders); 

// Retrieve all user's orders
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders); 


// Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;