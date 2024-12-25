import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, "Product name is required"]
    },
    image : {
        type : [String],
        default : []
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'Category',
            required : [true, "Category is required"]
        }
    ],
    subCategory : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'SubCategory'
        }
    ],
    unit : {
        type : String,
        default : ""
    },
    stock : {
        type : Number,
        default : 0,
        min: [0, "Stock cannot be negative"]
    },
    price : {
        type : Number,
        default : 0,
        min: [0, "Price cannot be negative"]
    },
    discount : {
        type : Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"]
    },
    description : {
        type : String,
        default : ""
    },
    more_details : {
        type : Object,
        default : {}
    },
    publish : {
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})

// Create a text index for full-text search
productSchema.index({
    name  : "text",
    description : 'text'
},  { weights: { name: 10, description: 5 } });


const ProductModel = mongoose.model('Product',productSchema)

export default ProductModel