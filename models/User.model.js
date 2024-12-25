
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "You must Provide name"],
        minlength:[3, "the name must be at least 3 characters"],
        maxlength:[50, "the name must be at most 50 characters"]
    },
    email:{
        type:String,
        required:[true, "You must Provide email"],
        unique:true,
        validate: {
            validator: function(v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: "Please enter a valid email address"
        }
    },
    password:{
        type:String,
        required:[true, "You must Provide password"],
        minlength:[8, "the password must be at least 8 characters"],
        select: false, // to prevent returned in query by default
        validate:{
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: "The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        }
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile:{
        type: String,
        default: "",
        validate:{
            validator: function(v) {
                return /^[0-9]{11}$/.test(v);
            },
            message: "Please enter a valid 10-digit mobile number"
        }
    },
    refreshToken:{
        type: String,
        default: ""
    },
    verifyEmail:{
        type: Boolean,
        default: false
    },
    lastLoginData:{
        type: Date,
        default: null,
    },
    status:{
        type: String,
        enum:["Active", "Inactive", "Suspended"],
        default: "active"
    },
    addressDetails:[
        {
            type:mongoose.Schema.ObjectId,
            ref: "address"
        }
    ],
    shoppingCart:[
        {
            type: mongoose.Schema.ObjectId,
            ref: "cartProduct"
        }
    ],
    orderHistory:[
        {
            type: mongoose.Schema.ObjectId,
            ref: "order"
        }
    ],
    forgetPasswordOtp:{
        type: String,
        default: null
    },
    forgetPasswordExpiry:{
        type: Date,
        default: null
    },
    role:{
        type: String,
        enum:["ADMIN", "USER"],
        default: "USER"
    }
},
    {timestamps:true});

UserSchema.pre('save', async function(next){
    try {
        if(this.isModified('password') || this.isNew){
            const salt = await  bcrypt.getSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    }
    catch (error) {
        console.log("error while hashing password");
        next(error);
    }
})
UserSchema.index({email:1},{unique:true});

const UserModel =  mongoose.model("User", UserSchema);

export  default UserModel;