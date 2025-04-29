import React from "react";
import { Link } from "react-router-dom";

function SupplyerHeader() {
  const hoverStyle = {
    backgroundColor: "#b30000", // Darker red for hover
    color: "#fff",
    transform: "scale(1.05)",
  };

  const defaultStyle = {
    display: "block",
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "#444444", // Dark gray background for default state
    borderRadius: "5px",
    color: "#fff", // White text
    textDecoration: "none",
    transition: "background-color 0.3s ease, color 0.3s ease, transform 0.3s ease",
  };

  const logoStyle = {
    color: "#fff",
    textAlign: "center",
    lineHeight: "1.2",
    margin: "20px auto",
    fontSize: "1.5em",
  };

  const redTextStyle = {
    color: "red",
    fontSize: "2.5em", // Larger text size for better visibility
  };

  const titleBarStyle = {
    backgroundColor: "#1a1a1a", // Match sidebar color
    padding: "10px",
    margin: 0,
    width: "calc(100% - 250px)", // Full width minus sidebar width
    position: "fixed",
    top: 0, 
    left: "250px",
    boxSizing: "border-box",
    textAlign: "center",
    color: "#fff",
    borderBottom: "1px solid #333",
  };

  const contentStyle = {
    marginTop: "60px", // Gap between the title bar and content
    padding: "20px", 
  };

  return (
    <div>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          height: "100vh",
          backgroundColor: "#1a1a1a",
          padding: "15px",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <div style={logoStyle}>
          Supplyer <br />
          <span style={redTextStyle}>Panel</span>
        </div>
        <ul style={{ listStyleType: "none", padding: "30px 0 0 0" }}>
          <li>
            <Link
              to="/SupplierProfile"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              View supplier
            </Link>
          </li>
          <li>
            <Link
              to="/AddSupplier"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Add Supplier
            </Link>
          </li>
          <li>
            <Link
              to="/ManagerProfile"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              View Manager
            </Link>
          </li>
          <li>
            <Link
              to="/AddManager"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Add Manager
            </Link>
          </li>
          <li>
            <Link
              to="/"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Header Title Bar */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Supplier Management</h1>
      </div>

      {/* Content Area */}
      <div style={contentStyle}>
        {/* Content like tables and other sections go here */}
      </div>
    </div>
  );
}

export default SupplyerHeader;
