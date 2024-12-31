const BadRequestError = require("../errors/BadRequestError");
const CustomApiError = require("../errors/CustomApiError");
const {StatusCodes} = require("http-status-codes");
const SubCategoryModel = require("../models/SubCategory.model");

const addCategoryController = async (req, res) => {
    const {name, image} = req.body;
    if(!name || !image)
        throw new BadRequestError("Invalid request");
    const categoryModel = new CategoryModel({name, image});
    const newCategoryModel = await categoryModel.save();

    if(!newCategoryModel)
        throw new CustomApiError("Failed to add category");
    res.status(StatusCodes.CREATED).json({
        message: "Category added successfully",
        success: true,
        error: false,
        data: newCategoryModel
    })
}
const getCategoryController = async (req, res) => {
    const categories = await CategoryModel.find().sort({createdAt:-1});
    res.status(StatusCodes.OK).json({
        message: "Categories fetched successfully",
        success: true,
        error: false,
        data: categories
    })
}
const updateCategoryController = async (req, res) => {
    const {_id} = req.params;
    const {name, image} = req.body;
    if(!_id ||!name ||!image)
        throw new BadRequestError("Invalid request");
    const updatedCategory = await CategoryModel.findByIdAndUpdate(_id, {name, image}, {new: true});
    if(!updatedCategory)
        throw new CustomApiError("Failed to update category");
    res.status(StatusCodes.OK).json({
        message: "Category updated successfully",
        success: true,
        error: false,
        data: updatedCategory
    })
}
const deleteCategoryController = async (req, res) => {
    const {_id} = req.body;

    const checkSubCategory = await SubCategoryModel.find({
        category:{
            $in:[_id]
        }
    });
    const checkProduct = await ProductModel.find({
        category:{
            $in:[_id]
        }
    })
    if(checkProduct || checkSubCategory)
        throw BadRequestError("Can't delete category, Category already used");
    const deletedCategory = await CategoryModel.findByIdAndDelete(_id);
    if(!deletedCategory){
        throw new CustomApiError("Something went wrong");
    }
    res.status(StatusCodes.OK).json({
        message: "Category deleted successfully",
        success: true,
        error: false,
        data: deletedCategory
    })
}
module.exports ={addCategoryController,getCategoryController,updateCategoryController,deleteCategoryController}