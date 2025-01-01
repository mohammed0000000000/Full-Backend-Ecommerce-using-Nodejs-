const { Router } = require('express')
const auth = require ('../middlewares/auth.js');
const {deleteCategoryController,addCategoryController,getCategoryController,updateCategoryController} = require("../controllers/category.controller")
const categoryRouter = Router();

categoryRouter.post("/add-category",auth,addCategoryController)
categoryRouter.get('/get',getCategoryController)
categoryRouter.put('/update',auth,updateCategoryController)
categoryRouter.delete("/delete",auth,deleteCategoryController)

module.exports = categoryRouter