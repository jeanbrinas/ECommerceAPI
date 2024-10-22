// Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product");
const { verify, verifyAdmin } = require("../auth");

// Routing Component
const router = express.Router();

// Route for creating a product (Admin)
router.post("/", verify, verifyAdmin, productController.addProduct); 

// Route for retrieving all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// Route for retrieving all ACTIVE products
router.get("/active", productController.getAllActive);

// Route for retrieving single product
router.get("/:productId", productController.getProduct);

// Route for updating product info (Admin-Only)
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// Route to archiving a product (Admin-Only)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Route to activating a product (Admin-Only)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Route to search for products by product name
router.post('/search-by-name', productController.searchProductsByName);

// Route to search products within a price range
router.post('/search-by-price', productController.searchProductsByPrice);

/* START OF COMMENT

// Route to get emails of enrolled users
router.get('/:productId/enrolled-users', productController.getEmailsOfEnrolledUsers);

// Route to update enrollment status
router.put('/update-status', verify, verifyAdmin, productController.updateEnrollmentStatus);

END OF COMMENT*/


// Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;