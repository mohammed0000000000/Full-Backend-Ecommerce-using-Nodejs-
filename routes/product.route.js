const  { Router }  =  require('express')
const auth = require("../middlewares/auth")
const admin = require("../middlewares/Admin")
const {createProductController,getProductByCategory,getProductByCategoryAndSubCategory,searchProduct,getProductDetails,deleteProductController,getProductController,updateProductController} = require("../controllers/product.controller")
const productRouter = Router()

productRouter.post("/create",auth,admin,createProductController)
productRouter.post('/get',getProductController)
productRouter.post("/get-product-by-category",getProductByCategory)
productRouter.post('/get-pruduct-by-category-and-subcategory',getProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)

//update product
productRouter.put('/update-product-details',auth,admin,updateProductController)

//delete product
productRouter.delete('/delete-product',auth,admin,deleteProductController)

//search product
productRouter.post('/search-product',searchProduct)

module.exports = productRouter