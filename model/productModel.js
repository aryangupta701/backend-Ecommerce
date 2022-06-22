const mongoose = require('mongoose')
const productSchema =  new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
        type : String,
        required : [true,"Please Enter Product Name"]
    },
    description: {
        type : String,
        required : [true,"Please Enter Product Description"]
    },
    
    price: {
        type: Number,
        required: [true,"Please Enter Product Price"],
        maxlength : [8,"Please Enter a Valid Price"]
    },
    ratings : {
        type: Number , 
        default : 0
    },
    images : [
        {
        public_id : {
            type : String ,
            required : true
        },
        URL : {
            type : String ,
            required : true
        }
    }],
    category : {
        type : String,
        required : [true,"Please Enter Product Category"]
    },
    stock : {
        type : Number,
        required : [true,"Please Enter Product Stock"],
        maxlength : [4,"Enter Valid Stock Not more than 4 Characters"],
        default : 1
    },
    numOfReviews : {
        type : Number ,
        default : 0
    },
    reviews :[{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
        name : {
            type : String,
            required : [true, "Please Enter Your Name"]
        },
        rating : {
            type : Number ,
            required : true
        },
        comment: {
            type : String 
        }
    }],
    user : {
        // required : true,
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }

    
})

module.exports = mongoose.model('Product', productSchema);