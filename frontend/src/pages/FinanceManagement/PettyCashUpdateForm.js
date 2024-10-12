// PettyCashUpdateForm.js

import React, { useState } from 'react';
import './PettyCashUpdateForm.css'; // Create and style as needed

const PettyCashUpdateForm = ({ entry, onUpdate, onClose, currentMonth, currentYear, balance }) => {
  const [updatedData, setUpdatedData] = useState({
    date: entry.date.substring(0, 10),
    description: entry.description,
    payments: entry.payments,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate date is within the selected month and year
    const entryDate = new Date(updatedData.date);
    const entryMonth = entryDate.getMonth() + 1;
    const entryYear = entryDate.getFullYear();

    if (entryMonth !== currentMonth || entryYear !== currentYear) {
      alert('Please enter a date within the selected month and year.');
      return;
    }

    // Calculate the new balance if payments are changed
    const originalPayments = Number(entry.payments);
    const newPayments = Number(updatedData.payments);
    const paymentDifference = newPayments - originalPayments;

    if (paymentDifference > balance) {
      alert('Updated payment exceeds the current balance.');
      return;
    }

    onUpdate(entry._id, updatedData);
  };

  return (
    <div className="update-form-overlay">
      <div className="update-form-container">
        <h3>Update Petty Cash Entry</h3>
        <form onSubmit={handleSubmit} className="update-form">
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={updatedData.date}
              onChange={handleChange}
              required
              max={`${currentYear}-${
                currentMonth < 10 ? '0' + currentMonth : currentMonth
              }-31`}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={updatedData.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Payments:
            <input
              type="number"
              name="payments"
              value={updatedData.payments}
              onChange={handleChange}
              required
              min="0"
              max={balance + Number(entry.payments)} // Allow increasing up to available balance
            />
          </label>
          <div className="form-buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PettyCashUpdateForm;
