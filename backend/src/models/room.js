import mongoose from 'mongoose';

const { Schema } = mongoose;

const roomSchema = new Schema({
  roomType: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  roomNumber: {
    type: Number,
    required: true
  },
  facilities: {
    type: String,
    required: true
  },
  bedType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
