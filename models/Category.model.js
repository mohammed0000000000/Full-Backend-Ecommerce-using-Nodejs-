
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true
    },
    image: {
        type: String,
        required: ""
    },
}, {timestamps:true});

const CategoryModel = mongoose.model('Category', CategorySchema);

export default CategoryModel;