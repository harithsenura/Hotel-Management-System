import React from 'react';
import { FaUsers, FaUserTie, FaMoneyBillWave, FaWarehouse, FaTruck, FaUtensils, FaCocktail, FaCalendarAlt } from 'react-icons/fa'; // Importing icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Inline styles for the dashboard and cards
const styles = {
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '1200px', // Limit the width of the dashboard
    margin: '0 auto', // Center the dashboard
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // 4 cards per row
    gap: '20px',
    width: '100%', // Ensure the grid takes full width
    marginBottom: '20px', // Space between rows
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    margin: '10px', // Add margin around cards for better spacing
  },
  cardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  icon: {
    fontSize: '40px',
    color: '#800000', // Maroon color for the icons
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  cardContent: {
    fontSize: '16px',
    color: '#6c757d',
  },
};

// Card component with hover effect and icon
const Card = ({ title, content, Icon, onClick }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <Icon style={styles.icon} />
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardContent}>{content}</div>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  const navigate = useNavigate(); // useNavigate hook

  return (
    <div style={styles.dashboard}>
      {/* First Row of Cards */}
      <div style={styles.cardContainer}>
        <Card
          title="Customer Management"
          content="Manage customers efficiently"
          Icon={FaUsers}
          onClick={() => navigate('/cuslogin')}
        />
        <Card title="Employee Management" content="Manage your employees" Icon={FaUserTie}  />
        <Card title="Finance Management" content="Track and manage finances" Icon={FaMoneyBillWave}  onClick={() => navigate('/finance/statement')}/>
        <Card title="Inventory Management" content="Manage your inventory" Icon={FaWarehouse} onClick={() => navigate('/inventorylogin')} />
      </div>

      {/* Second Row of Cards */}
      <div style={styles.cardContainer}>
        <Card title="Supplier Management" content="Manage supplier relationships" Icon={FaTruck} />
        <Card title="Restaurant Management" content="Oversee restaurant operations" Icon={FaUtensils} onClick={() => navigate('/food')}/>
        <Card title="Bar Management" content="Manage bar orders and inventory" Icon={FaCocktail} onClick={() => navigate('/barlogin')}  />
        <Card title="Event Management" content="Organize and track events" Icon={FaCalendarAlt}  onClick={() => navigate('/eventlogin')}/>
      </div>
    </div>
  );
};

export default Dashboard;