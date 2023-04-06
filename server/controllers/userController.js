// Load environment variables from .env file
require('dotenv').config();

// Import required packages and models
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Expense = require('../models/expense');

// Generate access token for user
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRATION,
    });
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = generateAccessToken(user);

        // Return the token to the client
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(400).json({ error: 'Invalid email or password' });
        } else {
            // Check if the password is valid
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                const token = generateAccessToken(user);

                // Return the token and user's premium status to the client
                res.status(201).json({ token, isPremium: user.isPremium });
            } else {
                res.status(400).json({ error: 'Invalid email or password' });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Export the functions as module
module.exports = {
    createUser,
    loginUser,
};
