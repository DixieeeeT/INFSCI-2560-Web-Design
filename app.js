const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const cors = require('cors');
const dotenv = require('dotenv').config();

/* =================================== */
/*            Use middelware           */
/* =================================== */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

/* =================================== */
/*              Database               */
/* =================================== */
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB Connected"));

mongoose.connection.on("connected", () => { //connected
    console.log("Database connected.");
});

mongoose.connection.on("error", err => { // error
    console.log(`Database connection error: ${ err.message }`);
});

mongoose.connection.on("disconnected", () => { //disconnected
    console.log("Database disconnected.")
});

/* =================================== */
/*      Load routes & Use routes       */
/* =================================== */
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
app.use('/api', postRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);

/* =================================== */
/*     UnauthorizedError Handler       */
/* =================================== */
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized User.' });
    }
});

/* =================================== */
/*           Listening Port            */
/* =================================== */
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
