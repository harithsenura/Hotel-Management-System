"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import logo from "../../images/company.png"
import SideBar from "../SideBar/CustomerSideBar"

export default function RoomList() {
  const [rooms, setRooms] = useState([])
  const [searchQuery, setSearchQuery] = useState("") // State for search query
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)
  const [availability, setAvailability] = useState({ checkIn: "", checkOut: "", adults: 1, children: 0 })
  // Add state to track image loading errors
  const [imageErrors, setImageErrors] = useState({})
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [editFormData, setEditFormData] = useState({
    roomType: "",
    price: "",
    roomNumber: "",
    facilities: "",
    bedType: "",
    status: "",
  })

  useEffect(() => {
    fetchRooms()
  }, [availability])

  const fetchRooms = () => {
    axios
      .get("http://welcoming-wisdom-production.up.railway.app/room/", { params: availability })
      .then((res) => {
        console.log("Rooms data:", res.data) // Log the rooms data to inspect image paths
        setRooms(res.data)
        setAlertMessage("Rooms Fetched Successfully")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err.message)
        setAlertMessage("Error Fetching Rooms")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      })
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return { color: "green" }
      case "Reserved":
        return { color: "blue" }
      case "Booked":
        return { color: "red" }
      default:
        return {}
    }
  }

  const handleDelete = (id) => {
    setRoomToDelete(id)
    setShowConfirmDialog(true)
  }

  const confirmDelete = () => {
    axios
      .delete(`http://welcoming-wisdom-production.up.railway.app/room/delete/${roomToDelete}`)
      .then((res) => {
        setRooms(rooms.filter((room) => room._id !== roomToDelete))
        setAlertMessage("Room Deleted Successfully")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      })
      .catch((err) => {
        console.error("Error deleting room:", err.message)
        setAlertMessage("Error Deleting Room")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      })
      .finally(() => {
        setShowConfirmDialog(false)
        setRoomToDelete(null)
      })
  }

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target
    setAvailability((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleGuestChange = (e) => {
    const { name, value } = e.target
    setAvailability((prevState) => ({ ...prevState, [name]: Number.parseInt(value, 10) }))
  }

  // Updated function to handle image URLs with better logging
  const getRoomImageUrl = (room) => {
    if (room.image) {
      console.log(`Room ${room._id} image path:`, room.image)
      // Make sure we're using the full URL with the correct server address
      return `http://localhost:5001${room.image}`
    }
    // Return a fallback image if no image is available
    return "/comfortable-hotel-room.png"
  }

  // Handle image error
  const handleImageError = (roomId) => {
    console.log(`Image failed to load for room ${roomId}`)
    setImageErrors((prev) => ({
      ...prev,
      [roomId]: true,
    }))
  }

  const handleEdit = (room) => {
    setCurrentRoom(room)
    setEditFormData({
      roomType: room.roomType,
      price: room.price,
      roomNumber: room.roomNumber,
      facilities: room.facilities,
      bedType: room.bedType,
      status: room.status,
    })
    setShowEditModal(true)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) : value,
    }))
  }

  const saveRoomChanges = () => {
    axios
      .put(`http://welcoming-wisdom-production.up.railway.app/room/update/${currentRoom._id}`, editFormData)
      .then((res) => {
        // Update the rooms list with the edited room
        setRooms(rooms.map((room) => (room._id === currentRoom._id ? { ...room, ...editFormData } : room)))
        setAlertMessage("Room Updated Successfully")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
        setShowEditModal(false)
      })
      .catch((err) => {
        console.error("Error updating room:", err.message)
        setAlertMessage("Error Updating Room")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      })
  }

  // Filter rooms based on search query
  const filteredRooms = rooms.filter((room) => {
    return (
      room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomNumber.toString().includes(searchQuery) ||
      room.price.toString().includes(searchQuery) ||
      room.facilities.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.bedType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })
  // Export rooms data as PDF
  const exportPDF = () => {
    const doc = new jsPDF()

    // Add the company logo
    doc.addImage(logo, "PNG", 10, 10, 25, 13)

    // Add company details below the logo
    doc.setFontSize(8)
    doc.setTextColor(0)
    doc.text("Cinnomon Red Colombo", 10, 30)
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35)
    doc.text("Contact: (123) 456-7890", 10, 40)
    doc.text("Email: info@cinnomred.com", 10, 45)

    // Add centered heading
    doc.setFontSize(18)
    doc.setTextColor(0)
    const headingY = 60
    doc.text("Room List Report", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" })

    // Draw underline for heading
    const headingWidth = doc.getTextWidth("Room List Report")
    const underlineY = headingY + 1
    doc.setDrawColor(0)
    doc.line(
      doc.internal.pageSize.getWidth() / 2 - headingWidth / 2,
      underlineY,
      doc.internal.pageSize.getWidth() / 2 + headingWidth / 2,
      underlineY,
    )

    // Add line break
    doc.setFontSize(12)
    doc.text("Report", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" })

    // Define table columns and rows
    const headers = ["Room Type", "Price", "Room Number", "Facilities", "Bed Type", "Status"]

    const data = rooms.map((room) => [
      room.roomType,
      `$${room.price}`,
      room.roomNumber,
      room.facilities,
      room.bedType,
      room.status,
    ])

    // Add the table
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 80,
      styles: {
        fontSize: 8,
      },
    })

    // Add a professional ending
    const endingY = doc.internal.pageSize.getHeight() - 30
    doc.setFontSize(10)
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" })
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" })

    // Draw page border
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10)

    // Save the PDF
    doc.save("room_list_report.pdf")
  }

  return (
    <>
      <SideBar />
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
              <th style={thStyle}>Image</th>
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
                  {/* Update the image rendering in the table to include better error handling */}
                  <td style={tdStyle}>
                    {imageErrors[room._id] ? (
                      <img
                        src="/comfortable-hotel-room.png"
                        alt={`${room.roomType} Room (Fallback)`}
                        style={roomImageStyle}
                      />
                    ) : (
                      <img
                        src={getRoomImageUrl(room) || "/placeholder.svg"}
                        alt={`${room.roomType} Room`}
                        style={roomImageStyle}
                        onError={() => handleImageError(room._id)}
                      />
                    )}
                  </td>
                  <td style={tdStyle}>{room.roomType}</td>
                  <td style={tdStyle}>${room.price}</td>
                  <td style={tdStyle}>{room.roomNumber}</td>
                  <td style={tdStyle}>{room.facilities}</td>
                  <td style={tdStyle}>{room.bedType}</td>
                  <td style={{ ...tdStyle, ...getStatusStyle(room.status) }}>{room.status}</td>
                  <td style={tdStyle}>
                    <button
                      style={{ ...confirmDialogButtonStyle, marginRight: "5px" }}
                      onClick={() => handleEdit(room)}
                    >
                      Edit
                    </button>
                    <button style={confirmDialogButtonStyle} onClick={() => handleDelete(room._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px", fontSize: "18px", color: "red" }}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showAlert && <div style={alertStyle}>{alertMessage}</div>}

        {showConfirmDialog && (
          <div style={confirmDialogOverlayStyle}>
            <div style={confirmDialogStyle}>
              <h2 style={confirmDialogTitleStyle}>Confirm Delete</h2>
              <p>Are you sure you want to delete this room?</p>
              <div style={confirmDialogButtonContainerStyle}>
                <button style={confirmDialogButtonStyle} onClick={confirmDelete}>
                  Yes
                </button>
                <button style={confirmDialogButtonStyle} onClick={() => setShowConfirmDialog(false)}>
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <div style={confirmDialogOverlayStyle}>
            <div style={{ ...confirmDialogStyle, width: "500px" }}>
              <h2 style={confirmDialogTitleStyle}>Edit Room</h2>
              <div style={formStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Room Type:</label>
                  <input
                    type="text"
                    name="roomType"
                    value={editFormData.roomType}
                    onChange={handleEditFormChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditFormChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Room Number:</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={editFormData.roomNumber}
                    onChange={handleEditFormChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Facilities:</label>
                  <textarea
                    name="facilities"
                    value={editFormData.facilities}
                    onChange={handleEditFormChange}
                    style={{ ...inputStyle, height: "80px" }}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Bed Type:</label>
                  <input
                    type="text"
                    name="bedType"
                    value={editFormData.bedType}
                    onChange={handleEditFormChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Status:</label>
                  <select name="status" value={editFormData.status} onChange={handleEditFormChange} style={inputStyle}>
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>
              </div>
              <div style={confirmDialogButtonContainerStyle}>
                <button style={confirmDialogButtonStyle} onClick={saveRoomChanges}>
                  Save Changes
                </button>
                <button style={confirmDialogButtonStyle} onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Styles
const containerStyle = {
  padding: "50px",
  width: "calc(100% - 250px)",
  boxSizing: "border-box",
  marginLeft: "250px",
}

const searchInputStyle = {
  padding: "8px",
  marginBottom: "20px",
  width: "300px",
  border: "1px solid #ccc",
  borderRadius: "4px",
}

const titleStyle = {
  textAlign: "left",
  marginBottom: "20px",
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}

const thStyle = {
  padding: "10px",
  backgroundColor: "#800000",
  color: "#fff",
  textAlign: "left",
}

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
}

// Add style for room images
const roomImageStyle = {
  width: "100px",
  height: "70px",
  objectFit: "cover",
  borderRadius: "4px",
  border: "1px solid #ddd",
}

const alertStyle = {
  backgroundColor: "#ffffff",
  color: "#800000",
  padding: "10px",
  borderRadius: "5px",
  marginTop: "20px",
  textAlign: "center",
  position: "fixed",
  top: "20px",
  right: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  zIndex: 1000,
  width: "300px",
}

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
  zIndex: 1000,
}

const confirmDialogStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  width: "400px",
  textAlign: "center",
}

const confirmDialogTitleStyle = {
  marginBottom: "10px",
  fontSize: "18px",
}

const confirmDialogButtonContainerStyle = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "20px",
}

const confirmDialogButtonStyle = {
  marginLeft: "10px",
  padding: "8px 15px",
  backgroundColor: "#800000",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "15px",
}

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
}

const labelStyle = {
  textAlign: "left",
  fontWeight: "bold",
}

const inputStyle = {
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "100%",
}
