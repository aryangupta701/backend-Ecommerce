const { registerUser, loginUser, logOut } = require('../controllers/userController')
const express = require('express')
const router = express.Router()

//register a user 
router.route('/register').post(registerUser)

//login a user
router.route('/login').post(loginUser)

//logout a user
router.route('/logout').post(logOut)
module.exports = router;