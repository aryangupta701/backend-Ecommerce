const express = require("express");
const { processPayment, stripeKey } = require("../controllers/paymentController");
const router = express.Router()
const {isAuthorized} = require('../middlewares/auth')


router.route("/payment/process").post(isAuthorized,processPayment)
router.route("/stripeApiKey").get(isAuthorized,stripeKey)
module.exports = router;