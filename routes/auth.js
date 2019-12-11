const express = require('express');
const router = express.Router();

const { userById } = require('../controllers/user');
const { signup, signin, signout } = require('../controllers/auth');
const { userSignupValidator, userSigninValidator } = require('../validator');

// userByID() will be executed firstly if routes has routes parameter 'userId'
router.param('userId', userById);

/* =================================== */
/*   Signup & Signin & Signout Routes  */
/* =================================== */
// Post
router.post('/signup', userSignupValidator, signup);
router.post('/signin', userSigninValidator, signin);
// Get
router.get('/signout', signout);

module.exports = router;