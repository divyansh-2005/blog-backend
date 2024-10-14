// contlollers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose'); // Import mongoose

// Sign Up
exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

        res.status(201).json({ token, user: newUser });
    } catch (error) {
        console.error('Error signing up:', error);
        if (error instanceof mongoose.Error) {
            return res.status(500).json({ message: 'Database connection error', error: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        if (error instanceof mongoose.Error) {
            return res.status(500).json({ message: 'Database connection error', error: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
