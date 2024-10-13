import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../images/company.png';
import SideBar from "../SideBar/CustomerSideBar";

export default function CheckOutPage() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    function getCustomers() {
      axios.get("http://localhost:5000/customer")
        .then((res) => setCustomers(res.data))
        .catch((err) => alert(err.message));
    }

    getCustomers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.nicPassport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.roomNumber.toString().includes(searchQuery) || 
      customer.price.toString().includes(searchQuery) ||
      customer.gender.toString().includes(searchQuery) ||
      customer.nationality.toString().includes(searchQuery) ||
      customer.address.toString().includes(searchQuery) 
    );
  });

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.addImage(logo, "PNG", 10, 10, 25, 13);
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("Cinnomon Red Colombo", 10, 30);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35);
    doc.text("Contact: (123) 456-7890", 10, 40);
    doc.text("Email: info@cinnomred.com", 10, 45);
    
    doc.setFontSize(18);
    doc.setTextColor(0);
    const headingY = 60;
    doc.text("Customer Checkout Report", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });

    const headingWidth = doc.getTextWidth("Customer Checkout Report");
    const underlineY = headingY + 1;
    doc.setDrawColor(0);
    doc.line((doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2), underlineY,
      (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2), underlineY);

    const headers = ["Name", "Email", "Contact Number", "Room Type", "Room Number", "Price", "Gender", "Nationality"];
    const data = customers.map(customer => [
      customer.name,
      customer.email,
      customer.contactNumber,
      customer.roomType,
      customer.roomNumber,
      `$${customer.price}`,
      customer.gender,
      customer.nationality
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 80,
      styles: {
        fontSize: 8,
      },
    });

    const endingY = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(10);
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" });
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.save("customer_checkout_report.pdf");
  };

  return (
    <>
      <SideBar/>
    <div style={containerStyle}>
      <h1 style={headerStyle}>Check-Out</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={searchInputStyle}
      />
      <button onClick={exportPDF} style={buttonStyle}>
        Export as PDF
      </button>
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
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <tr key={customer._id} style={tableRowStyle}>
                <td style={tableCellStyle}>{customer.name}</td>
                <td style={tableCellStyle}>{customer.contactNumber}</td>
                <td style={tableCellStyle}>{customer.email}</td>
                <td style={tableCellStyle}>{customer.gender}</td>
                <td style={tableCellStyle}>{customer.nationality}</td>
                <td style={tableCellStyle}>{customer.address}</td>
                <td style={tableCellStyle}>{customer.nicPassport}</td>
                <td style={tableCellStyle}>{customer.checkInDate}</td>
                <td style={tableCellStyle}>{customer.roomType}</td>
                <td style={tableCellStyle}>{customer.roomNumber}</td>
                <td style={tableCellStyle}>${customer.price}</td>
                <td style={tableCellStyle}>
                  <Link to={`/checkout/${customer._id}`} style={{ textDecoration: 'none' }}>
                    <button style={buttonStyle}>Check-Out</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" style={{ textAlign: "center", padding: "20px", fontSize: "18px", color: "red" }}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
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

const headerStyle = {
  textAlign: 'left',
  fontSize: '24px',
};

const searchInputStyle = {
  padding: '10px',
  marginBottom: '20px',
  width: '250px',
  height: '40px',
  fontSize: '14px',
  border: '1px solid #ddd',
  borderRadius: '5px',
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
  padding: '5px 10px',
  marginLeft:'10px',
  backgroundColor: '#800000',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};
