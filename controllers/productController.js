const product = require('../model/productModel')
const ErrorHandler = require('../util/errorhandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ApiFeatures = require('../util/apifeatures')
const cloudinary = require('cloudinary')

//get all products
exports.getAllProducts = catchAsyncError( async(req,res,next) => {
    const productperpage = 8
    const productCount = await product.countDocuments()
    const apifeat = new ApiFeatures(product.find(), req.query).search().filter()
    let products = await apifeat.query
    const filteredProductsCount = products.length

    apifeat.pagination(productperpage)
    products = await apifeat.query.clone()

    res.status(200).json({
        status : true,
        products,
        productCount,
        filteredProductsCount,
        resultPerPage: productperpage
    })
})

exports.getAdminProducts = catchAsyncError( async(req,res,next) => {
    const products = await product.find()

    res.status(200).json({
        status : true,
        products
    })
})

//create new product
exports.newProduct = catchAsyncError (async(req,res,next) => {
    let images = []
    if(typeof(req.body.images) === "string"){
        images.push(req.body.images)
    }
    else images = req.body.images
    let imagesLink = []
    for(let i=0; i<images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{folder:"products"})
        imagesLink.push({
            public_id: result.public_id,
            URL : result.secure_url
        })
    }
    req.body.images = imagesLink
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
    let images = []
    if(typeof(req.body.images) === "string"){
        images.push(req.body.images)
    }
    else images = req.body.images

     //deleting cloudinary images 
     for(let i=0; i<prod.images.length; i++){
        await cloudinary.v2.uploader.destroy(prod.images[i].public_id)
    }

    let imagesLink = []
    for(let i=0; i<images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{folder:"products"})
        imagesLink.push({
            public_id: result.public_id,
            URL : result.secure_url
        })
    }

    req.body.images = imagesLink

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
    const Product = await product.findById(req.params.id)
    
    if(!Product){
        return next(new ErrorHandler("Product Not Found", 404))
    }
    //deleting cloudinary images 
    for(let i=0; i<Product.images.length; i++){
        await cloudinary.v2.uploader.destroy(Product.images[i].public_id)
    }

    product.deleteOne({_id : req.params.id}).then(res.status(200).json({
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
        product : prod
    })
})

//create new review or edit review 
exports.createProductReview = catchAsyncError(async(req,res,next)=>{

    const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const Product = await product.findById(productId);

  const isReviewed = Product.reviews.find(
    (rev) => String(rev.user) === String(req.user._id)
  );

  if (isReviewed) {
    Product.reviews.forEach((rev) => {
      if (String(rev.user) === String(req.user._id))
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    Product.reviews.push(review);
    Product.numOfReviews = Product.reviews.length;
  }

  let avg = 0;

  Product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  Product.ratings = avg / Product.reviews.length;

  await Product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    review
  });
})

//get all the reviews of a product 
exports.getAllReviews = catchAsyncError(async(req,res,next)=>{
    const Product = await product.findById(req.query.id)
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
    const Product = await product.findById(req.query.productId)
    if(!Product){
        return next(new ErrorHandler("Product Not Found",404))
    } 
    // console.log(Product)
    const reviews = Product.reviews.filter((rev) => String(rev._id) !== String(req.query.id))

    let avg = 0
    reviews.forEach( (rev) => {
        avg += rev.rating
    })

    avg = avg/reviews.length
    const numOfReviews = reviews.length

    let ratings = 0

    if (reviews.length === 0) {
      ratings = 0
    } else {
      ratings = avg / reviews.length;
    }
    await product.findByIdAndUpdate(req.query.productId, {
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