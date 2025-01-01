import ProductModel from "../models/Product.model";
import CustomApiError from "../errors/CustomApiError";
import {StatusCodes} from "http-status-codes";
import BadRequestError from "../errors/BadRequestError";

const createProductController = async (req, res) => {
    const {
        name,
        image,
        category,
        subCategory,
        unit,
        stock,
        price,
        discount,
        description,
        more_details,
    } = req.body;

    if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description) {
        throw new BadRequestError("Invalid request");
    }
    const newProduct = new ProductModel({
        name,
        image,
        category,
        subCategory,
        unit,
        stock,
        price,
        discount,
        description,
        more_details,
    });

    await newProduct.save((err, product) => {
        if (err) throw new CustomApiError("Error saving product")
        res.status(StatusCodes.CREATED).json({
            message: "Product created successfully",
            success: true,
            error: false,
            data: product,
        });
    });
}
const getProductController = async (req, res) => {
    let {page, limit, search} = req.body;
    if(!page)
        page = 1;
    if(!limit)
        limit = 10;
    const query = search ? {
        $text:{
            $search: search
        }
    }:{};

    const skip = (page - 1) * limit;
    const [products, totalCount] = await Promise.all([
        ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit).populate("category subCategory"),
        ProductModel.countDocuments(query)
    ])
    res.status(StatusCodes.OK).json({
        message: "Products fetched successfully",
        success: true,
        error: false,
        data: products,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
    })
}
const getProductByCategory = async (req, res) => {
    const {id} = req.body;
    if (!id)
        throw new BadRequestError("Invalid category id");
    const products = await ProductModel.find({category: {$in: id}}).limit(15);
    res.status(StatusCodes.OK).json({
        message: "Products fetched successfully",
        success: true,
        error: false,
        data: products,
    })
}
const getProductByCategoryAndSubCategory = async (req, res) => {
    const {categoryId, subcategoryId,} = req.body;
    let { page, limit} = req.body;
    if (!categoryId ||!subcategoryId)
        throw new BadRequestError("Invalid category or subcategory id");

    if(!page) page = 1;
    if(!limit) limit = 10;

    const query = {category: {$in:categoryId}, subCategory: {$in:subcategoryId}};
    const skip = (page - 1) * limit

    const [data,dataCount] = await Promise.all([
        ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
        ProductModel.countDocuments(query)
    ])

    res.status(StatusCodes.OK).json({
        message: "Products fetched successfully",
        success:true,
        error: false,
        data,
        totalCount: dataCount,
        currentPage: page,
        totalPages: Math.ceil(dataCount / limit)
    })
}
const getProductDetails = async (req,res) => {
    const {productId} = req.body;
    if(!productId)
        throw new BadRequestError("Invalid product id");
    const product = await ProductModel.findById(productId).populate("category subCategory");
    if(!product)
        throw new BadRequestError("Invalid product id");
    res.status(StatusCodes.OK).json({
        message: "Product fetched successfully",
        success: true,
        error: false,
        data: product,
    })
}
const updateProductController = async (req, res) => {
    const {productId} = req.body;
    if(!productId)
        throw new BadRequestError("Invalid product id");
    const product = await ProductModel.findById(productId);
    if(!product)
        throw new BadRequestError("Product not found");

    const updatedProduct = await ProductModel.updateOne({_id:productId},{
        ...(req.body)
    })
    res.status(StatusCodes.OK).json({
        message: "Product updated successfully",
        success: true,
        error: false,
        data: updatedProduct,
    })
}
const deleteProductController = async (req, res) => {
    const {productId} = req.body;
    if(!productId)
        throw new BadRequestError("Invalid product id");
    const product = await ProductModel.findByIdAndDelete(productId);
    if(!product)
        throw new BadRequestError("Product not found");
    res.status(StatusCodes.OK).json({
        message: "Product deleted successfully",
        success: true,
        error: false,
    })
}
const searchProduct = async (req, res) => {
    let { search, page , limit } = req.body

    if(!page){
        page = 1
    }
    if(!limit){
        limit  = 10
    }

    const query = search ? {
        $text : {
            $search : search
        }
    } : {}

    const skip = ( page - 1) * limit

    const [data,dataCount] = await Promise.all([
        ProductModel.find(query).sort({ createdAt  : -1 }).skip(skip).limit(limit).populate('category subCategory'),
        ProductModel.countDocuments(query)
    ])

    return res.status(StatusCodes.OK).json({
        message : "Product data",
        error : false,
        success : true,
        data : data,
        totalCount :dataCount,
        totalPage : Math.ceil(dataCount/limit),
        page : page,
        limit : limit
    })
}
module.exports = {createProductController,deleteProductController, searchProduct,getProductController, getProductByCategory, getProductByCategoryAndSubCategory,getProductDetails,updateProductController}
