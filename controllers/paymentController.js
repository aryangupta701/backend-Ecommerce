const catchAsyncError = require('../middlewares/catchAsyncError')
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`)

exports.processPayment = catchAsyncError(async(req,res,next)=>{
    const myPayment = await stripe.paymentIntents.create({
        amount : req.body.amount, 
        currency: "inr",
        metadata: {
            company : "Ecommerce"
        }
    })
    // console.log(myPayment)
    res.status(200).json({
        success: true, 
        client_secret : myPayment.client_secret
    })
})

exports.stripeKey = catchAsyncError(async(req,res,next)=> {
    res.status(200).json({
        success: true, 
        stripeApiKey : `${process.env.STRIPE_PUBLISHABLE_KEY}`
    })
})