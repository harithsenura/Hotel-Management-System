import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import SideBar from "../SideBar/CustomerSideBar";

export default function CheckOutProfile() {
  const [customer, setCustomer] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/customer/get/${id}`)
      .then((res) => setCustomer(res.data.customer))
      .catch((err) => alert(err.message));
  }, [id]);

  const handlePrint = () => {
    const printContents = document.getElementById("printable-container").innerHTML;
    const originalContents = document.body.innerHTML;

    // Add print styles for visibility control
    const printStyle = `
      @media print {
        body * {
          visibility: hidden;
        }
        #printable-container, #printable-container * {
          visibility: visible;
        }
        #printable-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;

    // Inject print styles into the document
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyle;
    document.head.appendChild(styleSheet);

    // Replace body content with the printable section
    document.body.innerHTML = printContents;
    window.print();

    // Revert the body content after printing
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload the page to restore the content and styles
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    doc.setFontSize(18);
    doc.text("Customer Check-Out Profile", 14, yPosition);

    yPosition += 10;

    details.forEach(detail => {
      doc.setFontSize(12);
      doc.text(`${detail.label}: ${detail.value || 'N/A'}`, 14, yPosition);
      yPosition += 10;
    });

    doc.save("customer-checkout-profile.pdf");
  };

  const handleCheckOut = () => {
    setShowConfirmDialog(true);
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/customer/delete/${id}`)
      .then(() => {
        setAlertMessage("Customer successfully checked out");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/check-out");
        }, 3000); // Hide alert after 3 seconds
      })
      .catch((err) => {
        setAlertMessage("Error checking out customer: " + err.message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
      });
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  const details = [
    { label: "Name", value: customer?.name },
    { label: "Contact Number", value: customer?.contactNumber },
    { label: "Email", value: customer?.email },
    { label: "Gender", value: customer?.gender },
    { label: "Nationality", value: customer?.nationality },
    { label: "Address", value: customer?.address },
    { label: "NIC/Passport Number", value: customer?.nicPassport },
    { label: "Check-In Date", value: customer?.checkInDate },
    { label: "Room Type", value: customer?.roomType },
    { label: "Room Number", value: customer?.roomNumber },
    { label: "Price", value: `$${customer?.price}` },
    { label: "Checked-Out", value: customer?.checkedOut ? "Yes" : "No" }
  ];

  return (
    <><SideBar/>
    <div
      style={{ padding: "50px", width: "calc(100% - 250px)", boxSizing: "border-box", marginLeft: "250px" }}
    >
      <h1 style={{ textAlign: "left" }}>Customer Check-Out Profile</h1>
      {customer ? (
        <div id="printable-container" style={containerStyle}>
          <div style={profileContainerStyle}>
            {details.map((detail) => (
              <div style={detailContainerStyle} key={detail.label}>
                <div style={labelStyle}>{detail.label}:</div>
                <div style={valueStyle}>{detail.value}</div>
              </div>
            ))}
          </div>
          <div style={buttonContainerStyle}>
            <button onClick={handleExportPDF} style={buttonStyle}>
              Print
            </button>
            <button onClick={handleCheckOut} style={buttonStyle}>
              Check-Out
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && (
        <div style={confirmDialogOverlayStyle}>
          <div style={confirmDialogStyle}>
            <h2 style={confirmDialogTitleStyle}>Confirm Deletion</h2>
            <p>Are you sure you want to delete this customer?</p>
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

      {/* Alert Box with Animation */}
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
      </div>
      </>
  );
}

// Styling for the profile details and buttons
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  maxWidth: "800px"
};

const profileContainerStyle = {
  width: "100%",
  padding: "20px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
};

const detailContainerStyle = {
  display: "flex",
  marginBottom: "10px",
  fontSize: "16px"
};

const labelStyle = {
  flex: "1 1 200px",
  fontWeight: "bold"
};

const valueStyle = {
  flex: "2 1 300px",
  textAlign: "left"
};

const buttonContainerStyle = {
  marginTop: "20px",
  display: "flex",
  gap: "10px"
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#800000",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

// Custom Confirmation Dialog Styles
const confirmDialogOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const confirmDialogStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  width: "400px",
  textAlign: "center"
};

const confirmDialogTitleStyle = {
  marginBottom: "10px",
  fontSize: "18px"
};

const confirmDialogButtonContainerStyle = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "space-around"
};

const confirmDialogButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#800000",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  margin: "0 5px"
};

// Alert box styles
const alertStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  padding: "10px 20px",
  backgroundColor: "#800000",
  color: "#fff",
  borderRadius: "5px",
  zIndex: 999
};
