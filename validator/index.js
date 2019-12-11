/* =================================== */
/*             Validtors               */
/* =================================== */
// Validate post created
exports.createPostValidator = (req, res, next) => {
    // 'title' field
    req.check('title', 'Title required. Please write a title.').notEmpty();
    req.check('title', 'Title only allows 4 to 150 characters.')
        .isLength({
            min: 4,
            max: 150
        }
    );

    // 'body' field
    req.check('body', 'Body required. Please write a body.').notEmpty();
    req.check('body', 'Body only allows 4 to 2000 characters.')
        .isLength({
            min: 4,
            max: 2000
        }
    );

    // Error handling
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }

    next();
};

// Validate user when signning up
exports.userSignupValidator = (req, res, next) => {
    // 'name' field
    req.check('name', 'Name is required. Please write your name.').notEmpty();
    // 'email' field
    req.check('email', 'Invalid email. Email must be between 3 to 32 characters.')
        .matches(/.+\@.+\..+/)
        .withMessage('Email address must contain @.')
        .isLength({
            min: 4,
            max: 2000
        });

    // Check password
    req.check('password', 'Password is required.').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters.')
        .matches(/\d/)
        .withMessage('Password must contain a number.');

    // Check errors
    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
  
    next();
};

// Validate user when sign in
exports.userSigninValidator = (req, res, next) => {
    req.check('email', 'Invalid email. Email must be between 3 to 32 characters.')
        .matches(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)
        .withMessage('Invalid emaili address. Please type valid email address.')
        .isLength({
            min: 4,
            max: 32
        });

    req.check('password', 'Password required.').notEmpty();

    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password is invalid. Please try again.');

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }

    next();
};
