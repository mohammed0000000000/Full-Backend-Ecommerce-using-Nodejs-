const { Router } = require('express')
const auth = require("../middlewares/auth")
const {CashOnDeliveryOrderController,getOrderDetailsController,getOrderProductItems,paymentController, webhookStripe} = require("../controllers/order.controller")
const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)

module.exports = orderRouter;