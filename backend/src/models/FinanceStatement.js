import mongoose from "mongoose";

const { Schema } = mongoose;

const incomeSchema = new Schema({
  sales: {
    type: Number,
    required: true,
  },
  costofsales: {
    type: Number,
    required: true,
  },
  grossprofit: {
    type: Number, // Will be calculated
  },
  otherincomes: {
    type: Number,
    required: true,
  },
  deliverycost: {
    type: Number,
    required: true,
  },
  administrativecost: {
    type: Number,
    required: true,
  },
  otherexpences: {
    type: Number,
    required: true,
  },
  financeexpences: {
    type: Number,
    required: true,
  },
  netprofit: {
    type: Number, // Will be calculated
  },
});

const Income = mongoose.model("fincome", incomeSchema);

// Export the Income model using ES modules
export default Income;
