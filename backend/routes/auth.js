const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Create a User using POST: "/api/auth/". Login not required
router.post('/', [
        // name must be at least 3 chars long
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        // email must be an email
        body('email', 'Enter a valid Email').isEmail(),
        // password must be at least 5 chars long
        body('password', 'Enter a valid password').isLength({ min: 5 }),
    ],
    (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }).then(user => res.json(user))
        .catch(err=>{console.log(err)
        res.json({error: "This email already exists.", message: err.message})});
    },
)

module.exports = router;

