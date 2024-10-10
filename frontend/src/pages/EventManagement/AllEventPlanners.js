import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
      .get("http://localhost:5000/planner/")
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
      planner.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlanners(filtered);
  }, [searchTerm, planners]); // This useEffect will run when searchTerm or planners change

  const handleDeleteClick = (planner) => {
    setConfirmDialogData(planner);
    setShowConfirmDialog(true);
  };

  const handleDelete = () => {
    if (confirmDialogData) {
      axios
        .delete(`http://localhost:5000/planner/${confirmDialogData._id}`)
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
    doc.setFontSize(12);
    doc.text("Event Planners Report", 14, 10);

    const tableColumn = ["Name", "Assigned Event", "Salary For Event", "Email", "Contact Number"];
    const tableRows = filteredPlanners.map((planner) => [
      planner.Name,
      planner.AssignedEvent,
      planner.SalaryForTheEvent,
      planner.Email,
      planner.ContactNumber,
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("event_planners_report.pdf");
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>All Event Planners</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by name"
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
              <th style={tableHeaderStyle}>Update</th>
              <th style={tableHeaderStyle}>Delete</th>
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
                      to={`/planner/${planner._id}`}
                      style={{ color: "#800000", textDecoration: "none" }}
                    >
                      View Profile
                    </Link>
                  </td>
                  <td style={tableCellStyle}>
                    <button
                      onClick={() => handleDeleteClick(planner)}
                      style={buttonStyle}
                    >
                      Delete
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
  );
}

// Styles for the search bar
const searchInputStyle = {
  padding: "10px",
  fontSize: "14px",
  width: "400px",
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
  margin: "20px 0", // Add margin for spacing
};

// Styles for table container to center the table
const tableContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "20px 0", // Add margin for spacing
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
  width: "80%", // Adjust table width as needed
  borderCollapse: "collapse",
  fontSize: "14px",
};

const tableHeaderStyle = {
  backgroundColor: "#800000",
  color: "#fff",
  padding: "8px",
  textAlign: "left",
  borderBottom: "2px solid #fff",
};

const tableRowEvenStyle = {
  backgroundColor: "#f2f2f2",
};

const tableRowOddStyle = {
  backgroundColor: "#ffffff",
};

const tableCellStyle = {
  padding: "8px",
  borderBottom: "1px solid #ddd",
  borderRight: "1px solid #fff",
  fontSize: "14px",
};

const buttonStyle = {
  backgroundColor: "#b30000",
  color: "#ffffff",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
};

const alertStyle = {
  backgroundColor: "#ffffff",
  color: "#800000",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  position: "fixed",
  top: "80px",
  right: "20px",
  zIndex: 1000,
  width: "300px",
};

const confirmDialogOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const confirmDialogStyle = {
  backgroundColor: "#ffffff",
  color: "#800000",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
  width: "300px",
};

const confirmDialogTitleStyle = {
  margin: 0,
  fontSize: "18px",
};

const confirmDialogButtonContainerStyle = {
  marginTop: "20px",
};

const confirmDialogButtonStyle = {
  backgroundColor: "#800000",
  color: "#ffffff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  margin: "0 10px",
};
