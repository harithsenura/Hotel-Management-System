import express from 'express';
import PettyCash from '../models/FinancePettyCash.js';

const router = express.Router();

// Get all petty cash entries
router.get('/', async (req, res) => {
  try {
    const entries = await PettyCash.find().sort({ date: 1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching petty cash entries', error });
  }
});

// Add a new petty cash entry
router.post('/add', async (req, res) => {
  const { reimbursement, date, description, no, payments } = req.body;

  // Check if the remaining amount is sufficient for the payment
  const remainingAmount = reimbursement - payments;
  if (remainingAmount < 0) {
    return res.status(400).json({ message: 'Cannot add! Petty cash hit the limit' });
  }

  const newEntry = new PettyCash({
    reimbursement: remainingAmount,
    date,
    description,
    no,
    payments,
  });

  try {
    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    res.status(400).json({ message: 'Error adding petty cash entry', error });
  }
});

// Update an existing petty cash entry
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { description, date, payments } = req.body;

  try {
    // Find the entry to update
    const entryToUpdate = await PettyCash.findById(id);
    if (!entryToUpdate) {
      return res.status(404).json({ message: 'Petty cash entry not found' });
    }

    // Update the entry fields
    entryToUpdate.description = description || entryToUpdate.description;
    entryToUpdate.date = date || entryToUpdate.date;
    entryToUpdate.payments = payments !== undefined ? payments : entryToUpdate.payments;
    await entryToUpdate.save();

    // Recalculate reimbursements for all entries
    const allEntries = await PettyCash.find().sort({ date: 1 });
    let remainingAmount = 100000; // Starting amount from management

    for (const entry of allEntries) {
      entry.reimbursement = remainingAmount;
      remainingAmount -= entry.payments; // Deduct payments
      await entry.save(); // Save updated reimbursement value
    }

    res.json({ message: 'Petty cash entry updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error updating petty cash entry', error });
  }
});

// Delete a petty cash entry
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await PettyCash.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Petty cash entry not found' });
    }

    // Fetch all entries, sort by date, and reassign 'no' values sequentially
    const allEntries = await PettyCash.find().sort({ date: 1 });
    allEntries.forEach(async (entry, index) => {
      entry.no = index + 1;
      await entry.save();
    });

    res.json({ message: 'Petty cash entry deleted and reordered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting petty cash entry', error });
  }
});

export default router;
