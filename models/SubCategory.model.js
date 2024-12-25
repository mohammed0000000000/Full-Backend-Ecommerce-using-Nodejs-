const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Category"
        }
    ]
},{timestamps:true})

// Add index on the name field for search optimization
SubCategorySchema.index({ name: 1 });

const SubCategoryModel = mongoose.model('SubCategory', SubCategorySchema);

export default SubCategoryModel;