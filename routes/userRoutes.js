const { registerUser, loginUser, logOut, forgotPassword, resetPassword, getUserDetails, updateUserDetails, updatePassword} = require('../controllers/userController')
const express = require('express')
const router = express.Router()
const { isAuthorized , authorizedRole } = require('../middlewares/auth')


//register a user 
router.route('/register').post(registerUser)

//login a user
router.route('/login').post(loginUser)

//change password of a user
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

//logout a user
router.route('/logout').post(logOut)


//getUserDetails
router.route('/profile').get(isAuthorized, getUserDetails)

//update user details
router.route('/profile/update').post(isAuthorized, updateUserDetails)

//update password
router.route('/profile/update/password').post(isAuthorized, updatePassword)

module.exports = router;