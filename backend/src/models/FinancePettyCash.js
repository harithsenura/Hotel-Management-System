import mongoose from 'mongoose';

const { Schema } = mongoose;

const pettyCashSchema = new Schema({
  reimbursement: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  no: {
    type: Number,
    required: true,
    unique: true,
  },
  payments: {
    type: Number,
    required: true,
  },
});

const PettyCash = mongoose.model('PettyCash', pettyCashSchema);

export default PettyCash;
