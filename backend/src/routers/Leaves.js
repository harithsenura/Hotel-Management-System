const router = require('express').Router();
let Leave = require('../models/Leave');

// Route to add a new leave request
router.route("/add").post((req, res) => {
    const empid = req.body.empid;
    const email = req.body.email;
    const startdate = Date.parse(req.body.startdate);
    const enddate = Date.parse(req.body.enddate);
    const reason = req.body.reason;

    const newLeave = new Leave({
        empid,
        email,
        startdate,
        enddate,
        reason
    });

    newLeave.save()
        .then(() => {
            res.json("Leave Added");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error adding leave", error: err.message });
        });
});

// Route to get all leave requests
router.route("/").get((req, res) => {
    Leave.find()
        .then((leaves) => {
            res.json(leaves);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error fetching leaves", error: err.message });
        });
});

// Route to update a leave request (excluding approval)
router.route("/update/:id").put(async (req, res) => {
    let leaveID = req.params.id;
    const { empid, email, startdate, enddate, reason } = req.body;

    const updateLeave = {
        empid,
        email,
        startdate,
        enddate,
        reason
    };

    try {
        await Leave.findByIdAndUpdate(leaveID, updateLeave, { new: true });
        res.status(200).send({ status: "Leave Updated" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error updating data", error: err.message });
    }
});

// Route to delete a leave request
router.route("/delete/:id").delete(async (req, res) => {
    let leaveID = req.params.id;

    try {
        await Leave.findByIdAndDelete(leaveID);
        res.status(200).send({ status: "Leave Deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error deleting leave", error: err.message });
    }
});

// Route to get a specific leave request by ID
router.route("/get/:id").get(async (req, res) => {
    let leaveID = req.params.id;

    try {
        const leave = await Leave.findById(leaveID);
        res.status(200).send({ status: "Leave fetched", leave });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error fetching leave", error: err.message });
    }
});

// Route to update the approval status of a leave request
router.route("/update-approval/:id").put(async (req, res) => {
    let leaveID = req.params.id;
    const { approval } = req.body;

    if (!['Pending', 'Yes', 'No'].includes(approval)) {
        return res.status(400).send({ status: "Invalid approval status. Valid statuses are Pending, Yes, No." });
    }

    try {
        await Leave.findByIdAndUpdate(leaveID, { approval }, { new: true });
        res.status(200).send({ status: "Approval status updated" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error updating approval status", error: err.message });
    }
});

module.exports = router;
