import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Input, Select, message } from "antd";
import SupplyerHeader from "./SupplyerHeader";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "../../images/company.png";
import SideBar from "../SideBar/SupplySideBar";

const { Option } = Select;

const SupplierProfile = () => {
  const [supplies, setSupplies] = useState([]);
  const [orders, setOrders] = useState([]); // State for orders
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch supplies data
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supply`);
        setSupplies(response.data);
        console.log("Fetched Supplies:", response.data); // Debugging: log fetched supplies
      } catch (err) {
        console.error("Error fetching supplies:", err);
        setError(err.message);
      }
    };

    fetchSupplies();
  }, []);

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/inventory/orders/");
        if (response.data && Array.isArray(response.data.data)) {
          setOrders(response.data.data);
          console.log("Fetched Orders:", response.data.data); // Debugging: log fetched orders

          // Log each order's status for debugging
          response.data.data.forEach((order, index) => {
            console.log(`Order ${index + 1} Status:`, order.status);
          });
        } else {
          console.error("API response does not contain a 'data' array:", response.data);
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);

  // Handle updating supply
  const handleUpdate = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/supply/update/${editItem._id}`, values);
      message.success("Supply updated successfully!");
      setModalVisible(false);
      setEditItem(null);
      // Refresh supplies
      const response = await axios.get(`http://localhost:5000/api/supply`);
      setSupplies(response.data);
      console.log("Updated Supplies:", response.data); // Debugging: log updated supplies
    } catch (error) {
      message.error("Failed to update supply.");
      console.error("Update error:", error);
    }
  };

  // Handle deleting supply
  const handleDelete = async (supplyId) => {
    try {
      if (window.confirm("Are you sure you want to delete this supply?")) {
        await axios.delete(`http://localhost:5000/api/supply/delete/${supplyId}`);
        message.success("Supply deleted successfully!");
        const updatedSupplies = supplies.filter((supply) => supply._id !== supplyId);
        setSupplies(updatedSupplies);
        console.log("Supplies after deletion:", updatedSupplies); // Debugging: log updated supplies
      }
    } catch (error) {
      message.error("Failed to delete supply.");
      console.error("Delete error:", error);
    }
  };

  // Handle editing supply
  const openEditModal = (supply) => {
    setEditItem(supply);
    setModalVisible(true);
  };

  // Generate PDF for supplies
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.addImage(logo, "PNG", 150, 10, 25, 13);
    doc.setFontSize(10);
    doc.text("Your Company Name", 10, 10);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 15);
    doc.text("Contact: (123) 456-7890", 10, 20);
    doc.text("Email: info@yourcompany.com", 10, 25);
    doc.setFontSize(18);
    doc.text("Supplies List", doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });

    const headers = [
      "Supply ID",
      "Item Name",
      "Unit Price",
      "Initial Quantity",
      "Description",
      "Category",
    ];
    const data = supplies.map((supply) => [
      supply.supplyId,
      supply.itemName,
      supply.unitPrice,
      supply.initialQuantity,
      supply.description,
      supply.category,
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 40,
      styles: {
        fontSize: 10,
      },
    });

    const endingY = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(10);
    doc.text(
      "Thank you for choosing our services.",
      doc.internal.pageSize.getWidth() / 2,
      endingY,
      { align: "center" }
    );
    doc.text(
      "Contact us at: (123) 456-7890",
      doc.internal.pageSize.getWidth() / 2,
      endingY + 10,
      { align: "center" }
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    doc.save("supplies_report.pdf");
  };

  // Handle updating order status
  const handleStatusChange = (orderId, newStatus) => {
    axios
      .put(`http://localhost:5000/api/inventory/orders/updateStatus/${orderId}`, { status: newStatus })
      .then((response) => {
        // Update the local state to reflect the change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        message.success("Order status updated successfully!");
        console.log(`Order ${orderId} status updated to ${newStatus}`); // Debugging: confirm update
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        message.error(
          "Failed to update status: " + (error.response?.data?.message || error.message)
        );
      });
  };

  // Filter supplies based on search term
  const filteredSupplies = supplies.filter((supply) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      supply.itemName.toLowerCase().includes(searchTermLower) ||
      supply.supplyId.toLowerCase().includes(searchTermLower) ||
      supply.unitPrice.toString().toLowerCase().includes(searchTermLower) ||
      supply.initialQuantity.toString().toLowerCase().includes(searchTermLower) ||
      supply.description.toLowerCase().includes(searchTermLower) ||
      supply.category.toLowerCase().includes(searchTermLower)
    );
  });

  // No longer filtering to pending orders, using all orders
  console.log("All Orders:", orders); // Debugging: log all orders

  if (error) return <div>Error: {error}</div>;
  if (supplies.length === 0 && orders.length === 0) return <div>Loading...</div>;

  return (
    <>
      <SideBar />
      <div style={containerStyle}>
        {/* Supplies Section */}
        <h1 style={headerStyle}>Supplies List</h1>

        {/* Search Input */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <Input
            placeholder="Search Supplies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "300px" }}
          />
          <Button
            type="primary"
            onClick={generatePDF}
            style={{ marginLeft: "10px", backgroundColor: "#800000" }}
          >
            Generate PDF
          </Button>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Supply ID</th>
              <th style={tableHeaderStyle}>Item Name</th>
              <th style={tableHeaderStyle}>Unit Price</th>
              <th style={tableHeaderStyle}>Initial Quantity</th>
              <th style={tableHeaderStyle}>Description</th>
              <th style={tableHeaderStyle}>Category</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSupplies.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No Supplies Found
                </td>
              </tr>
            ) : (
              filteredSupplies.map((supply) => (
                <tr key={supply._id}>
                  <td style={tableDataStyle}>{supply.supplyId}</td>
                  <td style={tableDataStyle}>{supply.itemName}</td>
                  <td style={tableDataStyle}>${supply.unitPrice}</td>
                  <td style={tableDataStyle}>{supply.initialQuantity}</td>
                  <td style={tableDataStyle}>{supply.description}</td>
                  <td style={tableDataStyle}>{supply.category}</td>
                  <td style={tableDataStyle}>
                    <div style={buttonContainerStyle}>
                      <Button
                        type="primary"
                        onClick={() => openEditModal(supply)}
                        style={{ ...actionButtonStyle, backgroundColor: "green" }}
                      >
                        Update
                      </Button>
                      <Link
                        to="#"
                        style={{ ...linkStyle, ...actionButtonStyle, backgroundColor: "red" }}
                        onClick={() => handleDelete(supply._id)}
                      >
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Edit Supply Modal */}
        {modalVisible && (
          <Modal
            title="Edit Supply"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
          >
            <Form initialValues={editItem} onFinish={handleUpdate} layout="vertical">
              <Form.Item
                name="itemName"
                label="Item Name"
                rules={[
                  { required: true, message: "Please enter the item name!" },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error("Please enter the item name!"));
                      }
                      if (/^\d+$/.test(value)) {
                        return Promise.reject(new Error("Item name must not be a number!"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="unitPrice"
                label="Unit Price"
                rules={[{ required: true, message: "Please enter the unit price!" }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="initialQuantity"
                label="Initial Quantity"
                rules={[{ required: true, message: "Please enter the initial quantity!" }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter a description!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please enter the category!" }]}
              >
                <Input />
              </Form.Item>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
                <Button onClick={() => setModalVisible(false)} style={{ marginLeft: "10px" }}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal>
        )}

        {/* Orders Section */}
        <h1 style={{ ...headerStyle, marginTop: "40px" }}>All Orders</h1>
        <div style={{ marginBottom: "20px" }}>
          {/* You can add filters or actions related to orders here */}
        </div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Order Name</th>
              <th style={tableHeaderStyle}>Supplier</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Number of Items</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td style={tableDataStyle}>{order.orderName}</td>
                  <td style={tableDataStyle}>{order.supplier}</td>
                  <td style={tableDataStyle}>{new Date(order.date).toLocaleDateString()}</td>
                  <td style={tableDataStyle}>{order.noOfItems}</td>
                  <td style={tableDataStyle}>{order.status}</td>
                  <td style={tableDataStyle}>
                    <Select
                      value={order.status}
                      onChange={(value) => handleStatusChange(order._id, value)}
                      style={{ width: "150px" }}
                    >
                      <Option value="Pending">Pending</Option>
                      <Option value="In Process">In Process</Option>
                      <Option value="Order Received">Order Received</Option>
                      <Option value="Delivered">Delivered</Option>
                    </Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

// Styles
const containerStyle = {
  padding: "20px",
  width: "calc(100% - 260px)",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
  marginLeft: "260px",
};

const headerStyle = {
  fontSize: "24px",
  textAlign: "left",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const tableHeaderStyle = {
  backgroundColor: "#800000",
  color: "#ffffff",
  padding: "10px",
};

const tableDataStyle = {
  border: "1px solid #dddddd",
  padding: "8px",
  textAlign: "left",
};

const actionButtonStyle = {
  width: "80px",
  display: "inline-block",
  textAlign: "center",
  padding: "6px 0",
  borderRadius: "4px",
  color: "#ffffff",
  cursor: "pointer",
};

const linkStyle = {
  backgroundColor: "#800000",
  color: "#ffffff",
  textDecoration: "none",
  display: "inline-block",
  width: "80px",
  textAlign: "center",
  padding: "6px 0",
  borderRadius: "4px",
};

const buttonContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export default SupplierProfile;
