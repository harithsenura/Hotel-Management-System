import { Router } from 'express';
import Supply from '../models/supply.js'; // Corrected the import

const router = Router();

// Create supply
router.post("/addSupply", async (req, res) => {
    try {
        console.log('Request received:', req.body); // Log the request body

        const { supplyId, itemName, unitPrice, description, initialQuantity, category } = req.body;

        // Add basic validation
        if (!supplyId || !itemName || !unitPrice || !initialQuantity || !category) {
            return res.status(400).json({ message: "Error: All fields except description are required." });
        }

        // Validate numeric fields
        const initialQuantityNum = Number(initialQuantity);
        const unitPriceNum = Number(unitPrice);
        
        if (isNaN(initialQuantityNum) || isNaN(unitPriceNum) || initialQuantityNum <= 0 || unitPriceNum <= 0) {
            return res.status(400).json({ message: "Error: Quantity and price must be positive numbers." });
        }

        const newSupply = new Supply({
            supplyId,
            itemName,
            unitPrice: unitPriceNum,
            description,
            initialQuantity: initialQuantityNum,
            category
        });

        const savedSupply = await newSupply.save();
        res.status(201).json({ message: "Supply added!", supply: savedSupply });
    } catch (err) {
        console.error("Error while saving supply:", err); // Log the error
        res.status(500).json({ message: "Error: " + err.message });
    }
});

// Read all supplies
router.get("/", async (req, res) => {
    try {
        const supplies = await Supply.find();
        res.status(200).json(supplies);
    } catch (err) {
        res.status(500).json({ message: "Error: " + err.message });
    }
});

// Update supply by ID
router.put("/update/:id", async (req, res) => {
    const supplyId = req.params.id;
    const { supplyId: newSupplyId, itemName, unitPrice, description, initialQuantity, category } = req.body;

    const updatedSupply = {
        supplyId: newSupplyId,
        itemName,
        unitPrice,
        description,
        initialQuantity,
        category
    };

    try {
        const updated = await Supply.findByIdAndUpdate(supplyId, updatedSupply, { new: true });
        if (!updated) {
            return res.status(404).send({ message: "Error: Supply not found." });
        }
        res.status(200).send({ message: "Supply Updated", supply: updated });
    } catch (err) {
        res.status(500).send({ message: "Error with updating data", error: err.message });
    }
});

// Delete supply by ID
router.delete("/delete/:id", async (req, res) => {
    const supplyId = req.params.id;
    try {
        const deletedSupply = await Supply.findByIdAndDelete(supplyId);
        if (!deletedSupply) {
            return res.status(404).send({ message: "Error: Supply not found." });
        }
        res.status(200).send({ message: "Supply Deleted" });
    } catch (err) {
        res.status(500).send({ message: "Error with deleting supply", error: err.message });
    }
});

// Fetch all supplies
router.get('/api/supplies', async (req, res) => {
    try {
        const supplies = await Supply.find();
        console.log(supplies); // Log the supplies to check if _id is present
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
