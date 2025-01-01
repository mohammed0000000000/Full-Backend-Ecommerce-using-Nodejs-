import BadRequestError from "../errors/BadRequestError";
import CategoryModel from "../models/Category.model";
import SubCategoryModel from "../models/SubCategory.model";
import {StatusCodes} from "http-status-codes";

const addSubCategoryController = async (req, res) => {
    const {name, image, category} = req.body;
    if(!name ||!category)
        throw new BadRequestError("Invalid request");
    if(!await CategoryModel.findById(category))
        throw new BadRequestError("Invalid category id");
    const subCategoryModel =
        new SubCategoryModel({name, image, category});
    res.status(StatusCodes.CREATED).json({
        message: "Subcategory added successfully",
        subCategory: subCategoryModel,
        success: true,
        error: false,
     });
}
const getSubCategoryController = async (req, res) =>{
    const  subCategories = await SubCategoryModel.find({}).sort({createdAt:-1}).
    populate("category");
    res.status(StatusCodes.OK).json({
        message: "Subcategories fetched successfully",
        success: true,
        error: false,
        data: subCategories,
     });
}
const updateSubCategoryController = async (req, res) => {
    const { _id, name, image,category } = req.body

    const checkSub = await SubCategoryModel.findById(_id)

    if(!checkSub)throw  BadRequestError("Invalid subCategory id")

    const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
        name,
        image,
        category
    })

    return res.status(StatusCodes.OK).json({
        message : 'Updated Successfully',
        data : updateSubCategory,
        error : false,
        success : true
    })
}
const deleteSubCategoryController = async (req, res) => {
    const { _id } = req.body
    const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)
    if(!deleteSub) throw  BadRequestError("Invalid subCategory id")
    return res.status(StatusCodes.OK).json({
        message:"Delete Sub Category",
        data: deleteSub,
        error: false,
        success: true,

    })
}
module.exports = {addSubCategoryController,getSubCategoryController,updateSubCategoryController,deleteSubCategoryController}