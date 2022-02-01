const dotenv = require('dotenv');
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

// Set path to .env file
dotenv.config({ path: './.env' });
const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1: Create a User using POST: "/api/auth/createuser". No login required
router.post('/createuser', [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid Email').isEmail(),
        body('password', 'Enter a valid password').isLength({ min: 5 }),
    ],
       async (req, res) => {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            // Check user this email already exists or not
            let user = await User.findOne({email: req.body.email});
            if(user){
                return res.status(400).json({error: 'Sorry a user this email already exists.'})
            }
            // Create a new user
            const salt = await bcrypt.genSaltSync(10);
            const secPass = await bcrypt.hashSync(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });
            const data = {
                user:{
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            res.json({authtoken});
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }        
    },
)

// ROUTE 2: authenticate a user using POST: "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
   ],
   async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    try {
        // Check user this email already exists or not
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: 'Please try to correct login credentials'});
        }
        
        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare){
            return res.status(400).json({error: 'Please try to correct login credentials'});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({authtoken});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }    
},
)

// ROUTE 3: Get logged in user details POST: "/api/auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        let user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }    
},
)

module.exports = router;

