const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const dotenv = require('dotenv').config();

const User = require('../models/user');

// Sign up
exports.signup = async (req, res) => {
    const currentUser = await User.findOne({ email: req.body.email });
    if (currentUser) {
        return res.status(403).json({
            error: 'Email is already existed. Please try again.'
        });
    }

    const newUser = await new User(req.body);
    await newUser.save();
    res.json({
        message: 'Sign up successfully. Please sign in.'
    });
};

// Sign in
exports.signin = (req, res) => {
    const { email, password } = req.body;
    // Find the user by email
    User.findOne({ email }, (err, user) => {
        // If err or no user
        if (err || !user) {
            return res.status(401).json({
                error: 'User does not exist. Please sign up.'
            });
        }

        // Authenticate password
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password do not match. Please try again.'
            });
        }

        // Generate a token with user id and secret
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

        // Set the token as 'token' in cookie with expiry date
        res.cookie('token', token, { expire: new Date() + 8848 });

        // Respond with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({
            token,
            user: { _id, email, name, role }
        });
    });
};

// Sign out
// Clear the token with name 'token'
exports.signout = (req, res) => {
    res.clearCookie('token');
    return res.json({ 
        message: 'Sign out successfully.' 
    });
};

// Require login (Access Control)
// Create posts/access some contents only after signin
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});
