const { Router } =  require("express");
const auth =  require("../middlewares/auth");
const {addSubCategoryController,deleteSubCategoryController,getSubCategoryController,updateSubCategoryController} = require("../controllers/subCategory.controller");
const subCategoryRouter = Router()

subCategoryRouter.post('/create',auth,addSubCategoryController)
subCategoryRouter.post('/get',getSubCategoryController)
subCategoryRouter.put('/update',auth,updateSubCategoryController)
subCategoryRouter.delete('/delete',auth,deleteSubCategoryController)

module.exports = subCategoryRouter