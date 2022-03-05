const mongoose = require('mongoose')
const express = require('express')
const { newOrder, myOrders, getSingleOrder, getAllOrders, deleteOrder, updateOrder } = require('../controllers/orderController')
const router = express.Router()
const { isAuthorized , authorizedRole} = require('../middlewares/auth')

router.route('/order/new').post(isAuthorized, newOrder)

router.route('/order/:id').get(isAuthorized, getSingleOrder)

router.route('/orders/me').get(isAuthorized, myOrders)

router.route('/admin/orders').get(isAuthorized, authorizedRole("admin") , getAllOrders)


router.route('/admin/order/:id').put(isAuthorized, authorizedRole("admin"), updateOrder).
                                delete(isAuthorized, authorizedRole("admin"), deleteOrder)
                                
module.exports = router