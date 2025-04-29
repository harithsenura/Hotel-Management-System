import billsModel from '../models/billsModel.js';

// Add bill
const addBillsController = async (req, res) => {
    try {
        const newBill = new billsModel(req.body);
        await newBill.save();
        res.status(201).send("Bill Created Successfully!");
    } catch (error) {
        console.error("Error adding bill:", error);
        res.status(500).send("Error adding bill");
    }
};

// Get bills
const getBillsController = async (req, res) => {
    try {
        const bills = await billsModel.find();
        res.status(200).json(bills);
    } catch (error) {
        console.error("Error fetching bills:", error);
        res.status(500).send("Failed to get bills");
    }
};

// Delete bill
const deleteBillController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Delete request received for bill ID:", id);

        // Check if the ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send("Invalid Bill ID format");
        }

        const deletedBill = await billsModel.findByIdAndDelete(id);

        if (!deletedBill) {
            return res.status(404).send("Bill not found");
        }

        res.status(200).send("Bill deleted successfully");
    } catch (error) {
        console.error("Error deleting bill:", error);
        res.status(500).send("Error deleting bill");
    }
};

export {
    addBillsController,
    getBillsController,
    deleteBillController,
};
