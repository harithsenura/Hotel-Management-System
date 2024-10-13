// src/pages/PettyCashTable/PettyCashTable.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PettyCashTable.css';
import PettyCashUpdateForm from './PettyCashUpdateForm'; // Ensure this component exists
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaEdit, FaTrash, FaDownload ,FaPlus} from 'react-icons/fa';
import SideBar from '../../components/SideBar/FinanceSideBar';
import logo from '../../images/company.png';
const PettyCashTable = () => {
  // State variables
  const [pettyCashData, setPettyCashData] = useState([]);
  const [balance, setBalance] = useState(100000); // Initial balance
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    no: '', // Auto-generated
    payments: '',
  });
  const [selectedEntry, setSelectedEntry] = useState(null); // For updating entries
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Months are 0-indexed
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch data on component mount and when currentMonth or currentYear changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [currentMonth, currentYear]);

  // Function to fetch data from backend
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/finance/pettycash');

      // Sort entries by date
      const sortedData = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Assign sequential 'no' based on sorted data
      sortedData.forEach((entry, index) => {
        entry.no = index + 1;
      });

      setPettyCashData(sortedData);

      // Calculate balance correctly with carry-over
      const calculatedBalance = calculateCurrentBalance(
        sortedData,
        currentMonth,
        currentYear
      );
      setBalance(calculatedBalance);

      // Set the next "No" based on the highest current value
      setFormData((prev) => ({ ...prev, no: sortedData.length + 1 }));
    } catch (error) {
      console.error('Error fetching petty cash data', error);
      alert('Failed to fetch petty cash data');
    }
  };

  // Function to calculate the current balance with carry-over
  const calculateCurrentBalance = (data, month, year) => {
    // Extract unique month-year pairs in chronological order
    const monthYearsSet = new Set();
    data.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const entryMonth = entryDate.getMonth() + 1;
      const entryYear = entryDate.getFullYear();
      const key = `${entryYear}-${entryMonth}`;
      monthYearsSet.add(key);
    });

    const monthYears = Array.from(monthYearsSet).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      return monthA - monthB;
    });

    console.log('Sorted Month-Years:', monthYears); // Debugging log

    let carriedOver = 0;
    let currentBalance = 0;

    for (let key of monthYears) {
      const [entryYear, entryMonth] = key.split('-').map(Number);

      // Stop if we've processed all months up to the selected month and year
      if (entryYear > year || (entryYear === year && entryMonth > month)) {
        break;
      }

      // Sum payments for this month
      const sumPayments = data
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          const eMonth = entryDate.getMonth() + 1;
          const eYear = entryDate.getFullYear();
          return eYear === entryYear && eMonth === entryMonth;
        })
        .reduce((sum, entry) => sum + Number(entry.payments || 0), 0);

      console.log(
        `Processing ${entryMonth}-${entryYear}: Sum Payments = ${sumPayments}, Carried Over = ${carriedOver}`
      ); // Debugging log

      // Initial balance for this month is 100,000 plus carried over
      const initialBalance = 100000 + carriedOver;

      // Remaining balance after payments
      carriedOver = initialBalance - sumPayments;

      console.log(
        `After ${entryMonth}-${entryYear}: Carried Over = ${carriedOver}`
      ); // Debugging log

      // If this is the current month, set the currentBalance
      if (entryYear === year && entryMonth === month) {
        currentBalance = carriedOver;
      }
    }

    console.log('Calculated Current Balance:', currentBalance); // Debugging log

    return currentBalance;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add a new petty cash entry
  const handleAdd = async (e) => {
    e.preventDefault();

    // Validate that the date is within the selected month and year
    const entryDate = new Date(formData.date);
    const entryMonth = entryDate.getMonth() + 1;
    const entryYear = entryDate.getFullYear();

    if (entryMonth !== currentMonth || entryYear !== currentYear) {
      alert('Please enter a date within the selected month and year.');
      return;
    }

    // Validate that payment does not exceed balance
    if (Number(formData.payments) > balance) {
      alert('Payment exceeds the current balance.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/finance/pettycash/add', formData);
      fetchData(); // Refresh data to include the new entry
      setFormData({
        date: '',
        description: '',
        no: formData.no + 1,
        payments: '',
      }); // Reset form
      alert('Entry added successfully');
    } catch (error) {
      console.error('Error adding petty cash entry', error);
      alert('Failed to add entry');
    }
  };

  // Open the update form for a selected entry
  const handleOpenUpdateForm = (entry) => {
    setSelectedEntry(entry);
  };

  // Update a petty cash entry
  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(
        `http://localhost:5000/finance/pettycash/update/${id}`,
        updatedData
      );
      fetchData(); // Refresh data to reflect updates
      setSelectedEntry(null); // Close update form
      alert('Entry updated successfully');
    } catch (error) {
      console.error('Error updating petty cash entry', error);
      alert('Failed to update entry');
    }
  };

  // Close the update form
  const handleCloseUpdateForm = () => {
    setSelectedEntry(null);
  };

  // Delete a petty cash entry
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`http://localhost:5000/finance/pettycash/delete/${id}`);
        fetchData(); // Refresh data after deletion
        alert('Entry deleted successfully');
      } catch (error) {
        console.error('Error deleting petty cash entry', error);
        alert('Failed to delete entry');
      }
    }
  };

  // Function to download the table as a PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Date', 'Description', 'No', 'Payments'];
    const tableRows = [];
    
    // Filter entries for the selected month and year
    const filteredData = pettyCashData.filter((entry) => {
      const entryDate = new Date(entry.date);
      const entryMonth = entryDate.getMonth() + 1;
      const entryYear = entryDate.getFullYear();
      return entryMonth === currentMonth && entryYear === currentYear;
    });
    
    // Prepare table rows
    filteredData.forEach((entry) => {
      const rowData = [
        entry.date ? entry.date.substring(0, 10) : 'N/A',
        entry.description,
        entry.no,
        entry.payments,
      ];
      tableRows.push(rowData);
    });
  
    // Add page border (around the whole page)
    doc.setLineWidth(0.5); // Line width for border
    doc.rect(10, 10, 190, 277); // x, y, width, height (adjust the values as needed)
  
    // Add company logo at the top-left corner (small logo)
    doc.addImage(logo, 'PNG', 10, 10, 30, 25); // x, y, width, height of logo
    
    // Add space after the logo
    doc.setFontSize(18);
    doc.text('Petty Cash Statement', 50, 22); // Title after logo, adjusted to start after some space
    
    // Add some spacing below the heading
    doc.setFontSize(12);
    doc.text(
      `Month: ${new Date(currentYear, currentMonth - 1).toLocaleString('default', {
        month: 'long',
      })} ${currentYear}`,
      50,
      30 // Adjust position based on the title
    );
    
    // Add space before the table content
    doc.setFontSize(10);
    const tableStartY = 40; // Space before the table
    
    // Add table below the heading
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: tableStartY, // Table starts after the heading
      theme: 'grid',
    });
  
    // Add balance at the end of the table
    const finalY = doc.lastAutoTable.finalY || tableStartY;
    doc.text(`Current Balance: ${balance}`, 14, finalY + 10);
  
    // Add fixed "Thank You" message at the bottom center of the page
    doc.setFontSize(10);
    const thankYouMessage = 'Thank you for using our services!';
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getStringUnitWidth(thankYouMessage) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    doc.text(thankYouMessage, (pageWidth - textWidth) / 2, 285); // Positioned at bottom center
    
    // Save the PDF
    doc.save('Petty_Cash_Statement.pdf');
  };
  
  
  // Function to handle month and year selection
  const handleMonthChange = (e) => {
    const [month, year] = e.target.value.split('-').map(Number);
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  // Helper function to generate month options for the selector
  const getMonthOptions = () => {
    const months = [];
    const current = new Date();
    let month = current.getMonth() + 1;
    let year = current.getFullYear();

    // Allow selection of the current month and the previous 11 months (total 12 months)
    for (let i = 0; i < 12; i++) {
      months.push({ month, year });
      month -= 1;
      if (month === 0) {
        month = 12;
        year -= 1;
      }
    }

    return months;
  };

  return (
    <>
      <SideBar />
      <div className="petty-cash-table-container">
        <h2>Petty Cash Statement</h2>

        {/* Header with Month Selector and Current Balance */}
        <div className="header">
          {/* Month Selector */}
          <div className="month-selector">
            <label htmlFor="month">Select Month: </label>
            <select
              id="month"
              onChange={handleMonthChange}
              value={`${currentMonth}-${currentYear}`}
              className='date-input'
            >
              {getMonthOptions().map(({ month, year }) => (
                <option key={`${month}-${year}`} value={`${month}-${year}`}>
                  {new Date(year, month - 1).toLocaleString('default', {
                    month: 'long',
                  })}{' '}
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Display Current Balance */}
          <div className="balance">
            <h3>
              Current Balance for{' '}
              {new Date(currentYear, currentMonth - 1).toLocaleString('default', {
                month: 'long',
              })}{' '}
              {currentYear}: {balance}
            </h3>
          </div>
        </div>

        {/* Petty Cash Form */}
        <form onSubmit={handleAdd} className="petty-cash-form">
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={formData.date}
            onChange={handleChange}
            required
            max={`${currentYear}-${
              currentMonth < 10 ? '0' + currentMonth : currentMonth
            }-31`} // Ensure date is within the selected month
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="no"
            placeholder="No"
            value={formData.no}
            readOnly
          />
          <input
            type="number"
            name="payments"
            placeholder="Payments"
            value={formData.payments}
            onChange={handleChange}
            required
            min="0"
            max={balance} // Prevent payments exceeding the balance
          />
          <button type="submit" className="add-button">
            <FaPlus /> Add
          </button>
        </form>

        {/* Update Form Modal */}
        {selectedEntry && (
          <PettyCashUpdateForm
            entry={selectedEntry}
            onUpdate={handleUpdate}
            onClose={handleCloseUpdateForm}
            currentMonth={currentMonth}
            currentYear={currentYear}
            balance={balance}
          />
        )}

        {/* Petty Cash Table */}
        <div className="table-container">
          <table className="petty-cash-table" id="petty-cash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>No</th>
                <th>Payments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pettyCashData
                .filter((entry) => {
                  const entryDate = new Date(entry.date);
                  const entryMonth = entryDate.getMonth() + 1;
                  const entryYear = entryDate.getFullYear();
                  return (
                    entryMonth === currentMonth && entryYear === currentYear
                  );
                })
                .map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.date ? entry.date.substring(0, 10) : 'N/A'}</td>
                    <td>{entry.description}</td>
                    <td>{entry.no}</td>
                    <td>{entry.payments}</td>
                    <td>
                      <button onClick={() => handleOpenUpdateForm(entry)}>
                        <FaEdit /> Update
                      </button>
                      <button onClick={() => handleDelete(entry._id)}>
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Download PDF Button */}
          {pettyCashData.length > 0 && (
            <button className="download-button" onClick={handleDownloadPDF}>
              <FaDownload /> Download Monthly Statement
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PettyCashTable;
