import mongoose from "mongoose";
import validator from "validator";

const stockSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, "Item Name is required"],
        minLength: [3, "Item Name must contain at least 3 characters!"],
        maxLength: [30, "Item Name cannot exceed 30 characters!"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        minLength: [3, "Category must contain at least 3 characters!"],
        maxLength: [30, "Category cannot exceed 30 characters!"],
    },
    inStock: {
        type: Number,
        required: [true, "In Stock is required"],
        min: [1, "In Stock must be at least 1!"],
        max: [10000, "In Stock cannot exceed 10,000!"],
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        validate: [validator.isDate, "Please enter a valid date"],
    },
    statusOfItem: {
        type: String,
        required: [true, "Status is required"],
        enum: ['in-stock', 'out-of-stock', 'ordered', 'pending'],
    }
});

export const Stocks = mongoose.model("Stocks", stockSchema);
