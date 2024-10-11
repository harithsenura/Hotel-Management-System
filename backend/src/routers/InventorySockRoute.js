import express from 'express';
import {Stocks}  from '../models/InventoryStockSchema.js';

const router = express.Router();

// Middleware for validating stock data
const validateStock = (req, res, next) => {
    console.log('Validating Stock data:', req.body); // Debugging: log incoming data
    const { itemName, category, inStock, date, statusOfItem } = req.body;

    if (!itemName || !category || !inStock || !date || !statusOfItem) {
        return res.status(400).json({
            message: 'All fields are required: itemName, category, inStock, date, status',
        });
    }
    next();
};

// POST Route to save new stock (with /add endpoint)
router.post('/send', validateStock, async (req, res, next) => {
    try {
        console.log('Received data:', req.body); // Debugging: log incoming data
        const newStock = await Stocks.create(req.body);
        return res.status(201).json(newStock);
    } catch (error) {
        next(error);
    }
});

// GET Route to retrieve all stocks
router.get('/', async (req, res, next) => {
    try {
        const stocks = await Stocks.find({});
        return res.status(200).json({
            count: stocks.length,
            data: stocks
        });
    } catch (error) {
        next(error);
    }
});

// GET Route to retrieve stock by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const stock = await Stocks.findById(id);

        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        return res.status(200).json(stock);
    } catch (error) {
        next(error);
    }
});

// PUT Route to update stock by ID
router.put('/update/:id', validateStock, async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedStock = await Stocks.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedStock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        return res.status(200).json({ message: 'Stock updated successfully', updatedStock });
        
    } catch (error) {
        next(error);
    }
});

// DELETE Route to remove stock by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedStock = await Stocks.findByIdAndDelete(id);

        if (!deletedStock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        return res.status(200).json({ message: 'Stock deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
