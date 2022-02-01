const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Set path to .env file
dotenv.config({ path: './.env' });
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next)=>{
    //Get the user from jwt token details and add id to request object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send('Please authenticate using a valid token');
    }

    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
}

module.exports = fetchuser;

