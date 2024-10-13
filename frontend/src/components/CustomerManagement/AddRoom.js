import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import SideBar from "../SideBar/CustomerSideBar";

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    roomType: "",
    price: "",
    roomNumber: "",
    facilities: "",
    bedType: "",
    status: ""
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({
      ...roomData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Price validation
    if (isNaN(roomData.price) || roomData.price <= 0) {
      setAlertMessage('Price must be a positive number');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    // Facilities validation
    if (!isNaN(roomData.facilities)) {
      setAlertMessage('Facilities cannot be a number');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    axios.post("http://localhost:5000/room/add", roomData)
      .then((res) => {
        setAlertMessage('Room Added Successfully');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setRoomData({
          roomType: "",
          price: "",
          roomNumber: "",
          facilities: "",
          bedType: "",
          status: ""
        });
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage('Error Adding Room');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  return (
    <><SideBar/>
    <div style={formContainerStyle}>
      <h2>Add Room</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Room Type</label>
          <select
            name="roomType"
            value={roomData.roomType}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Room Type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="VIP">VIP</option>
            <option value="King">King</option>
            <option value="Flex">Flex</option>
          </select>
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Price</label>
          <input
            type="number" // Use number type
            name="price"
            value={roomData.price}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Room Number</label>
          <input
            type="number"
            name="roomNumber"
            value={roomData.roomNumber}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Facilities (comma-separated)</label>
          <input
            type="text"
            name="facilities"
            value={roomData.facilities}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Bed Type</label>
          <select
            name="bedType"
            value={roomData.bedType}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Bed Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
          </select>
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Status</label>
          <select
            name="status"
            value={roomData.status}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Status</option>
            <option value="Available" style={{ color: 'green' }}>Available</option>
            <option value="Reserved" style={{ color: 'blue' }}>Reserved</option>
            <option value="Booked" style={{ color: 'red' }}>Booked</option>
          </select>
        </div>
        <button type="submit" style={buttonStyle}>Add Room</button>
      </form>

      <AnimatePresence>
        {showAlert && (
          <motion.div style={alertStyle} initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: '0%' }} exit={{ opacity: 0, x: '100%' }}>
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </>
  );
};

// Styles (same as before)
const formContainerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const formStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
};

const formGroupStyle = {
  flex: '1 1 45%',
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#800000',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
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

export default AddRoom;
