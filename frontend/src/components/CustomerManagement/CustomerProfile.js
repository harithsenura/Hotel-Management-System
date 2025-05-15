import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/CustomerSideBar";

export default function UpdateCustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Customer state
  const [customer, setCustomer] = useState({
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
    price: "",
  });

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  // Validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5001/customer/get/${id}`)
      .then((res) => {
        setCustomer(res.data.customer);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [id]);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setCustomer((prevState) => ({ ...prevState, [name]: value }));
  }

  // Validate form fields
  function validateForm() {
    const newErrors = {};
  
    // Name should not be empty and must not contain numbers
    if (!customer.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/\d/.test(customer.name)) {
      newErrors.name = "Name must not contain numbers";
    }
  
    // Contact number should be exactly 10 digits
    if (!customer.contactNumber.match(/^\d{10}$/)) {
      newErrors.contactNumber = "Contact Number must be 10 digits";
    }
  
    // Email should follow the email format
    if (!customer.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      newErrors.email = "Invalid email address";
    }
  
    // Gender is required
    if (!customer.gender) {
      newErrors.gender = "Gender is required";
    }
  
    // Address should not be empty
    if (!customer.address.trim()) {
      newErrors.address = "Address is required";
    }
  
    // NIC/Passport is required
    if (!customer.nicPassport.trim()) {
      newErrors.nicPassport = "NIC/Passport is required";
    }
  
    // Check-in date is required
    if (!customer.checkInDate) {
      newErrors.checkInDate = "Check-In Date is required";
    }
  
    // Nationality should not be empty and must not contain numbers
    if (!customer.nationality.trim()) {
      newErrors.nationality = "Nationality is required";
    } else if (/\d/.test(customer.nationality)) {
      newErrors.nationality = "Nationality must not contain numbers";
    }
  
    // Room type should not be empty and must not contain numbers
    if (!customer.roomType.trim()) {
      newErrors.roomType = "Room Type is required";
    } else if (/\d/.test(customer.roomType)) {
      newErrors.roomType = "Room Type must not contain numbers";
    }
  
    // Room number is required
    if (!customer.roomNumber) {
      newErrors.roomNumber = "Room Number is required";
    }
  
    // Price should be a positive number
    if (!customer.price || customer.price <= 0) {
      newErrors.price = "Price must be a positive number";
    }
  
    return newErrors;
  }
  

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    // Validate the form
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // If no errors, submit form
      axios
        .put(`http://localhost:5001/customer/update/${id}`, customer)
        .then(() => {
          setAlertMessage("Customer updated successfully!");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          navigate(`/customer/${id}`);
        })
        .catch((err) => {
          setAlertMessage("Error updating customer.");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
    }
  }

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  };

  const formStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
  };

  const labelStyle = {
    color: "#333333",
    fontWeight: "bold",
  };

  const inputStyle = {
    backgroundColor: "#f2f2f2",
    border: "1px solid #cccccc",
    borderRadius: "5px",
    padding: "10px",
    color: "#333333",
    width: "100%",
  };

  const buttonStyle = {
    backgroundColor: "#800000",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "15px",
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
    transform: "translateX(100%)",
  };

  return (
    <><SideBar/>
    <div
      style={{
        padding: "50px",
        width: "calc(100% - 250px)",
        boxSizing: "border-box",
        marginLeft: "250px",
      }}
    >
      <h1>Update Customer Profile</h1>
      <div style={formStyle}>
        <form onSubmit={handleSubmit}>
          <div style={containerStyle}>
            <div className="form-group">
              <label htmlFor="name" style={labelStyle}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={customer.name}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber" style={labelStyle}>
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={customer.contactNumber}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.contactNumber && (
                <p style={{ color: "red" }}>{errors.contactNumber}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" style={labelStyle}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="gender" style={labelStyle}>
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={customer.gender}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p style={{ color: "red" }}>{errors.gender}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="nationality" style={labelStyle}>
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={customer.nationality}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" style={labelStyle}>
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={customer.address}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.address && (
                <p style={{ color: "red" }}>{errors.address}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="nicPassport" style={labelStyle}>
                NIC/Passport Number
              </label>
              <input
                type="text"
                id="nicPassport"
                name="nicPassport"
                value={customer.nicPassport}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.nicPassport && (
                <p style={{ color: "red" }}>{errors.nicPassport}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="checkInDate" style={labelStyle}>
                Check-In Date
              </label>
              <input
                type="date"
                id="checkInDate"
                name="checkInDate"
                value={customer.checkInDate}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.checkInDate && (
                <p style={{ color: "red" }}>{errors.checkInDate}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="roomType" style={labelStyle}>
                Room Type
              </label>
              <input
                type="text"
                id="roomType"
                name="roomType"
                value={customer.roomType}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.roomType && (
                <p style={{ color: "red" }}>{errors.roomType}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="roomNumber" style={labelStyle}>
                Room Number
              </label>
              <input
                type="number"
                id="roomNumber"
                name="roomNumber"
                value={customer.roomNumber}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.roomNumber && (
                <p style={{ color: "red" }}>{errors.roomNumber}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price" style={labelStyle}>
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={customer.price}
                onChange={handleChange}
                style={inputStyle}
              />
              {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
            </div>
          </div>

          <button type="submit" style={buttonStyle}>
            Update
          </button>
        </form>
      </div>

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
