const User = require('../model/userModel')
const ErrorHandler = require('../util/errorhandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const jwtToken = require('../util/jwtToken')
// const req = require('express/lib/request')
const sendEmail = require('../util/sendemail')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
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
    const isCorrect = await user.comparePassword(password)
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

    const resetToken = user.getResetPasswordToken()
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


//RESET PASSWORD 
exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        resetPasswordToken , 
        resetPasswordExpire : {$gt : Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Reset Password Token is Invalid or has expired !", 400))
    }

    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler("Password donot match", 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    //user logged in
    jwtToken(user,200,res)
})

//getUserDetails
exports.getUserDetails = catchAsyncError( async ( req,res,next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success : true, 
        user
    })
})

//updateUserDetails 
exports.updateUserDetails = catchAsyncError(async(req,res,next)=>{
    let user = await User.findById(req.user.id)

    user = await User.findByIdAndUpdate(req.user.id , req.body, {
        new: true, 
        runValidators:true,
        useFindAndModify : true
    })

    res.status(200).json({
        success: true, 
        message: "User Details Updated",
        user
    })
})

//changePassword
exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user  = await User.findById(req.user.id).select("+password")

    const isMatched = await user.comparePassword(req.body.oldPassword)

    if(!isMatched){
        return next(new ErrorHandler("Old Password is Incorrect", 400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Confirm Password do not match with new Password" , 400))
    }

    user.password = req.body.newPassword
    await user.save()
    
    res.status(200).json({
        success : true, 
        message : "Password Changed Successfully"
    })
})

