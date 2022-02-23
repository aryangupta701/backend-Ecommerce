const { registerUser } = require('../controllers/userController')
const express = require('express')
const router = express.Router()

//register a user 
router.route('/register').post(registerUser)

//
module.exports = router;