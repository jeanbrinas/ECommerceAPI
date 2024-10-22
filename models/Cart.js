const mongoose = require("mongoose");

// Schema
const cartSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, 'User ID is required']
	},
	cartItems: [
		{	
			productId: {
				type: String, 
				required: [true, 'Product ID is required']
			},
			quantity: {
				type: Number, 
				required: [true, 'Quantity is required']
			},
			subtotal: {
				type: Number, 
				required: [true, 'Subtotal is required']
			}
		}
	],
	totalPrice: {
		type: Number,
		required: [true, 'totalPrice is required']
	},
	orderedOn: {
		type: Date,
		default: Date.now	
	}
})

// Model
module.exports = mongoose.model('Cart', cartSchema);