const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");

const Post = require("./post");

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    photo: {
        data: Buffer,
        contentType: String
    },
    role: {
        type: String,
        default: "subscriber"
    }
});

// Set "password" as virtual field
userSchema
    .virtual("password")
    .set(function(password) {
        // create temporary variable called _password
        this._password = password;
        // generate a timestamp
        this.salt = uuidv1();
        // encryptPassword()
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// Define 'user' schema methods
userSchema.methods = {
    authenticate: function(_password) {
        return this.encryptPassword(_password) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
        } catch (err) {
            return "";
        }
    }
};

// When users are deleted by themselves, their posts will be deleted automatically
userSchema.pre("remove", function(next) {
    Post.remove({ postedBy: this._id }).exec();

    next();
});

module.exports = mongoose.model("User", userSchema);
