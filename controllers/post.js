const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

const Post = require('../models/post');

// Return a post by id
// Extract a user/post object info from db by their _id
// Once routes containing route parameter :userId/:postId
// This middleware will be called firstly, 
// and return the user/post immediately by specified _id
// Used with route.param('postId', postById) 
exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id name role') // use populate() when fields in referenced model
        .select('_id title body created likes comments photo') // use select() to select fields of current model
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }

            req.post = post;

            next();
        });
};

// Determine whether the post is posted by current user
// Only the users themselves or amdin can modify or delete their own posts
exports.isPoster = (req, res, next) => {
    let isSubscriber = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    let isAdmin = req.post && req.auth && req.auth.role === 'admin';

    let isPoster = isSubscriber || isAdmin;

    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized.'
        });
    }

    next();
};

// Get all posts with pagination
exports.getPosts = async (req, res) => {
    // Get current page from req.query or use default value 1
    const currentPage = req.query.page || 1;
    // Return 6 posts per page
    const perPage = 6;
    let totalItems;

    const posts = await Post.find()
        // Count total posts and return the amount
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .populate('postedBy', '_id name')
                .select('_id title body created likes')
                .limit(perPage)
                .sort({ created: -1 });
        })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => console.log(err));
};

// Create a new post 
exports.createPost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true; // keep the image extension, like .png
    form.parse(req, (err, fields, files) => {
        // Handling error
        if (err) {
            return res.status(400).json({
                error: 'Image uploading failed.'
            });
        }

        // Handling fields
        let post = new Post(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        // Handling files
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        // Save post
        post.save((err, post) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};

// Return all posts created by the user
exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select('_id title body created likes')
        .sort('_created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        });
};

// Update a post 
// Same as create a new post
exports.updatePost = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        // Handling error 
        if(err) {
            return res.status(400).json({
                error: 'Photo uploading failed.'
            });
        }

        // Handling fields
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

        // Handling files
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, post) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }

            res.json(post);
        });
    });
};

// Delete a post 
exports.deletePost = (req, res) => {
    let post = req.post;

    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Post deleted successfully.'
        });
    });
};

// Return photo (post)
// Get the photo users uploaded and then respond the photo
exports.photo = (req, res) => {
    res.set('Content-Type', req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

// Return single post
exports.singlePost = (req, res) => {
    return res.json(req.post);
};

// Like a post
exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, 
        // If liked, pushing the user object into 'likes' field in 'post' model 
        { $push: { likes: req.body.userId } }, 
        { new: true }
    )
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
            res.json(result);
        }
    });
};

// Unlike a post 
exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, 
        // If unliked, pulling out the user object from 'likes' field in 'post' model
        { $pull: { likes: req.body.userId } }, 
        { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        } else {
            res.json(result);
        }
    });
};