const router = require('express').Router();
let Customer = require('../models/customer');

// Add a new customer
router.route("/add").post(async (req, res) => {
    const { name, contactNumber, email, gender, nationality, address, 
            nicPassport, checkInDate, roomType, roomNumber, price } = req.body;

    const newCustomer = new Customer({
        name, contactNumber, email, gender, nationality, address,
        nicPassport, checkInDate, roomType, roomNumber, price
    });

    try {
        await newCustomer.save();
        res.json("Customer Added");
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

// Get all customers
router.route("/").get(async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

// Update a customer
router.route("/update/:id").put(async (req, res) => {
    const userId = req.params.id;
    const { name, contactNumber, email, gender, nationality, address, 
            nicPassport, checkInDate, roomType, roomNumber, price } = req.body;

    const updateCustomer = {
        name, contactNumber, email, gender, nationality, address,
        nicPassport, checkInDate, roomType, roomNumber, price
    };

    try {
        await Customer.findByIdAndUpdate(userId, updateCustomer);
        res.status(200).send({ status: "Customer Updated" });
    } catch (err) {
        res.status(400).send({ status: "Error updating customer", error: err.message });
    }
});

// Delete a customer
router.route("/delete/:id").delete(async (req, res) => {
    const userId = req.params.id;

    try {
        await Customer.findByIdAndDelete(userId);
        res.status(200).send({ status: "Customer deleted" });
    } catch (err) {
        res.status(500).send({ status: "Error deleting customer", error: err.message });
    }
});

// Get a specific customer
router.route("/get/:id").get(async (req, res) => {
    const userId = req.params.id;

    try {
        const customer = await Customer.findById(userId);
        res.status(200).send({ status: "Customer fetched", customer });
    } catch (err) {
        res.status(500).send({ status: "Error fetching customer", error: err.message });
    }
});

module.exports = router;
