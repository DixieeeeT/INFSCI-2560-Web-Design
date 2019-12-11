const express = require("express");
const router = express.Router();

const { userById, allUsers, getUser, updateUser, 
        deleteUser, userPhoto, hasAuthorization} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

// userByID() will be executed firstly if routes has routes parameter 'userId'
router.param("userId", userById);

/* =================================== */
/*             User Routes             */
/* =================================== */
// Get 
router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
// Put
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);
// Delete
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);

/* =================================== */
/*           Photo Routes              */
/* =================================== */
// Get 
router.get("/user/photo/:userId", userPhoto);

module.exports = router;