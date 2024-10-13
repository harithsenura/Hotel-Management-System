import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Input, message } from "antd";
import SupplyerHeader from "./SupplyerHeader";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "../../images/company.png";
import SideBar from "../SideBar/SupplySideBar";

const SupplierProfile = () => {
  const [supplies, setSupplies] = useState([]);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supply`);
        setSupplies(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSupplies();
  }, []);

  const handleUpdate = async (values) => {
    try {
      await axios.put(
        `http://localhost:5000/api/supply/update/${editItem._id}`,
        values
      );
      message.success("Supply updated successfully!");
      setModalVisible(false);
      setEditItem(null);
      const response = await axios.get(`http://localhost:5000/api/supply`);
      setSupplies(response.data);
    } catch (error) {
      message.error("Failed to update supply.");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (supplyId) => {
    try {
      if (window.confirm("Are you sure you want to delete this supply?")) {
        await axios.delete(
          `http://localhost:5000/api/supply/delete/${supplyId}`
        );
        message.success("Supply deleted successfully!");
        const updatedSupplies = supplies.filter(
          (supply) => supply._id !== supplyId
        );
        setSupplies(updatedSupplies);
      }
    } catch (error) {
      message.error("Failed to delete supply.");
      console.error("Delete error:", error);
    }
  };

  const openEditModal = (supply) => {
    setEditItem(supply);
    setModalVisible(true);
  };

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

  if (error) return <div>Error: {error}</div>;
  if (!supplies.length) return <div>Loading...</div>;

  const filteredSupplies = supplies.filter((supply) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      supply.itemName.toLowerCase().includes(searchTermLower) ||
      supply.supplyId.toLowerCase().includes(searchTermLower) ||
      supply.unitPrice.toString().toLowerCase().includes(searchTermLower) ||
      supply.initialQuantity
        .toString()
        .toLowerCase()
        .includes(searchTermLower) ||
      supply.description.toLowerCase().includes(searchTermLower) ||
      supply.category.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <>
      <SideBar/>
    <div style={containerStyle}>
      <h1 style={headerStyle}>Supplies List</h1>

      {/* Search Input */}
      <Input
        placeholder="Search by Item Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      <Button
        type="primary"
        onClick={generatePDF}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        Generate PDF
      </Button>

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
                No Data
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
                      style={actionButtonStyle}
                    >
                      Update
                    </Button>
                    <Link
                      to="#"
                      style={{ ...linkStyle, ...actionButtonStyle }}
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

      {modalVisible && (
        <Modal
          title="Edit Supply"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            initialValues={editItem}
            onFinish={handleUpdate}
            layout="vertical"
          >
            <Form.Item
              name="itemName"
              label="Item Name"
              rules={[
                { required: true, message: "Please enter the item name!" },
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject(
                        new Error("Please enter the item name!")
                      );
                    }
                    if (/^\d+$/.test(value)) {
                      return Promise.reject(
                        new Error("Item name must not be a number!")
                      );
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
              
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="initialQuantity"
              label="Initial Quantity"
              
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter a description!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Input />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button
                onClick={() => setModalVisible(false)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
      )}
      </div>
    </>
  );
};

// Styles remain the same
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
};

const linkStyle = {
  backgroundColor: "#800000",
  color: "#ffffff",
  textDecoration: "none",
};

const buttonContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export default SupplierProfile;
