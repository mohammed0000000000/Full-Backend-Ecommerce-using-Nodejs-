import AddressModel from "../models/Address.model";
import UserModel from "../models/User.model";
import {StatusCodes} from "http-status-codes";

const addAddressController = async (req, res)=>{
    const userId = req.userId; // from middleware
    const { address_line , city, state, pincode, country,mobile } = req.body

    const createdAddress = new AddressModel({
        address_line, city, state, pincode, country, mobile, userId
    })
    const savedAddress = await createdAddress.save();
    await UserModel.findByIdAndUpdate(userId, {
        $push: { addressDetails: savedAddress._id }
    })
    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Address added successfully",
        data: savedAddress
    })
}
const getAddressController = async (req, res) => {
    const userId = req.userId;
    const address = await AddressModel.find({userId:userId}).sort({createdAt:-1})
    return res.status(StatusCodes.OK).json({
        message:"List of Address",
        data:address,
        error:false,
        success:true
    })
}
const updateAddressController = async (req, res) => {
    const userId = req.userId; //from auth middleware
    const {_id, address_line,city,state,country,pincode, mobile} = req.body

    const updatedAddress = await AddressModel.updateOne({_id:_id, userId:userId},{
        address_line,city,state,country,pincode, mobile
    })
    return res.status(StatusCodes.OK).json({
        message:"Address updated successfully",
        data:updatedAddress,
        error:false,
        success:true
    })
}
const deleteAddressController = async (req, res) => {
    const userId = req.userId; //from auth middleware
    const {_id} = req.body

    const disableAddress = await AddressModel.updateOne({_id:_id, userId:userId},{
        status:false
    })
    return res.status(StatusCodes.OK).json({
        message:"Address deleted successfully",
        data:disableAddress,
        error:false,
        success:true
    })
}
module.exports = {addAddressController,getAddressController,updateAddressController,deleteAddressController}