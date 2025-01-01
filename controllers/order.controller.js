import mongoose from "mongoose";
import OrderModel from "../models/Order.model";
import CategoryModel from "../models/Category.model";
import UserModel from "../models/User.model";
import {StatusCodes} from "http-status-codes";
import BadRequestError from "../errors/BadRequestError";
import priceWithDiscount from "../utils/priceWithDiscount";
import {Stripe} from "stripe";
import CustomApiError from "../errors/CustomApiError";
import AddressModel from "../models/Address.model";
import CartProductModel from "../models/CartProduct.model";


const CashOnDeliveryOrderController = async (req, res) => {
    const userId = req.userId;
    const {list_items, totalAmt, addressId, subTotalAmt} = res.body;

    const payload = list_items.map(item => {
        return ({
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId}`,
            productId: item.productId,
            productDetails: {
                name: item.name,
                image: item.image
            },
            paymentId: "",
            paymentStatus: "Pending",
            deliveryAddress: addressId,
            subTotalAmt,
            totalAmt,
        })
    })

    const generatedOrders = await OrderModel.insertMany(payload);

    const removeCartItems = await CategoryModel.deleteMany({userId: userId});
    const updatedUser = await UserModel.updateOne({userId: userId}, {
            shoppingCart: []
        }
    )
    res.status(StatusCodes.OK).json({
        message:"Order Successfully",
        error:false,
        success:true,
        data: generatedOrders,
        totalOrders: generatedOrders.length,
        totalAmount: totalAmt,
        subTotal: subTotalAmt,
    })
}
const paymentController = async (req,res) => {
    const userId = req.userId;
    const {list_items, addressId, totalAmount, subTotalAmt} = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
        throw BadRequestError("User not found");
    }
    if (list_items.length === 0)
        throw BadRequestError("No items found");

    if(! await AddressModel.findById(addressId))
        throw BadRequestError("Invalid address");

    const line_items = list_items.map((item) => {
        return ({
            price_data: {
                currency: "USD",
                product_data: {
                    name: item.name,
                    images: item.image,
                    metadata: {
                        productId: item._id,
                    }
                },
                unit_amount: priceWithDiscount(item.price, item.discount) * 100,
            },
            adjustable_quantity: {
                enabled: true,
                minimum: 1
            },
            quantity: item.quantity
        });
    })

    const params = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: user.email,
        metadata: {
            userId: userId,
            addressId: addressId
        },
        line_items: line_items,
        success_url : `${process.env.FRONTEND_URL}/success`,
        cancel_url : `${process.env.FRONTEND_URL}/cancel`
    }
    const session = await Stripe.checkout.sessions.create(params);
    if(!session)
        throw new CustomApiError("Operation Failed");
    res.status(StatusCodes.OK).json({
        message: "Payment initiated successfully",
        success: true,
        error: false,
        data: session
    });
}
const getOrderProductItems = async({ lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,}) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw BadRequestError("User not found");
    }

    if (!await AddressModel.findById(addressId))
        throw BadRequestError("Invalid address");
    const productList = [];
    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product)
            const paylod = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,
                product_details: {
                    name: product.name,
                    image: product.images
                },
                paymentId: paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmt: Number(item.amount_total / 100),
                totalAmt: Number(item.amount_total / 100),
            }
            productList.push(paylod)
        }
    }
    return productList;
}
const webhookStripe = async (req,res) => {
    const event = req.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event",event)

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
            const userId = session.metadata.userId
            const orderProduct = await getOrderProductItems(
                {
                    lineItems : lineItems,
                    userId : userId,
                    addressId : session.metadata.addressId,
                    paymentId  : session.payment_intent,
                    payment_status : session.payment_status,
                })

            const order = await OrderModel.insertMany(orderProduct)

            console.log(order)
            if(Boolean(order[0])){
                const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                    shopping_cart : []
                })
                const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
}
const getOrderDetailsController = async (req, res) => {
    const userId = req.userId;
    const orderList = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('deliveryAddress')
    res.status(StatusCodes.OK).json({
        message: "Order details fetched successfully",
        success: true,
        error: false,
        data: orderList,
        totalOrders: orderList.length,
    })
}
module.exports = {CashOnDeliveryOrderController, paymentController, getOrderProductItems, getOrderDetailsController,webhookStripe}