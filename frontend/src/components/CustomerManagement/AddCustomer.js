import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/CustomerSideBar";

const AddCustomer = () => {
  const [customerData, setCustomerData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    gender: "",
    nationality: "",
    address: "",
    nicPassport: "",
    checkInDate: "",
    roomType: "",
    roomNumber: "",
    price: ""
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value
    });
  };

  const validate = () => {
    let tempErrors = {};
  
    if (!customerData.name) {
      tempErrors.name = "Name is required";
    } else if (/\d/.test(customerData.name)) {
      tempErrors.name = "Name must not contain numbers";
    }
  
    if (!customerData.contactNumber || !/^\d{10}$/.test(customerData.contactNumber)) {
      tempErrors.contactNumber = "Contact number must be 10 digits";
    }
  
    if (!customerData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(customerData.email)) {
      tempErrors.email = "Invalid email format";
    }
  
    if (!customerData.gender) tempErrors.gender = "Gender is required";
  
    if (!customerData.nationality) {
      tempErrors.nationality = "Nationality is required";
    } else if (/\d/.test(customerData.nationality)) {
      tempErrors.nationality = "Nationality must not contain numbers";
    }
  
    if (!customerData.address) tempErrors.address = "Address is required";
    if (!customerData.nicPassport) tempErrors.nicPassport = "NIC/Passport is required";
    if (!customerData.checkInDate) tempErrors.checkInDate = "Check-In date is required";
    if (!customerData.roomType) tempErrors.roomType = "Room type is required";
    
    if (!customerData.roomNumber || isNaN(customerData.roomNumber) || customerData.roomNumber < 0) {
      tempErrors.roomNumber = "Room number must be a positive number";
    }
  
    if (!customerData.price || isNaN(customerData.price)) {
      tempErrors.price = "Price must be a number";
    }
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      axios.post("http://localhost:5000/customer/add", customerData)
        .then((res) => {
          setAlertMessage('Customer Added Successfully');
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          setCustomerData({
            name: "",
            contactNumber: "",
            email: "",
            gender: "",
            nationality: "",
            address: "",
            nicPassport: "",
            checkInDate: "",
            roomType: "",
            roomNumber: "",
            price: ""
          });
          setErrors({});
        })
        .catch((err) => {
          console.error(err);
          setAlertMessage('Error Adding Customer');
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
    }
  };

  return (
    <><SideBar/>
    <div style={formContainerStyle}>
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Contact Number", name: "contactNumber", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Nationality", name: "nationality", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "NIC/Passport Number", name: "nicPassport", type: "text" },
          { label: "Check-In Date", name: "checkInDate", type: "date" },
          { label: "Room Number", name: "roomNumber", type: "number" },
          { label: "Price", name: "price", type: "price" }
        ].map(({ label, name, type }) => (
          <div key={name} style={formGroupStyle}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              name={name}
              value={customerData[name]}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors[name] && <span style={errorStyle}>{errors[name]}</span>}
          </div>
        ))}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Gender</label>
          <select
            name="gender"
            value={customerData.gender}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span style={errorStyle}>{errors.gender}</span>}
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Room Type</label>
          <select
            name="roomType"
            value={customerData.roomType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select Room Type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="VIP">VIP</option>
            <option value="King">King</option>
            <option value="Flex">Flex</option>
          </select>
          {errors.roomType && <span style={errorStyle}>{errors.roomType}</span>}
        </div>
        <button type="submit" style={buttonStyle}>Add Customer</button>
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

// Styles
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

const errorStyle = {
  color: 'red',
  fontSize: '12px',
};

export default AddCustomer;
