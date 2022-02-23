const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : [true,"Please Enter Your Name"],
        maxlength : [30,"Name Cannot Exceed 30 Characters"],
        minlength : [4,"Name Should Have Minimum 4 Characters"]
    },
    email:{
        type : String,
        required : [true,"Please Enter Your Email"],
        unique : [true, "Account Already Exists Please Go to login Page"],
        validate : [validator.isEmail , "Please Enter a Valid Email"]
    },
    password: {
        type : String,
        required : [true,"Please Enter Your Password"],
        minlength : [4,"Password Should Have Minimum 8 Characters"],
        select : false
    },
    avatar: {
        public_id : {
            type : String ,
            required : true
        },
        URL : {
            type : String ,
            required : true
        }
    },
    role : {
        type : String,
        default : "User"
    },
    resetPasswordToken : String, 
    resetPasswordExpire : Date
})

module.exports = mongoose.model("User" ,userSchema)