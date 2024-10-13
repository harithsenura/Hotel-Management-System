import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from 'jspdf';
import logo from '../../images/company.png';
import SideBar from "../SideBar/CustomerSideBar";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [availability, setAvailability] = useState({ checkIn: "", checkOut: "", adults: 1, children: 0 });

  useEffect(() => {
    fetchRooms();
  }, [availability]);

  const fetchRooms = () => {
    axios.get("http://localhost:5000/room/", { params: availability })
      .then((res) => {
        setRooms(res.data);
        setAlertMessage("Rooms Fetched Successfully");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err.message);
        setAlertMessage("Error Fetching Rooms");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return { color: 'green' };
      case "Reserved":
        return { color: 'blue' };
      case "Booked":
        return { color: 'red' };
      default:
        return {};
    }
  };

  const handleDelete = (id) => {
    setRoomToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:5000/room/delete/${roomToDelete}`)
      .then((res) => {
        setRooms(rooms.filter(room => room._id !== roomToDelete));
        setAlertMessage("Room Deleted Successfully");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((err) => {
        console.error("Error deleting room:", err.message);
        setAlertMessage("Error Deleting Room");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .finally(() => {
        setShowConfirmDialog(false);
        setRoomToDelete(null);
      });
  };

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailability(prevState => ({ ...prevState, [name]: value }));
  };

  const handleGuestChange = (e) => {
    const { name, value } = e.target;
    setAvailability(prevState => ({ ...prevState, [name]: parseInt(value, 10) }));
  };

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(room => {
    return (
      room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomNumber.toString().includes(searchQuery) ||
      room.price.toString().includes(searchQuery) ||
      room.facilities.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.bedType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
    // Export rooms data as PDF
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
      doc.text("Room List Report", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });
    
      // Draw underline for heading
      const headingWidth = doc.getTextWidth("Room List Report");
      const underlineY = headingY + 1;
      doc.setDrawColor(0);
      doc.line((doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2), underlineY,
        (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2), underlineY);
    
      // Add line break
      doc.setFontSize(12);
      doc.text("Report", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" });
    
      // Define table columns and rows
      const headers = ["Room Type", "Price", "Room Number", "Facilities", "Bed Type", "Status"];
    
      const data = rooms.map(room => [
        room.roomType,
        `$${room.price}`,
        room.roomNumber,
        room.facilities,
        room.bedType,
        room.status
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
      doc.save("room_list_report.pdf");
    };

  return (
    <><SideBar/>
    <div style={containerStyle}>
      <h1 style={titleStyle}>Room List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search rooms..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={searchInputStyle}
      />
       <button onClick={exportPDF} style={confirmDialogButtonStyle}>
        Export as PDF
      </button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Room Name</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Room Number</th>
            <th style={thStyle}>Facilities</th>
            <th style={thStyle}>Bed Type</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <tr key={room._id}>
                <td style={tdStyle}>{room.roomType}</td>
                <td style={tdStyle}>${room.price}</td>
                <td style={tdStyle}>{room.roomNumber}</td>
                <td style={tdStyle}>{room.facilities}</td>
                <td style={tdStyle}>{room.bedType}</td>
                <td style={{ ...tdStyle, ...getStatusStyle(room.status) }}>{room.status}</td>
                <td style={tdStyle}>
                  <button style={confirmDialogButtonStyle} onClick={() => handleDelete(room._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px", fontSize: "18px", color: "red" }}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showAlert && (
        <div style={alertStyle}>
          {alertMessage}
        </div>
      )}

      {showConfirmDialog && (
        <div style={confirmDialogOverlayStyle}>
          <div style={confirmDialogStyle}>
            <h2 style={confirmDialogTitleStyle}>Confirm Delete</h2>
            <p>Are you sure you want to delete this room?</p>
            <div style={confirmDialogButtonContainerStyle}>
              <button style={confirmDialogButtonStyle} onClick={confirmDelete}>Yes</button>
              <button style={confirmDialogButtonStyle} onClick={() => setShowConfirmDialog(false)}>No</button>
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
  padding: '50px',
  width: 'calc(100% - 250px)',
  boxSizing: 'border-box',
  marginLeft: '250px',
};

const searchInputStyle = {
  padding: '8px',
  marginBottom: '20px',
  width: '300px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const titleStyle = {
  textAlign: 'left',
  marginBottom: '20px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const thStyle = {
  padding: '10px',
  backgroundColor: '#800000',
  color: '#fff',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
};

const alertStyle = {
  backgroundColor: '#ffffff',
  color: '#800000',
  padding: '10px',
  borderRadius: '5px',
  marginTop: '20px',
  textAlign: 'center',
  position: 'fixed',
  top: '20px',
  right: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  width: '300px',
};

const confirmDialogOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const confirmDialogStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  width: '400px',
  textAlign: 'center',
};

const confirmDialogTitleStyle = {
  marginBottom: '10px',
  fontSize: '18px',
};

const confirmDialogButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '20px',
};

const confirmDialogButtonStyle = {
  marginLeft:'10px',
  padding: '8px 15px',
  backgroundColor: '#800000',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
