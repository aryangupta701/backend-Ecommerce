const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require ( 'jsonwebtoken' )

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
userSchema.pre("save" , async function(next){
    if(!this.isModified("password"))
    next();

    this.password = await bcrypt.hash(this.password, 10)
})

//JWT TOKEN
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id:this._id} , process.env.SECRET, {
        expiresIn : process.env.JWT_EXPIRE
    })
}

//compare passwords
userSchema.methods.comparePassword  = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User" ,userSchema)