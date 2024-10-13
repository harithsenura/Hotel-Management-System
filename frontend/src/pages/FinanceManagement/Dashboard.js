// src/pages/Dashboard/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { FaChartPie, FaChartBar } from 'react-icons/fa';
import SideBar from '../../components/SideBar/FinanceSideBar';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  // State variables
  const [incomeStatements, setIncomeStatements] = useState([]);
  const [pettyCashData, setPettyCashData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch both income and petty cash data when component mounts
    fetchIncomeStatements();
    fetchPettyCashData();
  }, []);

  // Function to fetch income statements from the backend
  const fetchIncomeStatements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/finance/income'); // Adjust the endpoint as needed
      console.log('Fetched Income Statements:', response.data); // Debugging log
      if (Array.isArray(response.data) && response.data.length > 0) {
        setIncomeStatements(response.data); // Store all income statements for analysis
      } else {
        console.warn('No income data received from the backend.');
      }
    } catch (error) {
      console.error('Error fetching income statements:', error);
      setError('Failed to fetch income statements.');
    }
  };

  // Function to fetch petty cash data from the backend
  const fetchPettyCashData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/finance/pettycash'); // Adjust the endpoint as needed
      console.log('Fetched Petty Cash Data:', response.data); // Debugging log
      if (Array.isArray(response.data) && response.data.length > 0) {
        setPettyCashData(response.data); // Store all petty cash entries
      } else {
        console.warn('No petty cash data received from the backend.');
      }
    } catch (error) {
      console.error('Error fetching petty cash data:', error);
      setError('Failed to fetch petty cash data.');
    } finally {
      setLoading(false); // Stop loading after both fetches are attempted
    }
  };

  // Function to prepare data for Doughnut Chart (Expense Breakdown)
  const prepareDonutData = () => {
    if (!incomeStatements.length) {
      console.warn('No income statements available for Doughnut Chart');
      return {
        labels: [],
        datasets: [],
      };
    }

    // Safely parse numbers, defaulting to 0 if undefined or invalid
    const totalCostOfSales = incomeStatements.reduce(
      (acc, curr) => acc + Number(curr.costofsales || 0),
      0
    );
    const totalDeliveryCost = incomeStatements.reduce(
      (acc, curr) => acc + Number(curr.deliverycost || 0),
      0
    );
    const totalAdministrativeCost = incomeStatements.reduce(
      (acc, curr) => acc + Number(curr.administrativecost || 0),
      0
    );
    const totalOtherExpenses = incomeStatements.reduce(
      (acc, curr) => acc + Number(curr.otherexpences || 0),
      0
    );
    const totalFinancialExpenses = incomeStatements.reduce(
      (acc, curr) => acc + Number(curr.financeexpences || 0),
      0
    );

    const donutData = {
      labels: [
        'Cost of Sales',
        'Delivery Cost',
        'Administrative Expenses',
        'Other Expenses',
        'Financial Expenses',
      ],
      datasets: [
        {
          label: 'Expenses Breakdown',
          data: [
            totalCostOfSales,
            totalDeliveryCost,
            totalAdministrativeCost,
            totalOtherExpenses,
            totalFinancialExpenses,
          ],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#FF7F50'],
          hoverBackgroundColor: [
            '#FF6384CC',
            '#36A2EBCC',
            '#FFCE56CC',
            '#8A2BE2CC',
            '#FF7F50CC',
          ],
        },
      ],
    };

    console.log('Prepared Doughnut Data:', donutData); // Debugging log
    return donutData;
  };

  // Function to prepare data for Bar Chart (Petty Cash Payments Over Time)
  const preparePettyCashBarChartData = () => {
    if (!pettyCashData.length) {
      console.warn('No petty cash data available for Bar Chart');
      return {
        labels: [],
        datasets: [],
      };
    }

    // Assuming pettyCashData has 'date' and 'payments' fields
    // Aggregate payments by month-year
    const paymentsByMonth = pettyCashData.reduce((acc, curr) => {
      const date = new Date(curr.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += Number(curr.payments || 0);
      return acc;
    }, {});

    // Sort the keys chronologically
    const sortedKeys = Object.keys(paymentsByMonth).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA - dateB;
    });

    const labels = sortedKeys;
    const paymentsData = sortedKeys.map((key) => paymentsByMonth[key]);

    const barChartData = {
      labels,
      datasets: [
        {
          label: 'Petty Cash Payments',
          data: paymentsData,
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: '#4BC0C0',
          borderWidth: 1,
        },
      ],
    };

    console.log('Prepared Petty Cash Bar Chart Data:', barChartData); // Debugging log
    return barChartData;
  };

  // Calculate totals for the cards
  const calculateTotals = () => {
    const totalIncome = incomeStatements.reduce(
      (acc, curr) => acc + Number(curr.sales || 0),
      0
    );
    const totalProfit = incomeStatements.reduce(
      (acc, curr) => acc + Number(curr.netprofit || 0),
      0
    );
    const totalCost = incomeStatements.reduce(
      (acc, curr) => acc + Number(curr.costofsales || 0),
      0
    );

    return {
      totalIncome,
      totalProfit,
      totalCost,
    };
  };

  const totals = calculateTotals();
  const donutData = prepareDonutData();
  const barChartData = preparePettyCashBarChartData();

  return (
    <>
      <SideBar />
      <div className="dashboard-container">
        <h2 className="dashboard-header">Financial Dashboard</h2>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            {/* Total Cards */}
            <div className="total-cards-container">
              <div className="total-card income-card">
                <h3>Total Sales Income</h3>
                <p>Rs{totals.totalIncome.toLocaleString()}</p>
              </div>
              <div className="total-card profit-card">
                <h3>Total Profit</h3>
                <p>Rs{totals.totalProfit.toLocaleString()}</p>
              </div>
              <div className="total-card cost-card">
                <h3>Total Sales Cost</h3>
                <p>Rs{totals.totalCost.toLocaleString()}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="charts-container">
              {/* Doughnut Chart */}
              <div className="chart-card small-chart">
                <div className="chart-header">
                  <FaChartPie size={20} />
                  <h4>Expenses Breakdown</h4>
                </div>
                {donutData.labels.length > 0 && donutData.datasets.length > 0 ? (
                  <Doughnut data={donutData} options={{ maintainAspectRatio: false }} />
                ) : (
                  <p>No expense data available to display.</p>
                )}
              </div>

              {/* Bar Chart */}
              <div className="chart-card small-chart">
                <div className="chart-header">
                  <FaChartBar size={20} />
                  <h4>Petty Cash Payments Over Time</h4>
                </div>
                {barChartData.labels.length > 0 && barChartData.datasets.length > 0 ? (
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                ) : (
                  <p>No petty cash data available to display.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
