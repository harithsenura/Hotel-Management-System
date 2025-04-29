import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../images/company.png';
import SideBar from "../SideBar/CustomerSideBar";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState(null);

  useEffect(() => {
    function getCustomers() {
      axios.get("http://localhost:5000/customer")
        .then((res) => setCustomers(res.data))
        .catch((err) => alert(err.message));
    }

    getCustomers();
  }, []);

  const handleDeleteClick = (customer) => {
    setConfirmDialogData(customer);
    setShowConfirmDialog(true);
  };

  const handleDelete = () => {
    if (confirmDialogData) {
      axios.delete(`http://localhost:5000/customer/delete/${confirmDialogData._id}`)
        .then(() => {
          setAlertMessage("Customer deleted successfully!");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
          setCustomers(customers.filter(customer => customer._id !== confirmDialogData._id));
        })
        .catch((err) => {
          setAlertMessage("Error deleting customer.");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  // Filter customers based on search query for multiple fields
  const filteredCustomers = customers.filter((customer) => {
    const search = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.contactNumber.toLowerCase().includes(search) ||
      customer.nicPassport.toLowerCase().includes(search) ||
      customer.roomType.toLowerCase().includes(search) ||
      customer.roomNumber.toString().includes(search) ||
      customer.price.toString().includes(search) ||
      customer.gender.toString().includes(search) ||
      customer.nationality.toString().includes(search) ||
      customer.address.toString().includes(search)
    );
  });

  // Export customer data as PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // Add the company logo

    doc.addImage(logo, "PNG", 10, 10, 25, 13);

    // Add company details below the logo
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("Cinnomon Red Colombo", 10, 30);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35);
    doc.text("Contact: (123) 456-7890", 10, 40);
    doc.text("Email: info@cinnomred.com", 10, 45);

    // Add centered heading
    doc.setFontSize(18);
    doc.setTextColor(0);
    const headingY = 60;
    doc.text("Customer Management", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });

    // Draw underline for heading
    const headingWidth = doc.getTextWidth("Customer Management");
    const underlineY = headingY + 1;
    doc.setDrawColor(0);
    doc.line((doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2), underlineY,
      (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2), underlineY);

    // Add line break
    doc.setFontSize(12);
    doc.text("Report", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" });

    // Define table columns and rows
    const headers = [
      "Name", "Email", "Contact Number", "NIC/Passport",
      "Check-In Date", "Room Type", "Room Number", "Price"
    ];

    const data = customers.map(customer => [
      customer.name,
      customer.email,
      customer.contactNumber,
      customer.nicPassport,
      new Date(customer.checkInDate).toLocaleDateString(),
      customer.roomType,
      customer.roomNumber,
      `$${customer.price}`
    ]);

    // Add the table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 80,
      styles: {
        fontSize: 8,
      },
    });

    // Add a professional ending
    const endingY = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(10);
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" });
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" });

    // Draw page border
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Save the PDF
    doc.save("customers_report.pdf");
  };


  return (
    <><SideBar />
      <div style={containerStyle}>
        <div style={headerContainerStyle}>
          <h1 style={headerStyle}>All Customers</h1>
          <div style={searchExportContainerStyle}>
            <input
              type="text"
              placeholder="Search.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
            />
            <button onClick={exportPDF} style={buttonStyle}>
              Export as PDF
            </button>
          </div>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Contact Number</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Gender</th>
              <th style={tableHeaderStyle}>Nationality</th>
              <th style={tableHeaderStyle}>Address</th>
              <th style={tableHeaderStyle}>NIC/Passport Number</th>
              <th style={tableHeaderStyle}>Check-In Date</th>
              <th style={tableHeaderStyle}>Room Type</th>
              <th style={tableHeaderStyle}>Room Number</th>
              <th style={tableHeaderStyle}>Price</th>
              <th style={tableHeaderStyle}>View Profile</th>
              <th style={tableHeaderStyle}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer._id} style={tableRowStyle}>
                  <td style={tableCellStyle}>{customer.name}</td>
                  <td style={tableCellStyle}>{customer.contactNumber}</td>
                  <td style={tableCellStyle}>{customer.email}</td>
                  <td style={tableCellStyle}>{customer.gender}</td>
                  <td style={tableCellStyle}>{customer.nationality}</td>
                  <td style={tableCellStyle}>{customer.address}</td>
                  <td style={tableCellStyle}>{customer.nicPassport}</td>
                  <td style={tableCellStyle}>{new Date(customer.checkInDate).toLocaleDateString()}</td>
                  <td style={tableCellStyle}>{customer.roomType}</td>
                  <td style={tableCellStyle}>{customer.roomNumber}</td>
                  <td style={tableCellStyle}>${customer.price}</td>
                  <td style={tableCellStyle}>
                    <Link
                      to={`/customer/${customer._id}`}
                      style={{ color: "#800000", textDecoration: "none" }}
                    >
                      View Profile
                    </Link>
                  </td>
                  <td style={tableCellStyle}>
                    <button
                      onClick={() => handleDeleteClick(customer)}
                      style={buttonStyle}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", padding: "20px", fontSize: "24px", color: "red" }}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>

        </table>

        {/* Alert Box */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              style={alertStyle}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: '0%' }}
              exit={{ opacity: 0, x: '100%' }}
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div style={confirmDialogOverlayStyle}>
            <div style={confirmDialogStyle}>
              <h2 style={confirmDialogTitleStyle}>Confirm Deletion</h2>
              <p>Are you sure you want to delete this customer?</p>
              <div style={confirmDialogButtonContainerStyle}>
                <button
                  onClick={handleDelete}
                  style={confirmDialogButtonStyle}
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancel}
                  style={confirmDialogButtonStyle}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Styles
const containerStyle = {
  padding: '20px',
  width: 'calc(100% - 250px)',
  boxSizing: 'border-box',
  marginLeft: '250px',
};

const headerContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const headerStyle = {
  textAlign: 'left',
  fontSize: '24px',
};

const searchExportContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const searchInputStyle = {
  padding: '8px',
  fontSize: '14px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '200px',
  marginRight: '10px', // Add some space between the input and the button
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
};

const tableHeaderStyle = {
  backgroundColor: '#800000',
  color: '#fff',
  padding: '8px',
  textAlign: 'left',
  borderBottom: '2px solid #fff',
};

const tableRowStyle = {
  backgroundColor: '#f2f2f2',
};

const tableCellStyle = {
  padding: '8px',
  borderBottom: '1px solid #ddd',
  borderRight: '1px solid #fff',
  fontSize: '14px',
};

const buttonStyle = {
  backgroundColor: '#b30000',
  color: '#ffffff',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};

const alertStyle = {
  backgroundColor: '#ffffff',
  color: '#800000',
  padding: '10px',
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 1000,
  border: '1px solid #800000',
  borderRadius: '5px',
};

const confirmDialogOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const confirmDialogStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
};

const confirmDialogTitleStyle = {
  margin: '0 0 10px 0',
};

const confirmDialogButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const confirmDialogButtonStyle = {
  backgroundColor: '#b30000',
  color: '#ffffff',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
};

