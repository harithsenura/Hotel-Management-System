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

router.get('/available', async (req, res) => {
  const { roomType } = req.query;

  if (!roomType) {
    return res.status(400).json({ message: "roomType is required" });
  }

  try {
    // Fetch rooms of the specified type with status "Available"
    const availableRooms = await Room.find({ roomType, status: "Available" }).select('roomNumber');
    res.json(availableRooms.map(room => room.roomNumber));
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    res.status(500).json({ message: "Server error" });
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
router.patch("/updateStatus/:roomNumber", async (req, res) => {
  const roomNumber = req.params.roomNumber;
  const { status } = req.body;

  // Ensure that the new status is provided
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    // Find the room by its roomNumber and update the status
    const updatedRoom = await Room.findOneAndUpdate(
      { roomNumber }, // Find room by roomNumber
      { status }, // Update status
      { new: true } // Return the updated document
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({ message: "Room status updated", room: updatedRoom });
  } catch (error) {
    console.error("Error updating room status:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Export the router using ES6 export
export default router;
