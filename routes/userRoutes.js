const { registerUser, loginUser, logOut, forgotPassword, resetPassword, getUserDetails, updateUserDetails, updatePassword, getAllUsers, getSingleUser, deleteUser, updateUserRole} = require('../controllers/userController')
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
router.route('/profile/update').put(isAuthorized, updateUserDetails)

//update password
router.route('/profile/update/password').put(isAuthorized, updatePassword)

//get All users - Admin
router.route('/admin/users').get(isAuthorized, authorizedRole("admin"), getAllUsers)

//get single user, update role , delete user - admin 
router.route('/admin/user/:id').get(isAuthorized, authorizedRole("admin"), getSingleUser)
                                .put(isAuthorized, authorizedRole("admin"), updateUserRole)
                                .delete(isAuthorized, authorizedRole("admin"), deleteUser)


module.exports = router;