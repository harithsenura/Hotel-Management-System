import express from 'express';

import { EventPlanner } from '../models/eventPlannerModel.js';

const router = express.Router();

// Middleware for validating event data
const validateEventPlanner = (req, res, next) => {
    console.log('Validating EventPlanner data:', req.body); // Debugging: log incoming data
    const { Name, AssignedEvent, SalaryForTheEvent, Email, ContactNumber } = req.body;

    if (!Name || !AssignedEvent || !SalaryForTheEvent || !Email || !ContactNumber) {
        return res.status(400).json({
            message: 'All fields are required:Name, AssignedEvent, SalaryForTheEvent, Email, ContactNumber'
        });
    }
    next();
};

// POST Route to save a new Event (with `/add` endpoint)
router.post('/add', validateEventPlanner, async (req, res, next) => {
    try {
        console.log('Received data:', req.body); // Debugging: log incoming data
        const newEventPlanner = await EventPlanner.create(req.body);
        return res.status(201).json(newEventPlanner);
    } catch (error) {
        next(error);
    }
});

// GET Route to retrieve all events
router.get('/', async (req, res, next) => {
    try {
        const eventPlanners = await EventPlanner.find({});
        return res.status(200).json({
            count: eventPlanners.length,
            data: eventPlanners
        });
    } catch (error) {
        next(error);
    }
});

// GET Route to retrieve an event by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const eventPlanner = await EventPlanner.findById(id);

        if (!eventPlanner) {
            return res.status(404).json({ message: 'Event planner is not found' });
        }

        return res.status(200).json(eventPlanner);
    } catch (error) {
        next(error);
    }
});

// PUT Route to update an event by ID
router.put('/:id', validateEventPlanner, async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedEventPlanner = await EventPlanner.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedEventPlanner) {
            return res.status(404).json({ message: 'Event planner is not found' });
        }

        return res.status(200).json({ message: 'Event planner updated successfully', updatedEventPlanner });
    } catch (error) {
        next(error);
    }
});

// DELETE Route to remove an event by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedEventPlanner = await EventPlanner.findByIdAndDelete(id);

        if (!deletedEventPlanner) {
            return res.status(404).json({ message: 'Event planner is not found' });
        }

        return res.status(200).json({ message: 'Event planner deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
