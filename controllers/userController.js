const User = require('../model/userModel')
const ErrorHandler = require('../util/errorhandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const jwtToken = require('../util/jwtToken')
const req = require('express/lib/request')
const sendEmail = requie('../util/sendemail')

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
    jwtToken(user,201,res)
})

// login User
exports.loginUser = catchAsyncError(async(req,res,next) => {
    const {email, password} = req.body 
    if(!email || !password){
        return next( new ErrorHandler("Please Enter Email and Password " , 400))
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("User Not Found", 401))
    }
    const isCorrect = user.comparePassword(password)
    if(!isCorrect){
        return next(new ErrorHandler("Password Invalid" , 401))
    }
    jwtToken(user,200,res)
})

//logout User
exports.logOut = catchAsyncError(async(req,res,next)=>{
    res.cookie("token ", null , {
        expires : new Date(Date.now()),
        httpOnly : true
    })

    res.status(200).json({
        success : true , 
        message : "logged out Successfully"
    })
})

exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user  = await User.findOne({email : req.body.email})
    if(!user){
        return next(new ErrorHandler("User Not Found", 404))
    }

    const resetToken = user.getUserPasswordToken()
    await user.save({validateBeforeSave: false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `Your password reset Token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email them, please ignore it`
    try{
        await sendEmail({
            email : user.email,
            subject : "Ecommerce Password Reset",
            message
        })
        res.status(200).json({
            success : true , 
            message : `Email Sent to ${user.email} successfully !`
        })

    }catch(error){
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false})
        
        return next(new ErrorHandler(error.message , 500))
    }

})