// Dependencies and Modules
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const { errorHandler } = require('../auth');

// Create a product

    // Steps: 
    // 1. Instantiate a new object using the Product model and the request body data
    // 2. Save the record in the database using the mongoose method "save"
    // 3. Use the "then" method to send a response back to the client appliction based on the result of the "save" method

module.exports.addProduct = (req, res) => {

    // Creates a variable "newProduct" and instantiates a new "Product" object using the mongoose model
    // Uses the information from the request body to provide all the necessary information
    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Product.findOne({name: req.body.name})
    .then(existingProduct => {
        // If product exists, return true
        if(existingProduct) {
            return res.status(409).send({ error: 'Product already exists'})
        } else {
            // Saves the created object to our database
            return newProduct.save()
            .then(result => res.status(201).send({
                // success: true,
                // message: 'Product added successfully',
                product: result
            }))
            .catch(err => errorHandler(err, req, res));
        }
    })
    .catch(err => errorHandler(err, req, res));    
}; 

// module.exports.addProduct = (req, res) => {

//     try {
//         let newProduct = new Product({
//             name : reqBody.name,
//             description : req.body.description,
//             price : req.body.price
//         });

//         return newProduct.save()
//         .then(result => res.send(result))
//         .catch(err => res.send(err))

//     } catch (err) {
//         console.log(err);
//         res.send("Error in variables");
//     }
// }


// Retrieve all products

    // Steps: 
    // 1. Retrieve all products using the mongoose "find" method
    // 2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method

module.exports.getAllProducts = (req, res) => {

    return Product.find({})
    .then(result => {
        // if the result is not null send status 200 and its result
        if (result.length > 0){
            return res.status(200).send({
                products: result
            });
        }
        else {
            // 404 for not found products
            return res.status(404).send({ error: 'No products found' });
        }
    })
    .catch(err => errorHandler(err, req, res));

};

// Retrieve all active products

    // Steps: 
    // 1. Retrieve all products using the mongoose "find" method with the "isActive" field values equal to "true"
    // 2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method

module.exports.getAllActive = (req, res) => {

    return Product.find({ isActive: true })
    .then(result => {

        if(result.length > 0){           
            return res.status(200).send({
                products: result
            });
        } else {
            return res.status(404).send({ message: 'No active products found' });
        }
    })
    .catch(err => errorHandler(err, req, res));
};

// Retrieve single product

    // Steps: 
    // 1. Retrieve a product using the mongoose "findById" method
    // 2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method


