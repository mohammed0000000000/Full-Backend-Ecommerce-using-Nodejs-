import UserModel from "../models/User.model";
import BadRequestError from "../errors/BadRequestError";
import CartProductModel from "../models/CartProduct.model";
import ProductModel from "../models/Product.model";
import {StatusCodes} from "http-status-codes";
import cartProductModel from "../models/CartProduct.model";

const addToCartItemController = async (req, res) => {
    const userId = req.userId;
    const {productId} = req.body;

    if(!productId)
        throw new BadRequestError("Product id is required");
    const user = await UserModel.findById(userId);
    if(!user){
        throw new BadRequestError("User not found");
    }

    const product = await ProductModel.findById(productId);
    if(!product)
        throw new BadRequestError("Product not found");

    const cartProduct = await CartProductModel.findOne({userId,productId});
    if(cartProduct)
        throw new BadRequestError("Product already in cart");

    const newCartProduct = new CartProductModel({
        userId,
        productId,
        quantity: 1
    });

    const saveCartProduct = await newCartProduct.save();

    const updateUser = await UserModel.updateOne({_id:userId},{
        $push: { shoppingCart: productId }
    })

    res.status(StatusCodes.OK).json({
        message: "Product added to cart successfully",
        cartProduct: saveCartProduct,
        success: true,
        error:false
    })
}
const getCartItemController = async (req, res) => {
    const userId = req.userId;

    const cartProducts = await CartProductModel.find({userId}).populate("productId");

    res.status(StatusCodes.OK).json({
        message: "Cart items fetched successfully",
        cartProducts,
        success: true,
        error: false
    })
}
const updateCartItemQtyController = async (req, res) => {
    const userId = req.userId;
    const {_id, quantity} = req.body;

    if(!userId){
        throw new BadRequestError("Missing UserId");
    }
    if(!_id ||!quantity)
        throw new BadRequestError("Product id and quantity are required");

    if(!await UserModel.findById(userId))
        throw new BadRequestError("User not found");


    const cartProduct = await cartProductModel.findById(_id);
    if(!cartProduct)
        throw new BadRequestError("Product not found");

    if(quantity <= 0)
        throw new BadRequestError("Invalid quantity");

    const updateCartProduct = await CartProductModel.updateOne({_id, userId}, {quantity});

    res.status(StatusCodes.OK).json({
        message: "Quantity updated successfully",
        cartProduct: updateCartProduct,
        success: true,
        error: false
    })
}
const deleteCartItemController = async (req, res)=>{
    const userId = req.userId;
    const {_id} = req.body;

    if(!userId){
        throw new BadRequestError("Missing UserId");
    }
    if(!_id)
        throw new BadRequestError("Product id is required");

    if(!await UserModel.findById(userId))
        throw new BadRequestError("User not found");

    const cartProduct = await CartProductModel.findOneAndDelete({_id, userId});
    if(!cartProduct)
        throw new BadRequestError("Product not found");

    res.status(StatusCodes.OK).json({
        message: "Product deleted from cart successfully",
        success: true,
        error: false,
        deletedCart:cartProduct
    })
}
module.exports = {addToCartItemController, getCartItemController, updateCartItemQtyController,deleteCartItemController}
