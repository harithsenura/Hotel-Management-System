import express from 'express';
import Item from '../models/itemModel.js'; // Import Item model

const router = express.Router();

// Add Item Route
router.post('/add-item', async (req, res) => {
  try {
    const newItem = new Item(req.body); // Create a new item with the request data
    await newItem.save(); // Save the new item to the database
    res.status(200).send("Item added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to add item");
  }
});

// Get All Items Route
router.get('/get-item', async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to get items");
  }
});

// Edit Item Route
router.put('/edit-item', async (req, res) => {
  const { itemId, name, Bprice, Sprice, image, category } = req.body;
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { name, Bprice, Sprice, image, category },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send("Item not found");
    }
    res.status(200).send("Item updated successfully");
  } catch (error) {
    res.status(500).send("Failed to update item");
  }
});

// Delete Item Route
router.delete('/delete-item/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await Item.findByIdAndDelete(itemId);

    if (!item) {
      return res.status(404).send("Item not found");
    }

    res.status(200).send({ message: "Item deleted successfully", item });
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to delete item");
  }
});

export default router;
