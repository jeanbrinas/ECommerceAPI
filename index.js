const express = require("express");
const mongoose = require("mongoose");

// Google Login
const passport = require("passport");
const session = require("express-session");
require("./passport");

// Allows our backend application to be available to our frontend application
// Allows us to control the app's Cross Origin Resource Sharing settings
const cors = require("cors");
require('dotenv').config();

// Allows access to routes defined within our application
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// Environment setup
// const port = 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const corsOptions = {
	//client/Frontend application URL
	// Allow requests from this origin (The client's URL) the origin is in array form if there are multiple origins.
	origin: ['http://localhost:3000', 'http://zuitt-bootcamp-prod-422-7235-brinas.s3-website.us-east-1.amazonaws.com'],
	// Allow only specified headers // optional only if you want to restrict the headers
    //allowedHeaders: ['Content-Type', 'Authorization'], 
	credentials: true,
	// Allow only specified HTTP methods // optional only if you want to restrict the methods
	// methods: ['GET', 'POST']
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Google Login
// Creates a session with the given data
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

// Groups all routes in userRoutes under "/users"
app.use("/b4/users", userRoutes);

// Groups all routes in productRoutes under "/products"
app.use("/b4/products", productRoutes);

// Groups all routes in cartRoutes under "/cart"
app.use("/b4/cart", cartRoutes);

// Groups all routes in cartRoutes under "/orders"
app.use("/b4/orders", orderRoutes);

if(require.main === module) {
	// "process.env.PORT || 3000" will use the environment variable if it is available OR will used port 3000 if none is defined
	// This syntax will allow flexibility when using the application locally or as a hosted application
	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	})
}

module.exports = { app, mongoose };