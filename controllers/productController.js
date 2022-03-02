const product = require('../model/productModel')
const ErrorHandler = require('../util/errorhandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ApiFeatures = require('../util/apifeatures')



//get all products
exports.getAllProducts = catchAsyncError( async(req,res) => {
    const productperpage = 2
    const productCount = await product.countDocuments()
    const apifeat = new ApiFeatures(product.find(), req.query).search().filter().pagination(productperpage)
    const products = await apifeat.query
    res.status(200).json({
        status : true,
        products,
        productCount
    })
})


//create new product
exports.newProduct = catchAsyncError (async(req,res,next) => {

    req.body.user = req.body.id 
    
    const createdProd = await product.create(req.body);

    res.status(201).json({
    success: true,
    createdProd,
    });
})

//update product
exports.updateProduct = catchAsyncError(async(req,res,next) => {
    let prod = await product.findById(req.params.id)
    if(!prod){
        return next(new ErrorHandler("Product Not Found",404))
    }
    prod = await product.findByIdAndUpdate(req.params.id , req.body, {
        new: true, 
        runValidators:true,
        useFindAndModify : false
    })
    res.status(200).json({
        success: true, 
        message: "product Updated",
        prod
    })
})

//delete a product
exports.deleteProduct = catchAsyncError( async(req,res,next) => {
    product.remove({_id : req.params.id}).then(res.status(200).json({
        success : true,
        message : "Removed Successfully"
    })).catch(err=>{
        console.log(err)
    })
})

//get a single product 
exports.getProduct = catchAsyncError( async(req,res,next)=>{
    const prod = await product.findById({_id:req.params.id})
    if(!prod){
        return next(new ErrorHandler("Product Not Found",404))
    }
    res.status(200).json({
        success : true ,
        prod
    })
})

//create new review or edit review 
exports.createProductReview = catchAsyncError(async(req,res,next)=>{

    const {rating, comment , productId} = req.body
    const review = {
        user : req.user._id, 
        name : req.user.name , 
        rating : Number(rating),
        comment
    }

    const Product = await product.findById(productId)
    const isReviewed = Product.reviews.find( rev => rev.user.toString() === req.user._id)
    if(isReviewed){
<<<<<<< HEAD
        Product.reviews.forEach(rev => {
=======
        Product.reviews.forEach((rev) => {
>>>>>>> 496b7e45b0429c3062dba6ed20f4c3293f09122a
            if(rev.user.toString() === req.user._id){
                rev.rating = rating 
                rev.comment = comment 
                
            }
            
        })
    }
    else {
        Product.reviews.push(review)
<<<<<<< HEAD
        Product.numofReviews = Product.reviews.length
=======
        // Product.numOfReviews = Product.reviews.length
>>>>>>> 496b7e45b0429c3062dba6ed20f4c3293f09122a
    }

    let avg = 0
    Product.ratings = Product.reviews.forEach( rev=> {
<<<<<<< HEAD
        avg += rev.ratings
=======
        avg += rev.rating
>>>>>>> 496b7e45b0429c3062dba6ed20f4c3293f09122a
    })
    avg = avg/Product.reviews.length

    await Product.save({
        validateBeforeSave: false
    })

    res.status(200).json({
        success : true, 
        message : "reviewed Successfully"
    })
})

//get all the reviews of a product 
exports.getAllReviews = catchAsyncError(async(req,res,next)=>{
    const Product = product.findById(req.query.id)
    if(!Product){
        return next(new ErrorHandler("Product Not Found",404))
    }

    res.status(200).json({
        success : true , 
        reviews : Product.reviews
    })
})

//delete review
exports.deleteReview = catchAsyncError(async(req,res,next)=>{
    const Product = product.findById(req.query.productId)
    if(!Product){
        return next(new ErrorHandler("Product Not Found",404))
    }

    const reviews = Product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    let avg = 0
    const ratings = reviews.forEach( rev=> {
        avg += rev.ratings
    })
    avg = avg/reviews.length
    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId , {
        reviews, 
        ratings,
        numOfReviews
    }, 
    {
        new : true,
        runValidators : true,
        useFindAndModify : false
    }

    )

    res.status(200).json({
        success : true , 
        reviews
    })
})