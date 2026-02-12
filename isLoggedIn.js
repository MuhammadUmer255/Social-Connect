const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "You must be logged in to perform this action!" });
    }

    try {
        const decoded = jwt.verify(token, 'social_connect_secret');
        console.log("Decoded JWT Payload:", decoded);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};