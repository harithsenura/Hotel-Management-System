import express from 'express';
import Orders  from '../models/InventoryOrderSchema.js'; // Assuming you have an Orders model

const router = express.Router();

// Middleware for validating order data
const validateOrder = (req, res, next) => {
    console.log('Validating Order data:', req.body); // Debugging: log incoming data
    const { orderName, supplier, date, noOfItems } = req.body;

    if (!orderName || !supplier || !date || !noOfItems) {
        return res.status(400).json({
            message: 'All fields are required: orderName, supplier, date, noOfitems'
        });
    }
    next();
};

// POST Route to save new order (with /send endpoint)
router.post('/send', validateOrder, async (req, res, next) => {
    try {
        console.log('Received data:', req.body); // Debugging: log incoming data
        
        // Add the status attribute with a default value of "pending"
        const orderData = {
            ...req.body, // Spread the incoming order data
            status: "pending..." // Set default status as "pending"
        };

        const newOrder = await Orders.create(orderData); // Create the order with the new data
        return res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
});


// GET Route to retrieve all orders
router.get('/', async (req, res, next) => {
    try {
        const orders = await Orders.find({});
        return res.status(200).json({
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
});

// GET Route to retrieve order by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Orders.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        next(error);
    }
});

// PUT Route to update order by ID
router.put('/update/:id', validateOrder, async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Orders.findByIdAndUpdate(id, req.body, { new: true });
        console.log("updatedOrder",updatedOrder);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order updated successfully', updatedOrder });
        
    } catch (error) {
        next(error);
    }
});

// DELETE Route to remove order by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Orders.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
