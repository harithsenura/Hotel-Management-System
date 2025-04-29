import React, { useState, useEffect } from "react";
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
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isFetchingRooms, setIsFetchingRooms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available rooms whenever roomType changes
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (customerData.roomType) {
        setIsFetchingRooms(true);
        try {
          const response = await axios.get("http://localhost:5000/room/available", {
            params: { roomType: customerData.roomType }
          });
          setAvailableRooms(response.data);
          // Reset roomNumber if it's no longer valid
          if (!response.data.includes(customerData.roomNumber)) {
            setCustomerData(prevData => ({ ...prevData, roomNumber: "" }));
          }
        } catch (error) {
          console.error("Error fetching available rooms:", error);
          setAvailableRooms([]);
          setCustomerData(prevData => ({ ...prevData, roomNumber: "" }));
          showAlertMessage('Error fetching available rooms', 'error');
        } finally {
          setIsFetchingRooms(false);
        }
      } else {
        setAvailableRooms([]);
        setCustomerData(prevData => ({ ...prevData, roomNumber: "" }));
      }
    };

    fetchAvailableRooms();
  }, [customerData.roomType]);

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setCustomerData({
      ...customerData,
      [name]: value
    });
  };

  const validate = () => {
    let tempErrors = {};
    const currentDate = new Date().toISOString().split('T')[0];

    // Name validation
    if (!customerData.name.trim()) {
      tempErrors.name = "Name is required";
    } else if (/\d/.test(customerData.name)) {
      tempErrors.name = "Name must not contain numbers";
    } else if (customerData.name.trim().length < 3) {
      tempErrors.name = "Name must be at least 3 characters";
    }

    // Contact number validation
    if (!customerData.contactNumber.trim()) {
      tempErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(customerData.contactNumber)) {
      tempErrors.contactNumber = "Contact number must be 10 digits";
    }

    // Email validation
    if (!customerData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(customerData.email)) {
      tempErrors.email = "Invalid email format";
    }

    // Gender validation
    if (!customerData.gender) {
      tempErrors.gender = "Gender is required";
    }

    // Nationality validation
    if (!customerData.nationality.trim()) {
      tempErrors.nationality = "Nationality is required";
    } else if (/\d/.test(customerData.nationality)) {
      tempErrors.nationality = "Nationality must not contain numbers";
    }

    // Address validation
    if (!customerData.address.trim()) {
      tempErrors.address = "Address is required";
    } else if (customerData.address.trim().length < 5) {
      tempErrors.address = "Address must be at least 5 characters";
    }

    // NIC/Passport validation
    if (!customerData.nicPassport.trim()) {
      tempErrors.nicPassport = "NIC/Passport is required";
    }

    // Check-in date validation
    if (!customerData.checkInDate) {
      tempErrors.checkInDate = "Check-In date is required";
    } else if (customerData.checkInDate < currentDate) {
      tempErrors.checkInDate = "Check-In date cannot be in the past";
    }

    // Room type validation
    if (!customerData.roomType) {
      tempErrors.roomType = "Room type is required";
    }

    // Room number validation
    if (!customerData.roomNumber) {
      tempErrors.roomNumber = "Room number is required";
    }

    // Price validation
    if (!customerData.price) {
      tempErrors.price = "Price is required";
    } else if (isNaN(customerData.price) || parseFloat(customerData.price) <= 0) {
      tempErrors.price = "Price must be a positive number";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (validate()) {
      setIsSubmitting(true);
      try {
        // First update the room status to "Booked"
        await axios.patch(`http://localhost:5000/room/updateStatus/${customerData.roomNumber}`, {
          status: "Booked"
        });

        // Then add the customer
        await axios.post("http://localhost:5000/customer/add", customerData);

        showAlertMessage('Customer Added Successfully');
        
        // Reset form
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
        setAvailableRooms([]);
      } catch (error) {
        console.error("Error adding customer:", error);
        const errorMessage = error.response?.data?.message || 'Error Adding Customer';
        showAlertMessage(errorMessage, 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <SideBar />
      <div style={formContainerStyle}>
        <h2 style={headingStyle}>Add Customer</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Common Input Fields */}
          {[
            { label: "Name", name: "name", type: "text", placeholder: "Enter full name" },
            { label: "Contact Number", name: "contactNumber", type: "text", placeholder: "Enter 10-digit number" },
            { label: "Email", name: "email", type: "email", placeholder: "Enter email address" },
            { label: "Nationality", name: "nationality", type: "text", placeholder: "Enter nationality" },
            { label: "Address", name: "address", type: "text", placeholder: "Enter full address" },
            { label: "NIC/Passport Number", name: "nicPassport", type: "text", placeholder: "Enter NIC/Passport" },
            { label: "Check-In Date", name: "checkInDate", type: "date" },
            { label: "Price (USD)", name: "price", type: "number", placeholder: "Enter price" }
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} style={formGroupStyle}>
              <label style={labelStyle}>{label}</label>
              <input
                type={type}
                name={name}
                value={customerData[name]}
                onChange={handleChange}
                style={errors[name] ? { ...inputStyle, borderColor: 'red' } : inputStyle}
                placeholder={placeholder}
                disabled={isSubmitting}
              />
              {errors[name] && <span style={errorStyle}>{errors[name]}</span>}
            </div>
          ))}

          {/* Gender Selection */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Gender</label>
            <select
              name="gender"
              value={customerData.gender}
              onChange={handleChange}
              style={errors.gender ? { ...inputStyle, borderColor: 'red' } : inputStyle}
              disabled={isSubmitting}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span style={errorStyle}>{errors.gender}</span>}
          </div>

          {/* Room Type Selection */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Room Type</label>
            <select
              name="roomType"
              value={customerData.roomType}
              onChange={handleChange}
              style={errors.roomType ? { ...inputStyle, borderColor: 'red' } : inputStyle}
              disabled={isSubmitting}
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

          {/* Room Number Selection */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Room Number</label>
            <select
              name="roomNumber"
              value={customerData.roomNumber}
              onChange={handleChange}
              style={errors.roomNumber ? { ...inputStyle, borderColor: 'red' } : inputStyle}
              disabled={!customerData.roomType || isFetchingRooms || isSubmitting}
            >
              <option value="">
                {isFetchingRooms
                  ? "Fetching available rooms..."
                  : "Select Room Number"}
              </option>
              {availableRooms.length > 0 ? (
                availableRooms.map((roomNumber) => (
                  <option key={roomNumber} value={roomNumber}>
                    {roomNumber}
                  </option>
                ))
              ) : (
                customerData.roomType && !isFetchingRooms && (
                  <option value="" disabled>
                    No rooms available
                  </option>
                )
              )}
            </select>
            {errors.roomNumber && <span style={errorStyle}>{errors.roomNumber}</span>}
          </div>

          <button 
            type="submit" 
            style={isSubmitting ? { ...buttonStyle, opacity: 0.7 } : buttonStyle}
            disabled={isSubmitting || !customerData.roomNumber}
          >
            {isSubmitting ? 'Adding...' : 'Add Customer'}
          </button>
        </form>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              style={{
                ...alertStyle,
                backgroundColor: alertType === 'success' ? '#d4edda' : '#f8d7da',
                color: alertType === 'success' ? '#155724' : '#721c24'
              }}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: '0%' }}
              exit={{ opacity: 0, x: '100%' }}
            >
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
  padding: '20px',
  marginTop: "20px",
  marginLeft: "480px",
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headingStyle = {
  color: '#800000',
  marginBottom: '20px',
  textAlign: 'center'
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
  minWidth: '250px'
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#333'
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
  transition: 'border 0.3s',
};

const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#800000',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
  alignSelf: 'flex-start',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'opacity 0.3s',
};

const alertStyle = {
  padding: '15px',
  borderRadius: '5px',
  marginTop: '20px',
  textAlign: 'center',
  position: 'fixed',
  top: '20px',
  right: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  width: '300px',
  border: '1px solid transparent'
};

const errorStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '5px',
  height: '12px'
};

export default AddCustomer;