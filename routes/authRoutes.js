const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//http://localhost:3500/api/auth/signup

/*
{
  "username": "",
  "email": "",
  "password": "",
  "fullName": ""
}
*/

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;

        if (!username || !email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or Username already exists" });
        }

        const newUser = new User({
            username,
            email,
            password,
            fullName
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

//http://localhost:3500/api/auth/login

/*
{
  "email": "",
  "password": ""
}
*/

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // 3. Generate Token
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(payload, 'social_connect_secret', { expiresIn: '1h' });

        return res.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/logout', (req, res) => {
    res.json({ message: "Logged out successfully" });
});
module.exports = router;