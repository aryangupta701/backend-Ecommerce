const ErrorHandler = require('../util/errorhandler')

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    //wrong mongoDB cast Error
    if(err.name === "CastError"){
        err = new ErrorHandler(`Resource Not Found . Invalid : ${err.path}`, 400)
    }

    //duplicate value error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    //wrong json web token error
    if(err.name === "jsonWebTokenError"){
        const message = `Json Web Token is invalid, try again`
        err = new ErrorHandler(message, 400)
    }

    //json web token expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is Expired`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success : false,
        message : err.message
        // error : err.stack
    })
}