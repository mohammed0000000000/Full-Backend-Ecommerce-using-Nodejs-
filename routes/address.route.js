
const { Router } = require('express');
const {addAddressController,deleteAddressController,getAddressController,updateAddressController} = require("../controllers/address.controller")
const auth = require("../middlewares/auth");
const addressRouter = Router();

addressRouter.post('/create',auth,addAddressController)
addressRouter.get("/get",auth,getAddressController)
addressRouter.put('/update',auth,updateAddressController)
addressRouter.delete("/disable",auth,deleteAddressController)

module.exports = addressRouter;