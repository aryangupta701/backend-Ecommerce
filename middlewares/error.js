const ErrorHandler = require('../util/errorhandler')

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    //wrong mongoDB cast Error
    if(err.name === "CastError"){
        err = new ErrorHandler(`Resource Not Found . Invalid : ${err.path}`, 400)
    }

    res.status(err.statusCode).json({
        success : false,
        error : err.message
        // error : err.stack
    })
}