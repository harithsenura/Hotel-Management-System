import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { EyeOutlined, FilePdfOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Typography, message } from "antd";
import jsPDF from "jspdf";
import SideBar from "../SideBar/BarSideBar";

const { Title, Text } = Typography;

const BillsPage = () => {
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Function to fetch bills
  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.error("Error fetching bills data", error);
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    getAllBills();
  }, []);

  // Function to delete a bill
  const deleteBill = async (id) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.delete(`/api/bills/delete-bills/${id}`);
      message.success("Bill deleted successfully");
      getAllBills(); // Refresh the list after deletion
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.error("Error deleting bill", error);
      message.error("Failed to delete bill");
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  // Function to generate and download a PDF invoice
  const generatePDF = () => {
    if (!selectedBill) return;
  
    const doc = new jsPDF();
    const currentDate = new Date(); // Get current date and time
  
    // Format the current date and time
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
  
    // Add page border
    const margin = 10;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin); // Page border
  
    // Header section
    doc.setFontSize(18);
    doc.setTextColor(40);
  
    // Title split into three lines with the word "Red" in red color
    doc.setFont("helvetica", "bold");
    doc.text("Cinnamon", 105, 20, { align: "center" });
    doc.setTextColor("#800000");
    doc.text("Red", 105, 30, { align: "center" });
    doc.setTextColor(40);
    doc.text("Colombo", 105, 40, { align: "center" });
  
    // Add a little space between the title and the date
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 20, 55);
  
    // Bill ID
    doc.text(`Bill ID: ${selectedBill._id}`, 20, 65);
  
    // Divider line
    doc.line(20, 70, 190, 70); // Horizontal line for section separation
  
    // Customer Details Section
    doc.setFontSize(14);
    doc.text("Customer Details", 20, 80);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal"); // Normal font for customer details
    doc.text(`Customer Name: ${selectedBill.customerName}`, 20, 90);
    doc.text(`Contact Number: ${selectedBill.customerNumber}`, 20, 100);
  
    // Invoice Details Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold"); // Bold for Invoice Summary
    doc.text("Invoice Summary", 20, 115);
    doc.setFont("helvetica", "normal"); // Normal font for amounts
    doc.setFontSize(12);
    doc.text(`Sub Total: LKR ${selectedBill.subTotal}`, 20, 125);
    doc.text(`Tax: LKR ${selectedBill.tax}`, 20, 135);
    doc.text(`Total Amount: LKR ${selectedBill.totalAmount}`, 20, 145); // Total amount displayed
  
    // Cart Items Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold"); // Bold for Cart Items
    doc.text("Cart Items", 20, 160);
  
    // Table for Cart Items
    let yPosition = 170; // Initial position for the first row
  
    // Column Headers
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold"); // Bold for headers
    doc.text("Item", 20, yPosition);
    doc.text("Quantity", 100, yPosition);
    doc.text("Price (LKR)", 150, yPosition);
    yPosition += 10; // Move down for the next row
  
    // Draw a line under the headers
    doc.line(20, yPosition, 190, yPosition); // Horizontal line across the page
    yPosition += 5; // Add space below the line
  
    // Add Cart Items
    selectedBill.cartItems.forEach((item) => {
      // Calculate prices
      const totalPrice = item.price > 0 ? item.price * item.quantity : 0;
      const totalBPrice = item.Bprice > 0 ? item.Bprice * item.quantity : 0;
      const totalSPrice = item.Sprice > 0 ? item.Sprice * item.quantity : 0;
  
      // Create a formatted price string
      let priceDetails = `LKR ${totalPrice}`;
      if (totalBPrice > 0) {
        priceDetails += `,LKR ${totalBPrice}`;
      }
      if (totalSPrice > 0) {
        priceDetails += `,LKR ${totalSPrice}`;
      }
  
      // Add item details
      doc.setFont("helvetica", "normal"); // Normal font for item details
      doc.text(item.name, 20, yPosition);
      doc.text(String(item.quantity), 100, yPosition);
      doc.text(priceDetails, 150, yPosition);
  
      // Move down for the next item
      yPosition += 10; // Add space for the next item
    });
  
    // Add footer with thank you message
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic"); // Italic font for footer
    doc.text("Thank you for shopping with us!", 105, pageHeight - margin, { align: "center" });
  
    // Save the PDF
    doc.save(`invoice_${selectedBill.customerName}.pdf`);
  };
  

  // Table columns with Delete and View buttons
  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Contact Number",
      dataIndex: "customerNumber",
      key: "customerNumber",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      render: (text) => <Text>LKR {text}</Text>,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (text) => <Text>LKR {text}</Text>,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => (
        <Text strong style={{ color: "#52c41a" }}>
          LKR {text}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <Button
            icon={<EyeOutlined />}
            type="primary"
            style={{
              backgroundColor: "#800000",
              borderColor: "#800000",
              color: "#fff",
              marginRight: "10px",
            }}
            onClick={() => {
              setSelectedBill(record);
              setPopModal(true);
            }}
          >
            View
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={() => deleteBill(record._id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      
      <div>
      <SideBar />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px",marginLeft:"800px" }}>
          <Title level={3}>Invoice List</Title>
        </div>

        <Table
          columns={columns}
          dataSource={billsData}
          bordered
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "10px",marginLeft:"300px" }}
        />

        {popupModal && (
          <Modal
            title="Invoice Details"
            visible={popupModal}
            onCancel={() => setPopModal(false)}
            footer={[
              <Button
                key="cancel"
                style={{ backgroundColor: "#800000", borderColor: "#800000", color: "#fff" }}
                onClick={() => setPopModal(false)}
              >
                Close
              </Button>,
              <Button
                key="export"
                type="primary"
                icon={<FilePdfOutlined />}
                style={{ backgroundColor: "#800000", borderColor: "#800000", color: "#fff" }}
                onClick={generatePDF}
              >
                Print Invoice
              </Button>,
            ]}
          >
            {selectedBill && (
              <div style={{ lineHeight: "1.8" }}>
                <p>
                  <Text strong>ID:</Text> {selectedBill._id}
                </p>
                <p>
                  <Text strong>Customer Name:</Text> {selectedBill.customerName}
                </p>
                <p>
                  <Text strong>Contact Number:</Text> {selectedBill.customerNumber}
                </p>
                <p>
                  <Text strong>Sub Total:</Text> LKR {selectedBill.subTotal}
                </p>
                <p>
                  <Text strong>Tax:</Text> LKR {selectedBill.tax}
                </p>
                <p>
                  <Text strong>Total Amount:</Text> LKR {selectedBill.totalAmount}
                </p>

                {/* Display Cart Items */}
                <Title level={4}>Cart Items</Title>
                <Table
                  dataSource={selectedBill.cartItems}
                  columns={[
                    { title: "Item", dataIndex: "name" },
                    { title: "Quantity", dataIndex: "quantity" },
                    {
                      title: "Price (LKR)",
                      dataIndex: "price",
                      render: (text, record) => {
                        const totalPrice = record.price > 0 ? record.price * record.quantity : 0;
                        const totalBPrice = record.Bprice > 0 ? record.Bprice * record.quantity : 0;
                        const totalSPrice = record.Sprice > 0 ? record.Sprice * record.quantity : 0;

                        return (
                          <div>
                            {totalPrice > 0 && <div>LKR {totalPrice}</div>}
                            {totalBPrice > 0 && <div>Bprice: LKR {totalBPrice}</div>}
                            {totalSPrice > 0 && <div>Sprice: LKR {totalSPrice}</div>}
                          </div>
                        );
                      },
                    },

                  ]}
                  pagination={false}
                  rowKey="_id"
                />
              </div>
            )}


          </Modal>
        )}
      </div>
    </>
  );
};

export default BillsPage;
