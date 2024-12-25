const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    address_line : {
        type : String,
        default : ""
    },
    city : {
        type : String,
        default : ""
    },
    state : {
        type : String,
        default : ""
    },
    pincode : {
        type : String,
        default : ""
    },
    country : {
        type : String
    },
    mobile : {
        type : String,
        default : null,
        validate:{
            validator: function(v) {
                return /^[0-9]{11}$/.test(v);
            },
            message : "Invalid Mobile Number"
        }
    },
    status : {
        type : Boolean,
        default : true
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        default : "",
        required : true
    }
}, {
    timestamps: true
})
// Add an index to optimize queries by userId
AddressSchema.index({ userId: 1 });

const AddressModel = mongoose.model('Address', AddressSchema);

export  default AddressModel;