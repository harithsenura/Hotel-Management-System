import express from 'express';
import Orders from '../models/InventoryOrderSchema.js'; // Ensure correct path and model name

const router = express.Router();

// Middleware for validating order data (used for creating and updating order details)
const validateOrder = (req, res, next) => {
    console.log('Validating Order data:', req.body); // Debugging: log incoming data
    const { orderName, supplier, date, noOfItems } = req.body;

    if (!orderName || !supplier || !date || !noOfItems) {
        return res.status(400).json({
            message: 'All fields are required: orderName, supplier, date, noOfItems'
        });
    }
    next();
};

// POST Route to save new order (with /send endpoint)
router.post('/send', validateOrder, async (req, res, next) => {
    try {
        console.log('Received data:', req.body); // Debugging: log incoming data
        
        // Add the status attribute with a default value of "Pending"
        const orderData = {
            ...req.body, // Spread the incoming order data
            status: "Pending" // Set default status as "Pending" without ellipsis
        };

        const newOrder = await Orders.create(orderData); // Create the order with the new data
        return res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error); // Enhanced error logging
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
        console.error('Error fetching orders:', error); // Enhanced error logging
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
        console.error('Error fetching order by ID:', error); // Enhanced error logging
        next(error);
    }
});

// PUT Route to update order details by ID
router.put('/update/:id', validateOrder, async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Orders.findByIdAndUpdate(id, req.body, { new: true });
        console.log("Updated Order:", updatedOrder);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order updated successfully', updatedOrder });
        
    } catch (error) {
        console.error('Error updating order details:', error); // Enhanced error logging
        next(error);
    }
});

// PUT Route to update only the order status by orderId
router.put('/updateStatus/:orderId', async (req, res) => { // Changed endpoint to /updateStatus/:orderId
    const { orderId } = req.params;
    const { status } = req.body;
  
    // Validate the new status
    const validStatuses = ["Pending", "In Process", "Order Received", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }
  
    try {
      const updatedOrder = await Orders.findByIdAndUpdate( // Corrected model name
        orderId,
        { status },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found." });
      }
  
      res.json({ message: "Order status updated successfully.", data: updatedOrder });
    } catch (error) {
      console.error("Error updating order status:", error); // Enhanced error logging
      res.status(500).json({ message: "Server error. Please try again later." });
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
        console.error('Error deleting order:', error); // Enhanced error logging
        next(error);
    }
});

export default router;
