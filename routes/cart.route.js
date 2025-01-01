const { Router } =require("express");
const auth = require("../middlewares/auth")
const {addToCartItemController,deleteCartItemController,getCartItemController,updateCartItemQtyController} = require("../controllers/cart.controller");
const cartRouter = Router()

cartRouter.post('/create',auth,addToCartItemController)
cartRouter.get("/get",auth,getCartItemController)
cartRouter.put('/update-qty',auth,updateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth,deleteCartItemController)

module.exports = cartRouter