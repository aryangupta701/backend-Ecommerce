const product = require('../model/productModel')
const ErrorHandler = require('../util/errorhandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ApiFeatures = require('../util/apifeatures')



//get all products
exports.getAllProducts = catchAsyncError( async(req,res) => {
    const apifeat = new ApiFeatures(product.find(), req.query).search().filter()
    const products = await apifeat.query
    res.status(200).json({
        status : true,
        products
    })
})


//create new product
exports.newProduct = catchAsyncError (async(req,res,next) => {
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
        useFindAndModify : true
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