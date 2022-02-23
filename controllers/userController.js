const User = require('../model/userModel')
const ErrorHandler = require('../util/errorhandler')
const catchAsyncError = require('../middlewares/catchAsyncError')

//register a User
exports.registerUser = catchAsyncError(async(req,res,next) => {
    const {name , email , password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar : {
            public_id : "sample public id",
            URL : "sample URL"
        }
    })
    res.status(201).json({
    success: true,
    user,
    })
})