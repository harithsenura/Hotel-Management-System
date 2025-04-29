import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import classes from './dashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { user } = useAuth();

    // Data for Pie Chart (Order Status Distribution)
    const orderStatusData = {
        labels: ['Pending', 'Completed', 'Canceled'],
        datasets: [
            {
                data: [30, 60, 10], // Example data for status distribution
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    // Data for Line Chart (Sales Trend)
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
            {
                label: 'Total Sales',
                data: [500, 800, 600, 1000, 900, 1200, 1400, 1100, 1300, 1500], // Example sales data
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const salesOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Sales Over Time' },
        },
    };

    return (
        <div className={classes.container}>
            {/* Graphical Analysis Section */}
            <div className={classes.graphContainer}>
                <h2>Orders Overview</h2>
                <div className={classes.chartRow}>
                    {/* Pie Chart: Order Status Distribution */}
                    <div className={classes.chartSection}>
                        <h3>Order Status Distribution</h3>
                        <div className={classes.chartWrapper}>
                            <Pie data={orderStatusData} />
                        </div>
                        <div className={classes.chartWrapper}>
                            <Line data={salesData} options={salesOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className={classes.menu}>
                {allItems
                    .filter(item => user.isAdmin || !item.forAdmin)
                    .map(item => (
                        <a
                            key={item.title}
                            href={item.url}
                            style={{
                                backgroundColor: item.bgColor,
                                color: item.color,
                            }}
                        >
                            <img src={item.imageUrl} alt={item.title} />
                            <h2>{item.title}</h2>
                        </a>
                    ))}
            </div>
        </div>
    );
};

const allItems = [
    {
        title: 'Orders',
        imageUrl: '/icons/orders.svg',
        url: '/orders',
        bgColor: 'red',
        color: 'white',
    },
    {
        title: 'Profile',
        imageUrl: '/icons/profile.svg',
        url: '/profile',
        bgColor: 'darkorange',
        color: 'white',
    },
    {
        title: 'Users',
        imageUrl: '/icons/users.svg',
        url: '/admin/users',
        forAdmin: true,
        bgColor: 'grey',
        color: 'white',
    },
    {
        title: 'Foods',
        imageUrl: '/icons/foods.svg',
        url: '/admin/foods',
        forAdmin: true,
        bgColor: 'green',
        color: 'white',
    },
];

export default Dashboard;
