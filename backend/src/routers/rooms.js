const router = require('express').Router();
const Room = require('../models/room');

// Add a new room
router.post("/add", (req, res) => {
  const {
    roomType,
    price,
    roomNumber,
    facilities,
    bedType,
    status
  } = req.body;

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

  newRoom.save()
    .then(() => res.json({ message: "Room Added" }))
    .catch((err) => res.status(400).json({ error: "Error: " + err }));
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
    await Room.findByIdAndUpdate(roomId, updateRoom, { new: true });
    res.status(200).send({ status: "Room Updated" });
  } catch (error) {
    res.status(400).send({ status: "Error updating room", error: error.message });
  }
});

// Delete a room
router.delete("/delete/:id", async (req, res) => {
  const roomId = req.params.id;

  try {
    await Room.findByIdAndDelete(roomId);
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
    res.status(200).send({ status: "Room fetched", room });
  } catch (error) {
    res.status(500).send({ status: "Error fetching room", error: error.message });
  }
});

module.exports = router;