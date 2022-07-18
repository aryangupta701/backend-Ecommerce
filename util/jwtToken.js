//create Token and save in Cookie

const jwttoken = (user,statusCode, res)=>{


    const token = user.getJWTToken()
    //cookie options
    const options = {
        expires : new Date( 
            Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly : true,
        sameSite: None,
        secure : process.env.NODE_ENV === "PRODUCTION"
    }
    res.status(statusCode).cookie("token", token , options).json({
        success : true, 
        user, 
        token
    })
}

module.exports = jwttoken