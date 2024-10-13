// Import necessary modules using ES6 syntax
import { Router } from 'express';
import Room from '../models/room.js'; // Ensure the correct path and file extension

const router = Router();

// Add a new room
router.post("/add", async (req, res) => {
  const {
    roomType,
    price,
    roomNumber,
    facilities,
    bedType,
    status
  } = req.body;

  // Validate required fields
  if (!roomType || !price || !roomNumber || !bedType || !status) {
    return res.status(400).json({ error: "Error: Missing required fields" });
  }

  const newRoom = new Room({
    roomType,
    price,
    roomNumber,
    facilities,
    bedType,
    status
  });

  try {
    await newRoom.save();
    res.json({ message: "Room Added" });
  } catch (err) {
    res.status(400).json({ error: "Error: " + err.message });
  }
});

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a room
router.put("/update/:id", async (req, res) => {
  const roomId = req.params.id;
  const {
    roomType,
    price,
    roomNumber,
    facilities,
    bedType,
    status
  } = req.body;

  // Validate required fields
  if (!roomType || !price || !roomNumber || !bedType || !status) {
    return res.status(400).json({ error: "Error: Missing required fields" });
  }

  const updateRoom = {
    roomType,
    price,
    roomNumber,
    facilities,
    bedType,
    status
  };

  try {
    const updatedRoom = await Room.findByIdAndUpdate(roomId, updateRoom, { new: true });
    if (!updatedRoom) {
      return res.status(404).json({ status: "Room not found" });
    }
    res.status(200).send({ status: "Room Updated", room: updatedRoom });
  } catch (error) {
    res.status(400).send({ status: "Error updating room", error: error.message });
  }
});

// Delete a room
router.delete("/delete/:id", async (req, res) => {
  const roomId = req.params.id;

  try {
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    if (!deletedRoom) {
      return res.status(404).send({ status: "Room not found" });
    }
    res.status(200).send({ status: "Room Deleted" });
  } catch (error) {
    res.status(500).send({ status: "Error deleting room", error: error.message });
  }
});

// Get a room by ID
router.get("/get/:id", async (req, res) => {
  const roomId = req.params.id;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).send({ status: "Room not found" });
    }
    res.status(200).send({ status: "Room fetched", room });
  } catch (error) {
    res.status(500).send({ status: "Error fetching room", error: error.message });
  }
});

// Export the router using ES6 export
export default router;
