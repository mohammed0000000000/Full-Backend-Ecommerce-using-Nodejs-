const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId:{
      type:String,
        required : [true, "Provide orderId"],
        unique : true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productDetails : {
        name : String,
        image : Array,
    },
    paymentId:{
        type: String,
        default:""
    },
    paymentStatus:{
        type: String,
        enum:['Pending','Completed','Failed'],
        default:"Pending"
    },
    deliveryAddress:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    subTotalAmt:{
        type: Number,
        default:0,
        min: [0, "Subtotal amount cannot be negative"]
    },
    totalAmt:{
        type: Number,
        default:0,
        min: [0, "Subtotal amount cannot be negative"],
        validate:{
            validator:function (v) {
                return v >= this.subTotalAmt;
            },
            message: "Total amount should be greater or equal to subtotal amount"
        }
    },
    invoiceReceipt : { //فاتورة الاستلام
        type : String,
        default : "",
    }
},{timestamps:true});

//// Add indexes for faster queries
OrderSchema.index({userId:1});
OrderSchema.index({orderId:1});

// // Pre-save hook to calculate total amount
// OrderSchema.pre('save', function (next) {
//     if (!this.totalAmt) {
//         this.totalAmt = this.subTotalAmt; // Modify as needed to include taxes/discounts
//     }
//     next();
// });

const OrderModel = mongoose.model('Order', OrderSchema);
export default OrderModel;