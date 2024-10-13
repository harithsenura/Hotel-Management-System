import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,  // Import LineElement for line charts
    PointElement, // Import PointElement for points in line charts
    Filler,       // Import Filler for the fill option in line charts
} from 'chart.js';
import DefaultLayout from '../SideBar/BarSideBar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, Filler); // Register the elements

const Dashboard = () => {
    // Data for the bar chart
    const barChartData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Sales',
                data: [12, 19, 3, 5, 2],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Data for the line chart
    const lineChartData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Expenses',
                data: [5, 10, 15, 20, 25],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.1,
            },
        ],
    };

    return (
        <>
            <DefaultLayout />
            <div style={{ padding: '30px', width: "1200px", marginLeft: "250px" }}>
                <h2>Dashboard</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ width: '48%' }}>
                        <h3>Sales (Bar Chart)</h3>
                        <Bar data={barChartData} options={{ responsive: true }} />
                    </div>

                    <div style={{ width: '48%' }}>
                        <h3>Expenses (Line Chart)</h3>
                        <Line data={lineChartData} options={{ responsive: true }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
