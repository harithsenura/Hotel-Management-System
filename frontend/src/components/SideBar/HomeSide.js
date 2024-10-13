import React from "react";
import { Link } from "react-router-dom";
import logo from '../../images/company.png';

function SideBar() {
  const hoverStyle = {
    backgroundColor: '#b30000',  // Darker red for hover
    color: '#fff',
    transform: 'scale(1.05)',
  };

  const defaultStyle = {
    display: 'block',
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#444444',  // Dark gray background for default state
    borderRadius: '5px',
    color: '#fff',  // White text
    textDecoration: 'none',
    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
  };

  const activeStyle = {
    ...defaultStyle,
    backgroundColor: '#800000',  // Maroon for active
    color: '#fff',
  };

  const disabledStyle = {
    ...defaultStyle,
    backgroundColor: '#666666',  // Medium gray for disabled
    color: '#ccc',  // Light gray text for disabled
    pointerEvents: 'none',
    cursor: 'not-allowed',
  };

  const logoStyle = {
    height: '50px',  // Adjust the logo size
    width: '80px',   // Adjust the logo size
    marginLeft: '10px',  // Add some margin on the left
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
    display: 'flex',  // Flexbox for aligning items in the header
    alignItems: 'center',  // Vertically align the logo and title
    paddingLeft: '50px',  // Push content to the right to make space for the logo
  };

  const contentStyle = {
    marginTop: '60px',  // Gap between the title bar and content
    padding: '20px',  // Additional padding around the content
  };

  return (
    <div>
      {/* Header Title Bar */}
      <div style={titleBarStyle}>
        <img src={logo} alt="Company Logo" style={logoStyle} /> {/* Logo on the left */}
        <h1 style={{ margin: 0, padding: 0, marginLeft: '400px' }}>Welcome to Admin Panel</h1> {/* Title next to logo */}
      </div>
    </div>
  );
}

export default SideBar;
