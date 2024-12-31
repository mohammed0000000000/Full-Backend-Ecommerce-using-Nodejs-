import BadRequestError from "../errors/BadRequestError";
import UserModel from "../models/User.model";
import sendEmail from "../configuration/sendEmail";
import verifyEmailTemplate from "../utils/verifyEmailTemplate";
import {StatusCodes} from "http-status-codes";
import generateAccessToken from "../utils/generateAccessToken";
import generateRefreshToken from "../utils/generateRefreshToken";
import uploadImageClodinary from "../utils/uploadImageClodinary";
import UnauthorizedError from "../errors/UnauthorizedError";
import generatedOtp from "../utils/generatedOtp";
const bcryptjs = require("bcryptjs");
const jwt  = require("jsonwebtoken");
const registerUserController = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        throw new BadRequestError("Invalid Credentials");
    }
    const user = await UserModel.findOne({email});
    if (user) {
        throw new BadRequestError("Email already exists");
    }
    const newUser = new UserModel({name, email, password});
    const save = newUser.save();

    const VerifyEmailURL = `${process.env['FRONTEND_URL']}/verify-email/code=${save._id}`;

    // Send email verification link
    const verifyEmail = await sendEmail({
        sendTo: email,
        subject: "Verify email from binkeyit",
        html: verifyEmailTemplate({name: name, url: VerifyEmailURL})
    })
    if (!verifyEmail) {
        throw new Error("Failed to send verification email");
    }
    return res.status(StatusCodes.CREATED).json({
        message: "User registered successfully. Please verify your email",
        success:true,
        error:false,
        data:save
    });
}
const verifyEmailController = async (req, res) => {
    const {code} = req.body;
    if (!code) {
        throw new BadRequestError("Invalid verification code");
    }
    const user = await UserModel.findById(code);
    if (!user) {
        throw new BadRequestError("Verification code is invalid or expired");
    }
    const updatedUser = await UserModel.updateOne({_id:code}, {verifyEmail:true});
    return res.status(StatusCodes.OK).json({
        message: "Email verified successfully",
        success: true,
        error: false,
    });
}
const loginController = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new BadRequestError("Invalid Credentials");
    }
    const user = await UserModel.findOne({email: email});
    if (!user) {
        throw new BadRequestError("Invalid email or password");
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        throw new BadRequestError("Invalid email or password");
    }
    if (!user.verifyEmail) {
        throw new BadRequestError("Please verify your email");
    }
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id)

    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
        lastLoginData: Date.now()
    });

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }
    res.cookie("access-token", accessToken, cookieOptions);
    res.cookie("refresh-token", refreshToken, cookieOptions);

    res.status(StatusCodes.OK).json({
        message: "Logged in successfully",
        success: true,
        error: false,
        data: {
            userId: user._id,
            name: user.name,
            accessToken,
            refreshToken
        }
    });
}
const logoutController = async (req, res) => {
    const userId = req.userId; // middleware
    const cookiesOption = {
        httpOnly : true,
        secure : true,
        sameSite : "None"
    }
    res.clearCookie("access-token", cookiesOption);
    res.clearCookie("refresh-token", cookiesOption);

    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
        refreshToken: ""
    });

    res.status(StatusCodes.OK).json({
        message: "Logged out successfully",
        success: true,
        error: false,
    });
}
const uploadAvatar = async (req, res) => {
    const userId = req.userId; // auth middleware
    const image = req.file; // multer middleware

    const upload = await uploadImageClodinary(image)
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
        avatar: upload.url
    });
    return res.status(StatusCodes.OK).json({
        message : "upload profile successfully",
        success : true,
        error : false,
        data : {
            _id : userId,
            avatar : upload.url
        }
    });
}
const updateUserDetails = async (req, res) => {
    const userId = req.userId; // auth middleware
    const {name, email, password, mobile} = req.body;


    const updateUser = await UserModel.updateOne({ _id : userId},{
        ...(name && { name : name }),
        ...(email && { email : email }),
        ...(mobile && { mobile : mobile }),
        ...(password && { password  })
    })

    return res.status(StatusCodes.OK).json({
        message : "Updated successfully",
        error : false,
        success : true,
        data : updateUser
    });
}
const forgetPasswordController = async (req, res) => {
    const {email} = req.body;

    if (!email) {
        throw new BadRequestError("Invalid email");
    }
    const user = await UserModel.findOne({email});
    if (!user) {
        throw new UnauthorizedError("User not found");
    }

    const otp = generatedOtp();
    const expireTime = new Date() + 1000 * 60 * 30;

    const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
        forgetPasswordOtp:otp,
        forgetPasswordExpiry: new Date(expireTime).toISOString()
    });
    await sendEmail({
        sendTo: email,
        subject: "Forget Password OTP",
        text: forgetPasswordTemplate({name:user.name, otp:otp})
    })
    res.status(StatusCodes.OK).json({
        message: "Check your Email",
        success: true,
        error: false,
    })
}
const verifyForgotPasswordOtp = async (req, res) => {
    const {email, otp} = req.body;
    if(!email || !otp)
        throw new BadRequestError("Invalid email or otp");

    const user = await UserModel.findOne({email});
    if(!user)
        throw new UnauthorizedError("User not found");

    const currentTime = new Date(Date.now()).toISOString();

    if(user.forgetPasswordExpiry < currentTime){
        throw new BadRequestError("OTP is expired");
    }
    if(user.forgetPasswordOtp !== otp){
        throw new BadRequestError("Invalid OTP");
    }
    await UserModel.findByIdAndUpdate(user._id,{
        forgetPasswordOtp: "",
        forgetPasswordExpiry: ""
    });
    res.status(StatusCodes.OK).json({
        message: "OTP verified successfully",
        success: true,
        error: false,
    })
}
const resetPassword = async (req, res) => {
    const {email, password, confirmPassword} = req.body;
    if(!email ||!password ||!confirmPassword)
        throw new BadRequestError("Invalid email or password");

    if(password!== confirmPassword)
        throw new BadRequestError("Password and confirm password should be same");

    const user = await UserModel.findOne({email});

    if(!user)
        throw new UnauthorizedError("User not found");

    await UserModel.findOneAndUpdate(user._id,{
        password:password
    });
    res.status(StatusCodes.OK).json({
        message: "Password reset successfully",
        success: true,
        error: false,
    })
}
const refreshToken = async  (req, res) => {
    const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]
    if (!refreshToken) {
        throw new UnauthorizedError("Invalid token");
    }
    const verifyToken = jwt.verify(refreshToken,process.env['SECRET_KEY_REFRESH_TOKEN'])
    if(!verifyToken) {
        throw new UnauthorizedError("Token is expired");
    }
    const userId = verifyToken._id;

    const newAccessToken = await generateAccessToken(userId);
    const cookiesOption = {
        httpOnly : true,
        secure : true,
        sameSite : "None"
    }

    res.cookie('accessToken',newAccessToken,cookiesOption)

    return res.status(StatusCodes.OK).json({
        message : "New Access token generated",
        error : false,
        success : true,
        data : {
            accessToken : newAccessToken
        }
    })
}
const userDetails = async (req, res) => {
    const userId = req.userId;

    const user = await UserModel.findById(userId).select("-password - refreshToken");

    if (!user) {
        throw new BadRequestError("User not found");
    }

    return res.status(StatusCodes.OK).json({
        message: "User details",
        success: true,
        error: false,
        data: user
    });
}
module.exports = {registerUserController,verifyEmailController,loginController, logoutController,uploadAvatar,
updateUserDetails, forgetPasswordController,verifyForgotPasswordOtp,resetPassword,refreshToken,userDetails};