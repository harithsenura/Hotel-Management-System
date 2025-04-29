import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/AdminEmployeeSideBar";

export default function AllLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = () => {
    axios.get("http://localhost:5000/leave/all")
      .then((res) => setLeaves(res.data))
      .catch((err) => {
        console.error(err);
        alert("Error fetching leaves: " + err.message);
      });
  };

  const handleUpdateApproval = (leaveId, status) => {
    axios.put(`http://localhost:5000/leave/update-approval/${leaveId}`, { approval: status })
      .then((res) => {
        setAlertMessage(`Leave ${status.toLowerCase()} successfully!`);
        setShowAlert(true);
        // Update the leave in the local state
        setLeaves(leaves.map(leave => 
          leave._id === leaveId ? { ...leave, approval: status } : leave
        ));
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage(`Error ${status.toLowerCase()} leave.`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  const handleDeleteClick = (leave) => {
    setConfirmDialogData(leave);
    setShowConfirmDialog(true);
  };

  const handleDelete = () => {
    if (confirmDialogData) {
      axios.delete(`http://localhost:5000/leave/delete/${confirmDialogData._id}`)
        .then(() => {
          setAlertMessage("Leave request deleted successfully!");
          setShowAlert(true);
          setLeaves(leaves.filter(leave => leave._id !== confirmDialogData._id));
          setTimeout(() => setShowAlert(false), 3000);
        })
        .catch((err) => {
          console.error(err);
          setAlertMessage("Error deleting leave request.");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
      setShowConfirmDialog(false);
      setConfirmDialogData(null);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setConfirmDialogData(null);
  };

  return (
    <>
      <SideBar/>
      <div style={containerStyle}>
        <h1 style={headerStyle}>All Leaves</h1>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Emp ID</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Start Date</th>
              <th style={tableHeaderStyle}>End Date</th>
              <th style={tableHeaderStyle}>Reason</th>
              <th style={tableHeaderStyle}>Approval Status</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(leave => (
              <tr key={leave._id} style={tableRowStyle}>
                <td style={tableCellStyle}>{leave.empid}</td>
                <td style={tableCellStyle}>{leave.email}</td>
                <td style={tableCellStyle}>{new Date(leave.startdate).toLocaleDateString()}</td>
                <td style={tableCellStyle}>{new Date(leave.enddate).toLocaleDateString()}</td>
                <td style={tableCellStyle}>{leave.reason}</td>
                <td style={tableCellStyle}>
                  <span 
                    style={{
                      color: 
                        leave.approval === 'Approved' ? 'green' : 
                        leave.approval === 'Rejected' ? 'red' : 
                        'orange',
                      fontWeight: 'bold'
                    }}
                  >
                    {leave.approval}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  {leave.approval === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateApproval(leave._id, 'Approved')}
                        style={{ ...actionButtonStyle, backgroundColor: '#4CAF50' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateApproval(leave._id, 'Rejected')}
                        style={{ ...actionButtonStyle, backgroundColor: '#f44336' }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(leave.approval === 'Approved' || leave.approval === 'Rejected') && (
                    <span style={{ color: '#555' }}>No Actions</span>
                  )}
                  <button
                    onClick={() => handleDeleteClick(leave)}
                    style={{ ...actionButtonStyle, backgroundColor: '#b30000', marginLeft: '10px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
          {showConfirmDialog && (
            <motion.div
              style={confirmDialogStyle}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this leave request?</p>
              <button onClick={handleDelete} style={confirmButtonStyle}>Delete</button>
              <button onClick={handleCancel} style={cancelButtonStyle}>Cancel</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// Styles
const containerStyle = {
  padding: '20px',
  width: 'calc(100% - 250px)',
  boxSizing: 'border-box',
  marginLeft: '260px',
};

const headerStyle = {
  textAlign: 'left',
  fontSize: '24px',
  marginBottom: '20px',
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
  backgroundColor: '#f9f9f9',
  height: '50px',
};

const tableCellStyle = {
  padding: '8px',
  borderBottom: '1px solid #ddd',
  fontSize: '14px',
  verticalAlign: 'middle',
};

const actionButtonStyle = {
  color: '#ffffff',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '5px',
};

// Alert Styles
const alertStyle = {
  backgroundColor: '#ffffff',
  color: '#800000',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  position: 'fixed',
  top: '80px',
  right: '20px',
  zIndex: 1000,
  width: '300px',
  transform: 'translateX(100%)',
};

// Confirmation Dialog Styles
const confirmDialogStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  textAlign: 'center',
};

const confirmButtonStyle = {
  backgroundColor: '#b30000',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '5px',
};

const cancelButtonStyle = {
  backgroundColor: '#ccc',
  color: '#000',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '5px',
};
