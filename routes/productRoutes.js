const express = require('express')
const router = express.Router()
const {getAllProducts,
    newProduct,
    updateProduct,
    deleteProduct,
    getProduct} = require('../controllers/productController')
const {isAuthorized, authorizedRole} = require('../middlewares/auth')

//get all products
router.route('/products').get(getAllProducts)

//to list new product
router.route('/product/new').post(isAuthorized, authorizedRole("admin"), newProduct)

//to update an existing product & to delete an existing product & get one product information
router.route('/product/:id').put(isAuthorized , authorizedRole("admin"), updateProduct)
                            .delete(isAuthorized,authorizedRole("admin"),  deleteProduct)
                            .get(getProduct)

module.exports = router