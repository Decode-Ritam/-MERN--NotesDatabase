// import express.js function..............
const express = require('express');
// import User Schema function..............
const User = require('../modles/User');
// import express router function..............
const router = express.Router();
// import express-validator function for validationResult..............
const { body, validationResult } = require('express-validator');
// import bcrypt function for decrupting password..............
const bcrypt = require('bcryptjs');
// import jwt(Json Web Token) function for Tokenaise operations..............
require('dotenv').config();
const jwt = require('jsonwebtoken');
//Declear jwt_Secrect key..............
const jwt_Secrect = process.env.JWTSECRECTCODE;
// import fetchuser function .............
const fetchuser = require('../middleware/fetchuser')


//Route:1 Create a User usihg:POST "/api/auth/createuser" . Don't Require auth.
router.post('/createuser', [
  body('name', 'Enter a valid name,min:3 character').isLength({ min: 3 }),
  body('email', 'Enter a valid email ').isEmail(),
  body('password', 'Enter a valid password,min:6 character').isLength({ min: 6 })
], async (req, res) => {
  let success = false;
  // If therer errors, return bad  request and the errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    // Check if the user have the email exist already.
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      success = false;
      return res.json({ success, error: 'Sorry user with this email already exist.' })

    }
    const salt = await bcrypt.genSaltSync(10);
    const SecPassword = await bcrypt.hashSync(req.body.password, salt);

    user = await User.create({

      name: req.body.name,
      email: req.body.email,
      password: SecPassword

    })

    const data = {
      user: {
        id: user.id
      }

    }

    const token = jwt.sign(data, jwt_Secrect);
    success = true;
    res.json({ success, token })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")

  }
})



//Route:2  Authenticate a User usihg:POST "/api/auth/login" . No login required.
router.post('/login', [
  body('email', 'Enter a valid email ').isEmail(),
  body('password', 'Password can not be blank').exists()
], async (req, res) => {
  let success = false;
  // If therer errors, return bad  request and the errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body
  try {
    // Check if the user have the email exist already.
    let user = await User.findOne({ email });

    if (!user) {
      success = false;
      return res.status(400).json({ success, errors: "Please try to login with correct credentials/user" })
    }

    const passwordcompare = await bcrypt.compare(password, user.password);
    if (!passwordcompare) {
      success = false;
      return res.status(400).json({ success, errors: "Please try to login with correct credentials/passwordcompare" })
    }
    const mydata = {
      user: {
        id: user.id
      }

    }
 
    const expiresIn =   { expiresIn: '10s' }
    const token = jwt.sign(mydata, jwt_Secrect, expiresIn);

    success = true;
    res.json({ success, token, expiresIn })


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")

  }
})

//Route:3  Get logdin user details usihg:POST "/api/auth/getuser" . login required.
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    // Check if user.
    const userId = req.user.id
    const user = await User.findById(userId).select("-password");
    res.json(user)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")

  }
})
module.exports = router;


