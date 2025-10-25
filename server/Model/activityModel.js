import mongoose, { mongo } from "mongoose";

const activitySchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
})