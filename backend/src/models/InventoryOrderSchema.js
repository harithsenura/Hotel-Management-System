import mongoose from "mongoose";
import validator from "validator";

const orderSchema = new mongoose.Schema({
    orderName: {
        type: String,
        required: [true, "Order Name is required"],
        minLength: [3, "Order Name must contain at least 3 characters!"],
        maxLength: [30, "Order Name cannot exceed 30 characters!"],
    },
    supplier: {
        type: String,
        required: [true, "Supplier is required"],
        minLength: [3, "Supplier must contain at least 3 characters!"],
        maxLength: [30, "Supplier cannot exceed 30 characters!"],
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        validate: [validator.isDate, "Please enter a valid date"],
    },
    noOfItems: {
        type: Number,
        required: [true, "Number of items is required"],
        min: [1, "Items must contain at least 1"],
        max: [10000, "Items cannot exceed 10,000"],
    },
});

const Orders = mongoose.model("InOrders", orderSchema);
export default Orders;
