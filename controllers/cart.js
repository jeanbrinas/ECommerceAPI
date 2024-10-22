// Dependencies and Modules
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const { errorHandler } = require('../auth');


// Retrieve User's Cart
module.exports.getCart = (req, res) => {
    return Cart.find({userId : req.user.id})
        .then(cart => {
            if (cart.length > 0) {
                return res.status(200).send({
                	cart: cart
                });
            }
            // if there is no cart found, send a message 'No cart found'.
            return res.status(404).send({ message: 'No cart found' });
        })
        .catch(error => errorHandler(error, req, res));
};


// Add To Cart
module.exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, subtotal } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
          cart = new Cart({
            userId,
            cartItems: [{ productId, quantity, subtotal }],
            totalPrice: subtotal
          });
        } else {
          const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

          if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity += quantity;
            cart.cartItems[itemIndex].subtotal += subtotal;
          } else {
            cart.cartItems.push({ productId, quantity, subtotal });
          }

          cart.totalPrice += subtotal;
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart successfully', cart });
      } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error: error.message });
      }
};

// Change Product Quantities in Cart
module.exports.updateCart = async (req, res) => {
	const { productId, quantity, subtotal } = req.body;

	    try {
	        const cart = await Cart.findOne({ userId: req.user.id });

	        if (!cart) {
	            return res.status(404).send({ message: 'Cart not found.' });
	        }

	        const productIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

	        if (productIndex !== -1) {
	            cart.cartItems[productIndex].quantity = quantity;
	            cart.cartItems[productIndex].subtotal = subtotal;
	        } else {
	            cart.cartItems.push({ productId, quantity, subtotal });
	        }

	        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

	        await cart.save();

	        res.send({ message: 'Item quantity updated successfully.', cart });
	    } catch (error) {
	        res.status(500).send({ error: 'Error updating cart.', details: error.message });
	    }
};


// Remove Item from Cart
module.exports.removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.cartItems.splice(itemIndex, 1); // Remove item from cart

    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();

    const updatedCart = {
      _id: cart._id,
      userId: cart.userId,
      cartItems: cart.cartItems,
      totalPrice: cart.totalPrice,
      orderedOn: cart.orderedOn,
      __v: cart.__v
    };

    res.status(200).json({ message: 'Item removed from cart successfully', updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
};


// Remove Item from Cart

module.exports.clearCart = async (req, res) => {
  try {
    // Extract user ID from the JWT payload set by the authMiddleware
    const userId = req.user.id;

    // Find the cart by user ID
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "No cart found for the user." });
    }

    if (cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is already empty." });
    }

    // Clear the cartItems array
    cart.cartItems = [];
    cart.totalPrice = 0;

    // Save the updated cart document
    await cart.save();

    const updatedCart = {
      _id: cart._id,
      userId: cart.userId,
      cartItems: cart.cartItems,
      totalPrice: cart.totalPrice,
      orderedOn: cart.orderedOn,
      __v: cart.__v
    };

    return res.status(200).json({ message: "Cart cleared successfully.", updatedCart });
  } catch (error) {
    return res.status(500).json({ message: "Error clearing the cart.", error: error.message });
  }
};