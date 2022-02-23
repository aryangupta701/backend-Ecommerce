const express = require('express')
const router = express.Router()
const {getAllProducts,
    newProduct,
    updateProduct,
    deleteProduct,
    getProduct} = require('../controllers/productController')
//get all products
router.route('/products').get(getAllProducts)

//to list new product
router.route('/product/new').post(newProduct)

//to update an existing product & to delete an existing product & get one product information
router.route('/product/:id').put(updateProduct).delete(deleteProduct).get(getProduct)

module.exports = router