import mongoose from 'mongoose';

// Define the supply schema
const supplySchema = new mongoose.Schema({
    supplyId: { type: String, required: true },
    itemName: { type: String, required: true },
    initialQuantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true },
    status: { type: String, default: 'Available' }
});

// Create the Supply model
const Supply = mongoose.model('Supply', supplySchema);

export default Supply;
