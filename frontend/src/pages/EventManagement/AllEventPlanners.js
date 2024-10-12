import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from '../../images/company.png';
import SideBar from "../../components/SideBar/EventSidebar"; // Import the sidebar component

export default function PlannerList() {
  const [planners, setPlanners] = useState([]);
  const [filteredPlanners, setFilteredPlanners] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch event planners data
    axios
      .get("http://localhost:5000/eventplanners/") // Adjust URL as needed
      .then((res) => {
        console.log("Fetched Planners:", res.data);
        setPlanners(res.data.data);
        setFilteredPlanners(res.data.data);
      })
      .catch((err) => alert(err.message));
  }, []);

  useEffect(() => {
    // Filter the planners list based on the search term
    const filtered = planners.filter((planner) =>
      planner.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.AssignedEvent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planner.ContactNumber.includes(searchTerm)
    );
    setFilteredPlanners(filtered);
  }, [searchTerm, planners]); // This useEffect runs when searchTerm or planners change

  const handleDeleteClick = (planner) => {
    setConfirmDialogData(planner);
    setShowConfirmDialog(true);
  };

  const handleDelete = () => {
    if (confirmDialogData) {
      axios
        .delete(`http://localhost:5000/eventplanners/${confirmDialogData._id}`) // Adjust URL for deletion
        .then(() => {
          setAlertMessage("Event Planner deleted successfully!");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          setPlanners(planners.filter((planner) => planner._id !== confirmDialogData._id));
          setFilteredPlanners(filteredPlanners.filter((planner) => planner._id !== confirmDialogData._id));
        })
        .catch(() => {
          setAlertMessage("Error deleting event planner.");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  // Function to generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();
  
    doc.addImage(logo, "PNG", 10, 10, 25, 13); // Adjust the dimensions as necessary
  
    // Add company details below the logo
    doc.setFontSize(8);
    doc.setTextColor(0); // Set a lighter color for professionalism
    doc.text("Cinnomon Red Colombo", 10, 30);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35);
    doc.text("Contact: (123) 456-7890", 10, 40);
    doc.text("Email: info@cinnomred.com", 10, 45);
  
    // Add centered heading
    doc.setFontSize(18);
    doc.setTextColor(0); // Reset text color to black
    const headingY = 60; // Adjusted position for heading
    doc.text("Event Planners Report", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });
  
    // Draw underline for heading
    const headingWidth = doc.getTextWidth("Event Planners Report"); // Calculate the width of the heading
    const underlineY = headingY + 1; // Position for underline
    doc.setDrawColor(0); // Set color for the underline
    doc.line(
      (doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2),
      underlineY,
      (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2),
      underlineY
    ); // Draw line
  
    // Add a line break
    doc.setFontSize(12);
    doc.text("Report", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" });
  
    // Define table columns and rows
    const columns = [
      "Name",
      "Assigned Event",
      "Salary For Event",
      "Email",
      "Contact Number",
    ];
    const rows = filteredPlanners.map((planner) => [
      planner.Name,
      planner.AssignedEvent,
      planner.SalaryForTheEvent,
      planner.Email,
      planner.ContactNumber,
    ]);
  
    // Add the table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 80, // Start position after the logo and company details
    });
  
    // Add a professional ending
    const endingY = doc.internal.pageSize.getHeight() - 30; // Fix position for ending at the bottom
    doc.setFontSize(10);
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" });
  
    // Add contact number sample below the thank you message
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" });
  
    // Draw page border
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw a border with 5 unit padding
  
    // Save the PDF
    doc.save("event_planners_report.pdf");
  };
  

  return (
    <div style={containerStyle}>
      <SideBar />
      <div style={{ marginLeft: "280px", display: "flex", flexDirection: "column", alignItems: "center",marginTop:"50px" }}>
        <h1 style={headerStyle}>All Event Planners</h1>
  
        {/* Search Bar */}
        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by name, event or contact"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <button onClick={() => { }} style={searchButtonStyle}>
            Search
          </button>
        </div>
  
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Assigned Event</th>
                <th style={tableHeaderStyle}>Salary For Event</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Contact Number</th>
                <th style={tableHeaderStyle}></th>
                <th style={tableHeaderStyle}></th>
              </tr>
            </thead>
            <tbody>
              {filteredPlanners.length > 0 ? (
                filteredPlanners.map((planner, index) => (
                  <tr key={planner._id} style={index % 2 === 0 ? tableRowEvenStyle : tableRowOddStyle}>
                    <td style={tableCellStyle}>{planner.Name}</td>
                    <td style={tableCellStyle}>{planner.AssignedEvent}</td>
                    <td style={tableCellStyle}>{planner.SalaryForTheEvent}</td>
                    <td style={tableCellStyle}>{planner.Email}</td>
                    <td style={tableCellStyle}>{planner.ContactNumber}</td>
                    <td style={tableCellStyle}>
                      <Link
                        to={`/planner/${planner._id}`} // Update to view planner profile
                        style={{ color: "white", backgroundColor: "green", padding: "6px", borderRadius: "5px" }}
                      >
                        <FaEdit />
                      </Link>
                    </td>
                    <td style={tableCellStyle}>
                      <button
                        onClick={() => handleDeleteClick(planner)}
                        style={buttonStyle}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No Event Planners Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* Generate Report Button */}
        <button onClick={generateReport} style={generateReportButtonStyle}>
          Generate Report
        </button>
  
        <AnimatePresence>
          {showAlert && (
            <motion.div
              style={alertStyle}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "100%" }}
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>
  
        {showConfirmDialog && (
          <div style={confirmDialogOverlayStyle}>
            <div style={confirmDialogStyle}>
              <h2 style={confirmDialogTitleStyle}>Confirm Deletion</h2>
              <p>Are you sure you want to delete this event planner?</p>
              <div style={confirmDialogButtonContainerStyle}>
                <button onClick={handleDelete} style={confirmDialogButtonStyle}>
                  Confirm
                </button>
                <button onClick={handleCancel} style={confirmDialogButtonStyle}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}  

// Styles for the search bar
const searchInputStyle = {
  padding: "10px",
  fontSize: "14px",
  width: "300px",
  marginRight: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const searchButtonStyle = {
  backgroundColor: "#b30000", // Red color for search button
  color: "#ffffff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "4px",
  cursor: "pointer",
};

// Generate PDF Report Button Style
const generateReportButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#800000",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  margin: "20px 0",// Add margin for spacing
};

// Styles for table container to center the table
const tableContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "10px 0", // Add margin for spacing
};

const containerStyle = {
  padding: "20px",
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Center items horizontally
};

const headerStyle = {
  textAlign: "center", // Center header text
  fontSize: "24px",
};

const tableStyle = {
  width: "1000px", // Adjust table width as needed
  borderCollapse: "collapse",
  fontSize: "14px",

  border: "none", // No border
  borderRadius: "8px", // Rounded corners
  overflow: "hidden", // Ensures rounded corners are respected
};

const tableHeaderStyle = {
  backgroundColor: "#800000", // Dark red for header
  color: "#ffffff",
  padding: "10px",
  textAlign: "left",
};

const tableRowEvenStyle = {
  backgroundColor: "#f9f9f9", // Light grey for even rows
};

const tableRowOddStyle = {
  backgroundColor: "#ffffff", // White for odd rows
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ccc",
};

const buttonStyle = {
  backgroundColor: "#b30000", // Red for delete button
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
};

// Alert Style
const alertStyle = {
  position: "fixed",
  right: "20px",
  top: "20px",
  padding: "15px",
  backgroundColor: "rgba(255, 0, 0, 0.8)",
  color: "white",
  borderRadius: "5px",
  zIndex: 1000,
};

// Confirm Dialog Styles
const confirmDialogOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const confirmDialogStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
};

const confirmDialogTitleStyle = {
  margin: "0 0 10px",
};

const confirmDialogButtonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const confirmDialogButtonStyle = {
  backgroundColor: "#800000",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
};

