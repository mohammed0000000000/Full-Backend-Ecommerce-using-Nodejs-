
const {Router} = require('express');
const {registerUserController,verifyEmailController,loginController,logoutController,uploadAvatar
,updateUserDetails,verifyForgotPasswordOtp,userDetails,refreshToken,resetPassword,forgetPasswordController} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const {single} = require("../middlewares/multer");

const userRouter = Router();

userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,single('avatar'),uploadAvatar)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgetPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetPassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)
module.exports = userRouter;