import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import SideBar from "../../components/Slider/InventoryManagementSidebar"; // Ensure the path is correct

const Dashboard = () => {
  const [stockItems, setStockItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStockItems();
    fetchOrderItems();
  }, []);

  const fetchStockItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/inventory/stocks`
      );
      setStockItems(response.data.data);
    } catch (error) {
      console.error("Error fetching stock items:", error);
      alert("Failed to fetch stock items: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/inventory/orders`
      );
      console.log(response.data.data); 
      setOrderItems(response.data.data);
    } catch (error) {
      console.error("Error fetching order items:", error);
      alert("Failed to fetch order items: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const prepareStockData = () => {
    return stockItems.map((item) => ({
      name: item.itemName,
      stock: item.inStock,
    }));
  };

  const prepareOrderData = () => {
    return orderItems.map((item) => ({
      name: item.orderName,
      items: item.noOfItems,
    }));
  };

  return (
    <>
      <SideBar />
      <div style={containerStyle}>
        <h1 style={headerStyle}>Stock Analysis</h1>

        <div style={columnsContainerStyle}>
          {/* Stock Items Section */}
          <div style={sectionCardStyle}>
            <h2 style={sectionHeaderStyle}>Stock Items</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={prepareStockData()}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderStyle}>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3">Loading...</td>
                  </tr>
                ) : (
                  stockItems.map((item) => (
                    <tr key={item.id} style={tableRowStyle}>
                      <td>{item.itemName}</td>
                      <td>{item.category}</td>
                      <td>{item.statusOfItem}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Order Items Section */}
          <div style={sectionCardStyle}>
            <h2 style={sectionHeaderStyle}>Order Items</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={prepareOrderData()}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="items" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderStyle}>
                  <th>Order Name</th>
                  <th>Supplier</th>
                  <th>No. of Items</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3">Loading...</td>
                  </tr>
                ) : (
                  orderItems.map((item) => (
                    <tr key={item.id} style={tableRowStyle}>
                      <td>{item.orderName}</td>
                      <td>{item.supplier}</td>
                      <td>{item.noOfItems}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

// Styles for the dashboard container and elements
const containerStyle = {
  marginLeft: "250px",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f8f8f8",
  maxWidth: "1500px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "32px",
  color: "#333",
};

const columnsContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const sectionCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "15px",
  margin: "10px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  width: "48%", // Set width for columns
};

const sectionHeaderStyle = {
  color: "#555",
  marginBottom: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const tableRowStyle = {
  transition: "background-color 0.3s ease",
  cursor: "pointer",
};

// Add a style for table header to ensure alignment with rows
const tableHeaderStyle = {
  backgroundColor: "#f1f1f1",
  textAlign: "left",
};

export default Dashboard;
