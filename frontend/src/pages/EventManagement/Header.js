import React from "react";
import { Link } from "react-router-dom";

function Header() {
  const hoverStyle = {
    backgroundColor: '#b30000',
    color: '#fff',
    transform: 'scale(1.05)',
  };

  const defaultStyle = {
    display: 'block',
    padding: '12px', // Slightly increased for better spacing
    marginBottom: '15px',
    backgroundColor: '#444444',
    borderRadius: '8px',
    color: '#fff',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
  };

  const logoStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const logoImageStyle = {
    maxWidth: '60%',
    height: 'auto',
  };

  const titleBarStyle = {
    backgroundColor: '#262626',
    padding: '15px',
    margin: 0,
    width: 'calc(100% - 250px)',
    position: 'fixed',
    top: 0,
    left: '250px',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#fff',
    borderBottom: '2px solid #b30000', // Added a red accent border
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Light shadow for effect
  };

  const contentStyle = {
    marginTop: '70px', // Adjusted for new header height
    padding: '20px',
  };

  return (
    <div>
      {/* Sidebar */}
      <div style={{ width: '250px', height: '100vh', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', top: 0, left: 0 }}>
        <div style={logoStyle}>
          {/* Replaced text logo with image */}
          <img src="/images/company.png" alt="Company Logo" style={logoImageStyle} />
        </div>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {/* Other Buttons */}
          <li>
            <Link to="/" style={defaultStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, defaultStyle)}>
              All Events
            </Link>
          </li>
          <li>
            <Link to="/add" style={defaultStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, defaultStyle)}>
              Add Events
            </Link>
          </li>
          <li>
            <Link to="/eventPlanners" style={defaultStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, defaultStyle)}>
              All Event Planners
            </Link>
          </li>
          <li>
            <Link to="/eventPlanner/add" style={defaultStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, defaultStyle)}>
              Add Event Planners
            </Link>
          </li>
          {/* Logout Button with consistent size and hover effects */}
          <li>
            <Link
              to="/dashboard"
              style={defaultStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, defaultStyle)}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Header Title Bar */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Event Management</h1>
      </div>

      {/* Content Area */}
      <div style={contentStyle}>
        {/* Content like tables and other sections go here */}
      </div>
    </div>
  );
}

export default Header;
