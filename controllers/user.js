const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');
const User = require('../models/user');

// Return a user by id
// Extract a user/post object from db by their _id
// Once routes containing route parameter :userId/:postId
// This middleware will be called firstly, 
// and return the user/post immediately by specified _id
// Used with route.param('userId', userById) 
exports.userById = (req, res, next, id) => {
    User.findById(id)
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found.'
                });
            }

            // append "req" object with newly defined "profile" (property) object
            req.profile = user; 

            next();
        });
};

// Determine whether the current user have the authorizaiton to update or delete post 
// Only the users themselves have access to update or delete their own posts.
// Admin has the highest authority to update or delete subscribers' posts.
exports.hasAuthorization = (req, res, next) => {
    let isSubscriber = req.profile && req.auth && req.profile._id == req.auth._id;
    let isAdmin = req.profile && req.auth && req.auth.role === 'admin';

    const isAuthorized = isSubscriber || isAdmin;

    if (!isAuthorized) {
        return res.status(403).json({
            error: 'User is not authorized.'
        });
    }

    next();
};

// Return all users
exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }

        res.json(users);
    })
    .select('name email updated created role');
};

// Return single user
exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);
};

// Update single user
exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo uploading failed.'
            });
        }

        let user = req.profile;
        user = _.extend(user, fields);
        user.updated = Date.now();

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }

            user.hashed_password = undefined;
            user.salt = undefined;
           
            res.json(user);
        });
    });
};

// Return user's photo (user)
// Determine whether the photo exist
// Retrun the photo if it exists
exports.userPhoto = (req, res, next) => {
    // If photo exists
    if (req.profile.photo.data) {
        // Set the respond header 
        res.set(('Content-Type', req.profile.photo.contentType));
        // then return the photo
        return res.send(req.profile.photo.data);
    }

    next();
};

// Delete single user
exports.deleteUser = (req, res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ 
            // user: user
            message: 'User deleted successfully.' 
        });
    });
};