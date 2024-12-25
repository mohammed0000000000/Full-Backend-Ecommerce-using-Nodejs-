
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Category description is required']
    },
}, {timestamps:true});

const CategoryModel = mongoose.model('Category', CategorySchema);

export default CategoryModel;