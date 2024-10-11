import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/auth.mid.js';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { OrderModel } from '../models/order.model.js';
import { UserModel } from '../models/user.model.js';
import { OrderStatus } from '../constants/orderStatus.js';

const router = Router();
router.use(auth);

// Default Lat/Lng values if map is not available in UI
const DEFAULT_LATLNG = {
    lat: "40.7128",  // Default latitude (e.g., New York City)
    lng: "-74.0060"  // Default longitude (e.g., New York City)
};

// Create a new order
router.post(
    '/create',
    handler(async (req, res) => {
        const order = req.body;

        // Check if the cart is empty
        if (!order.items || order.items.length <= 0) {
            res.status(BAD_REQUEST).send('Cart Is Empty!');
            return;
        }

        // Delete any existing NEW order for the current user
        await OrderModel.deleteOne({
            user: req.user.id,
            status: OrderStatus.NEW,
        });

        // Use default Lat/Lng if not provided in the request body
        const addressLatLng = order.addressLatLng || DEFAULT_LATLNG;

        // Create the new order with either provided or default Lat/Lng
        const newOrder = new OrderModel({ 
            ...order, 
            user: req.user.id,
            addressLatLng  // Automatically set default lat/lng if not provided
        });

        await newOrder.save();
        res.send(newOrder);
    })
);

// Pay for an order and update its status
router.put(
    '/pay',
    handler(async (req, res) => {
        const { paymentId } = req.body;
        const order = await getNewOrderForCurrentUser(req);

        if (!order) {
            res.status(BAD_REQUEST).send('Order Not Found!');
            return;
        }

        order.paymentId = paymentId;
        order.status = OrderStatus.PAYED;
        await order.save();

        sendEmailReceipt(order); // Function to send a receipt to the user

        res.send(order._id);
    })
);

// Get the new order for the current user
router.get(
    '/newOrderForCurrentUser',
    handler(async (req, res) => {
        const order = await getNewOrderForCurrentUser(req);
        if (order) {
            res.send(order);
        } else {
            res.status(BAD_REQUEST).send('No New Order Found!');
        }
    })
);

// Get orders based on status or for current user
router.get(
    '/:status?',
    handler(async (req, res) => {
        const status = req.params.status;
        const user = await UserModel.findById(req.user.id);
        const filter = {};

        if (!user.isAdmin) filter.user = user._id; // Non-admins can only see their own orders
        if (status) filter.status = status;  // Optionally filter by order status

        const orders = await OrderModel.find(filter).sort('-createdAt');  // Sort orders by creation date
        res.send(orders);
    })
);

// Helper function to get the current user's new order
const getNewOrderForCurrentUser = async req => {
    return await OrderModel.findOne({
        user: req.user.id,
        status: OrderStatus.NEW,
    }).populate('user');
};

export default router;
