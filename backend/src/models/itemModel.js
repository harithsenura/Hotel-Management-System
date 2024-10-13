import mongoose from 'mongoose';

const { Schema } = mongoose;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    Sprice: {
        type: String,
        required: true,
    },
    Bprice: {
        type: String,
    },
    price: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, 
{ timestamps: true });

const Item = mongoose.model("Item", itemSchema);

export default Item;
