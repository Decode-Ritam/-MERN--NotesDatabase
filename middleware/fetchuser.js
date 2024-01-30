require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwt_Secrect = process.env.JWTSECRECTCODE;


const fetchuser = (req, res, next) => {
    // Get user form jwt token and add id to req obj
    const token = req.header("auth-token")
    if (!token) {
        res.status(401).send("Please authenticate With token! ")
    }
    try {
        const data = jwt.verify(token, jwt_Secrect);
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).send("Please authenticate using a valid token!")

    }
}

module.exports = fetchuser;