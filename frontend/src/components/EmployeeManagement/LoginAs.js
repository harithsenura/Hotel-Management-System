import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginAs() {
  const navigate = useNavigate();

  const handleEmployeeLogin = () => {
    navigate('/Emp_Login'); // Navigate to the employee login page
  };

  const handleAdminLogin = () => {
    navigate('/Admin_Login'); // Navigate to the admin login page
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #8e9eab, #eef2f3)',
    color: '#333',
  };

  const titleStyle = {
    fontSize: '36px',
    marginBottom: '40px',
    textAlign: 'center',
    fontFamily: '"Poppins", sans-serif',
  };

  const buttonStyle = {
    padding: '15px 30px',
    borderRadius: '6px',
    cursor: 'pointer',
    margin: '10px',
    fontSize: '18px',
    width: '200px',
    border: 'none',
    color: '#ffffff',
    background: 'linear-gradient(45deg, #800000, #800000)',
    transition: 'background 0.3s',
  };

  const buttonHoverStyle = {
    background: '#A52A2A', // Lighter shade on hover
  };
  const titleBarStyle = {
    backgroundColor: '#1a1a1a',  // Match sidebar color
    padding: '10px',  // Increased padding for better appearance
    margin: 0,
    width: '100%',  // Full width minus sidebar width
    position: 'fixed',
    top: 0,  // Align with the top of the viewport
    boxSizing: 'border-box',
    textAlign: 'center',  // Center the title text
    color: '#fff',  // White text for contrast on dark background
    borderBottom: '1px solid #333',  // Optional: darker gray border at the bottom for better contrast
  };
  return (
    <>
    <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Employee Management</h1>
      </div>
    <div style={containerStyle}>
      <h1 style={titleStyle}>Log In As</h1>
      <button
        style={buttonStyle}
        onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(45deg, #800000, #800000)')}
        onClick={handleEmployeeLogin}
      >
        Employee
      </button>
      <button
        style={buttonStyle}
        onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(45deg, #800000, #800000)')}
        onClick={handleAdminLogin}
      >
        Admin
      </button>
      </div>
      </>
  );
}
