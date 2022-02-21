const express = require('express')
const router = express.Router()
const {getAllProducts,
    newProduct,
    updateProduct} = require('../controllers/productController')
//get all products
router.route('/products').get(getAllProducts)

//to list new product
router.route('/product/new').post(newProduct)

//to update an existing product
router.route('/product/edit/:id').put(updateProduct)

// router.put()
// router.delete()

module.exports = router