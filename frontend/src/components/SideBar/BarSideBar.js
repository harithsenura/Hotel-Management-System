import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "../SideBar/DefaultLayout.css";
import Spinner from "../Bar/Spinner";
import logo from '../../images/company.png';

const { Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  // To get local storage data
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

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
    textAlign: "center", // Center align text
    lineHeight: "1.2",
    margin: "20px auto", // Center the logo with margin
    fontSize: "1.5em", // Increased text size
  };

  const redTextStyle = {
    color: "red",
    fontSize: "2.5em", // Larger text size for better visibility
  };

  // Adjusted title bar styles for cleaner layout
  const titleBarStyle = {
    backgroundColor: "#1a1a1a", // Match sidebar color
    padding: "0 15px", // Reduced padding for smaller appearance
    width: "calc(100% - 250px)", // Width to match the sidebar
    position: "fixed",
    top: 0, // Align with the top of the viewport
    left: "250px", // Position to the right of the sidebar
    display: "flex", // Flexbox for layout
    justifyContent: "space-between", // Space out title and cart button
    alignItems: "center", // Center items vertically
    color: "#fff", // White text for contrast on dark background
    borderBottom: "1px solid #333", // Optional: darker gray border at the bottom for better contrast
    height: "70px", // Fixed height for the title bar
    zIndex: 1000, // Ensure it stays above content
  };

  const contentStyle = {
    marginTop: "50px", // Gap between the title bar and content
    padding: "20px", // Additional padding around the content
    marginLeft: "250px", // Adjust for sidebar width
  };

  // Style for the cart button
  const cartButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff", // White color for the icon
    cursor: "pointer",
    outline: "none",
    fontSize: "1.5em", // Size for better visibility
    display: "flex", // Use flexbox for alignment
    alignItems: "center", // Center align items
    padding: "0", // Remove extra padding
  };

  return (
    <Layout>
      {loading && <Spinner />}
      
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
          <a href="/adminpannel" style={{ textDecoration: "none" }}>
            <img
              src={logo}
              alt="Cinnamon Red Logo"
              style={{ width: "100px", height: "auto" }}
            />
          </a>
        </div>
        <ul style={{ listStyleType: "none", padding: "30px 0 0 0" }}>
          <li>
            <Link
              to="/bardashboard"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/home"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Explore Categories
            </Link>
          </li>
          <li>
            <Link
              to="/bills"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Bill Section
            </Link>
          </li>
          <li>
            <Link
              to="/items"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Item List
            </Link>
          </li>
          <li>
            <Link
              to="/adminpannel" // Link to Dashboard page on Log Out
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Log Out
            </Link>
          </li>
        </ul>
      </div>

      {/* Header Title Bar */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, fontSize: "1.2em", lineHeight: "70px" }}>POS Management</h1>
        <button
          style={cartButtonStyle}
          onClick={() => navigate("/barcart")}
        >
          <p style={{ margin: 0, marginRight: "5px" }}>{cartItems.length}</p>
          <ShoppingCartOutlined />
        </button>
      </div>

      {/* Content Area */}
      <Content
        className="site-layout-background"
        style={contentStyle}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default DefaultLayout;
