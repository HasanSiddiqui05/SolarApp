import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String
    },
    stock: {
        type: Number,
        default: 0
    },
    attributes: [{
        type: String,
        required: true
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

categorySchema.index({ name: 1, isDeleted: 1 }, { unique: true });
const Category = mongoose.model('Category', categorySchema)
export default Category