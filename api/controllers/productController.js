const product = require('../model/productModel')


//get all products
exports.getAllProducts = (req,res) => {
    product.find().exec().then((doc)=>{
        console.log(doc)
        res.status(200).json(doc)
    }).catch(err=>{
        console.log(err)
    })
}


//create new product
exports.newProduct = async(req,res,next) => {
    const createdProd = await product.create(req.body);

    res.status(201).json({
    success: true,
    createdProd,
    });
}

exports.updateProduct = async(req,res,next) => {
    let prod = await product.findById(req.params.id)
    if(!prod){
        return res.status(500).json({
            success : false,
            message : "Product Not found"
        })
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
}