module.exports.getProduct = (req, res) => {
    
    return Product.findById(req.params.productId)
    .then(product => {
        if(product) {
            return res.status(200).send({
                product: product
            });
        } else {
            return res.status(404).send({ error: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};

// Update a product

    // Steps: 
    // 1. Create an object containing the data from the request body
    // 2. Retrieve and update a product using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the product
    // 3. Use the "then" method to send a response back to the client appliction based on the result of the "find" method

module.exports.updateProduct = (req, res)=>{

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    // findByIdandUpdate() finds the the document in the db and updates it automatically
    // req.body is used to retrieve data from the request body, commonly through form submission
    // req.params is used to retrieve data from the request parameters or the url
    // req.params.productId - the id used as the reference to find the document in the db retrieved from the url
    // updatedProduct - the updates to be made in the document
    return Product.findByIdAndUpdate(req.params.productId, updatedProduct, { new: true })
    .then(product => {
        if (product) {
            res.status(200).send({ 
                // success: true,
                message: 'Product updated successfully',
                updatedProduct: product
            });
        } else {
            res.status(404).send({ error: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

// Archive a product

    // Steps: 
    // 1. Create an object and with the keys to be updated in the record
    // 2. Retrieve and update a product using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the product
    // 3. If a product is updated send a response of "true" else send "false"
    // 4. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method

module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then(product => {
        // Check if a product was found
        if (product) {
            // If product found, check if it was already archived
            if (!product.isActive) {
                // If product already archived, return a 200 status with a message indicating "Product already archived".
                return res.status(200).send({
                    message: 'Product already archived',
                    // product: product
                });
            }
            //if the product is successfully archived, return true and send a message 'Product archived successfully'.
            return res.status(200).send({
                // success: true, 
                message: 'Product archived successfully',
                archiveProduct: product
            });
        } else {
            // if the product is not found, return 'Product not found'
            return res.status(404).send({ message: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

// Activate a product

    // Steps: 
    // 1. Create an object and with the keys to be updated in the record
    // 2. Retrieve and update a product using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the product
    // 3. If the user is an admin, update a product else send a response of "false"
    // 4. If a product is updated send a response of "true" else send "false"
    // 5. Use the "then" method to send a response back to the client appliction based on the result of the "findByIdAndUpdate" method

module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    
    return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then(product => {
        // Check if a product was found
        if (product) {
            // If product found, check if it was already activated
            if (product.isActive) {
                // If product already activated, return a 200 status with a message indicating "Product already activated".
                return res.status(200).send({
                    message: 'Product already activated',
                    // product: product
                });
            }
            // If product not yet activated, return a 200 status with a boolean true.
            return res.status(200).send({
                // success: true,
                message: 'Product activated successfully',
                activateProduct: product
            });
        } else {
            // If product not found, return a 404 status with a boolean false.
            return res.status(404).send({ message: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

// Controller action to search for products by product name
module.exports.searchProductsByName = async (req, res) => {
    const { productName } = req.body;

    if (productName === undefined) {
        return res.status(400).json({ error: 'productName is required' });
    }
    try {

        // Use a regular expression to perform a case-insensitive search
        const products = await Product.find({
            name: { $regex: productName, $options: 'i' }
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller action to search for products by price range

module.exports.searchProductsByPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.body;

    if (minPrice === undefined || maxPrice === undefined) {
        return res.status(400).json({ error: 'minPrice and maxPrice are required' });
    }

    try {
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

/* START OF COMMENT

module.exports.getEmailsOfEnrolledUsers = async (req, res) => {
    const productId = req.params.productId; // Use req.params.productId since it's in the route parameter

    try {
        // Find all enrollments for the given productId
        const enrollments = await Enrollment.find({ 'enrolledProducts.productId': productId });

        console.log(enrollments);

        if (!enrollments || enrollments.length === 0) {
            return res.status(404).json({ message: 'No users enrolled in this product' });
        }

        // Get the userIds of enrolled users for the specific product
        const userIds = enrollments.map(enrollment => enrollment.userId);

        // Find the users with matching userIds
        const enrolledUsers = await User.find({ _id: { $in: userIds } }); // Use userIds instead of undefined variable 'users'

        console.log(enrolledUsers);
        
        // Extract the emails from the enrolled users
        const emails = enrolledUsers.map(user => user.email); // Use map instead of forEach

        res.status(200).json({ userEmails: emails }); // Correct variable name userEmails, and include it in the response
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while retrieving enrolled users' });
    }
};


module.exports.updateEnrollmentStatus = async (req, res) => {
    const { userId, enrolledProducts, status } = req.body;

    // Validate input
    if (!userId || !enrolledProducts || !status) {
        return res.status(400).json({ message: 'User ID, Product ID, and status are required.' });
    }

    // Check if status is valid
    const validStatuses = ['enrolled', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
    }

    try {
        // Find the enrollment document
        let enrollment = await Enrollment.findOne({ userId, enrolledProducts });

        if (!enrollment) {
            // If no enrollment exists, create a new one
            enrollment = new Enrollment({ userId, enrolledProducts, status });
        } else {
            // Update the status if enrollment exists
            enrollment.status = status;
        }

        // Save the enrollment document
        await enrollment.save();

        res.status(200).json({ message: 'Enrollment status updated successfully.', enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error });
    }
};

END OF COMMENT*/