// Dependencies and Modules
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const { errorHandler } = require('../auth');


// Create Order
module.exports.createOrder = async (req, res) => {

    try {
    	const userId = req.user.id;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        if (!cart.cartItems || cart.cartItems.length === 0) {
            return res.status(400).json({ error: 'No Items to Checkout' });
        }

        const newOrder = new Order({
            userId,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice
        });

        await newOrder.save();

        res.status(201).json({ message: 'Ordered successfully' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token', error: error.message });
        }

        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

// Retrieve logged in user's orders
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId });

        if (orders.length === 0) {
            return res.status(404).send({ message: 'No orders found for this user.' });
        }

        res.status(200).send({
        	orders: orders
        });
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving orders', error: error.message });
    }
};

// Retrieve all user's orders
module.exports.getAllOrders = async (req, res) => {
    try {
        
        // Find the user by ID
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the user is an admin
        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // Retrieve all orders
        const orders = await Order.find();

        // Send the orders to the client
        res.status(200).json({
        	orders: orders
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving orders.', error: error.message });
    }
};