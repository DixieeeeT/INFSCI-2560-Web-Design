const express = require('express');
const router = express.Router();

const { userById } = require('../controllers/user');
const { getPosts, createPost, postsByUser, postById, isPoster,
        updatePost, deletePost, photo, singlePost, like, unlike } = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { createPostValidator } = require('../validator');

// userByID() will be executed firstly if routes has routes parameter 'userId'
router.param('userId', userById);
// postByID() will be executed firstly if routes has routes parameter 'postId'
router.param('postId', postById);

/* =================================== */
/*         Like & Unlike Routes        */
/* =================================== */
// Put
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

/* =================================== */
/*           Posts Routes              */
/* =================================== */
// Get 
router.get('/posts', getPosts);
router.get('/post/:postId', singlePost);
router.get('/posts/by/:userId', requireSignin, postsByUser);
// Post
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
// Put
router.put('/post/:postId', requireSignin, isPoster, updatePost);
// Delete
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

/* =================================== */
/*          Photo Route                */
/* =================================== */
// Get
router.get('/post/photo/:postId', photo);

module.exports = router;