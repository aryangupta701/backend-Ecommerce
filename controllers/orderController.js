const Order = require('../model/orderModel')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../util/errorhandler')
const Product = require('../model/productModel')

//create new order 
exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const {
        shippingInfo , 
        orderItems, 
        paymentInfo, 
        itemsPrice,
        taxPrice,
        shippingPrice, 
        totalPrice,
    } = req.body

    const order = await Order.create({
        shippingInfo , 
        orderItems, 
        paymentInfo, 
        itemsPrice,
        taxPrice,
        shippingPrice, 
        totalPrice,
        paidAt : Date.now(),
        user : req.user._id
    })

    res.status(201).json({
        success : true, 
        order
    })
})

//get all orders -- admin
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find()
    
    let totalAmount = 0 
    orders.forEach( order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success : true , 
        orders,
        totalAmount
    })
})

//get single Order Details
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user" , "name email")

    if(!order){
        return next(new ErrorHandler("Order not Found", 404))
    }

    res.status(200).json({
        success : true , 
        order
    })
})

//get logged in User Orders 
exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user : req.user._id})

    res.status(200).json({
        success : true , 
        orders
    })
})

//update order Status -- admin
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not Found", 404))
    }
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this product", 400))
    }
    
    order.orderItems.forEach(async(ord) => {
        await updateStock(ord.product , ord.quantity)
    })

    order.orderStatus = req.body.status
    if(req.body.status === "Delivered" ){
        order.deliveredAt = Date.now()
    }
    await order.save( {validateBeforeSave : false})
    res.status(200).json({
        success : true , 
    })
})

async function updateStock ( id , quantity){
    const product = await Product.findById(id);
    product.stock-=quantity

    await product.save({ validateBeforeSave: false });
}

//delete Order -- admin
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not Found", 404))
    }
    await order.remove()

    res.status(200).json({
        success : true , 
    })
})