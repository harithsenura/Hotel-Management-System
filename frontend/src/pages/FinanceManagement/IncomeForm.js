import React, { useState } from 'react';
import axios from 'axios';
import './IncomeForm.css';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../components/SideBar/FinanceSideBar';

const IncomeForm = () => {
  const [formData, setFormData] = useState({
    sales: '',
    costofsales: '',
    otherincomes: '',
    deliverycost: '',
    administrativecost: '',
    otherexpences: '',
    financeexpences: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send data to the backend
      const response = await axios.post('http://localhost:5000/finance/income/add', {
        sales: Number(formData.sales),
        costofsales: Number(formData.costofsales),
        otherincomes: Number(formData.otherincomes),
        deliverycost: Number(formData.deliverycost),
        administrativecost: Number(formData.administrativecost),
        otherexpences: Number(formData.otherexpences),
        financeexpences: Number(formData.financeexpences),
      });

      if (response.status === 200) {
        alert('Income statement added successfully');
        // Clear the form after successful submission
        setFormData({
          sales: '',
          costofsales: '',
          otherincomes: '',
          deliverycost: '',
          administrativecost: '',
          otherexpences: '',
          financeexpences: '',
        });
        // Navigate back to the main statement page
        navigate('/finance/dashboard');
      } else {
        console.error('Failed to add income statement:', response.data);
        alert('Error adding income statement');
      }
    } catch (error) {
      console.error('Error adding income statement:', error);
      alert('Failed to add income statement');
    }
  };

  return (
    <>
      <SideBar/>
    <form onSubmit={handleSubmit} className="income-form">
      <h2>Income Statement Form</h2>
      <label>Sales</label>
      <input
        type="number"
        name="sales"
        value={formData.sales}
        onChange={handleChange}
        placeholder="Enter sales amount"
      />
      <label>Cost of Sales</label>
      <input
        type="number"
        name="costofsales"
        value={formData.costofsales}
        onChange={handleChange}
        placeholder="Enter cost of sales"
      />
      <label>Other Incomes</label>
      <input
        type="number"
        name="otherincomes"
        value={formData.otherincomes}
        onChange={handleChange}
        placeholder="Enter other incomes"
      />
      <label>Delivery Cost</label>
      <input
        type="number"
        name="deliverycost"
        value={formData.deliverycost}
        onChange={handleChange}
        placeholder="Enter delivery cost"
      />
      <label>Administrative Cost</label>
      <input
        type="number"
        name="administrativecost"
        value={formData.administrativecost}
        onChange={handleChange}
        placeholder="Enter administrative cost"
      />
      <label>Other Expenses</label>
      <input
        type="number"
        name="otherexpences"
        value={formData.otherexpences}
        onChange={handleChange}
        placeholder="Enter other expenses"
      />
      <label>Financial Expenses</label>
      <input
        type="number"
        name="financeexpences"
        value={formData.financeexpences}
        onChange={handleChange}
        placeholder="Enter financial expenses"
      />

      <button type="submit" className="button">Add</button>
      </form>
      </>
  );
};

export default IncomeForm;
