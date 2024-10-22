// Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cart");
const { verify } = require("../auth");

// Routing Component
const router = express.Router();

// Retrieve User's Cart
router.get("/get-cart", verify, cartController.getCart); 

// Add To Cart
router.post("/add-to-cart", verify, cartController.addToCart); 

// Change Product Quantities in Cart
router.patch("/update-cart-quantity", verify, cartController.updateCart); 

// Remove Item from Cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeItemFromCart); 

// Clear Cart
router.put("/clear-cart", verify, cartController.clearCart); 


// Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;