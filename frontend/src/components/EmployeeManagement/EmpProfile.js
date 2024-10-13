import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/EmployeeSideBar copy";

export default function UpdateEmpProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    nic: "",
    designation: "",
    empid: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const storedEmployee = JSON.parse(sessionStorage.getItem('employee'));

    if (storedEmployee) {
      setEmployee(storedEmployee);
    } else {
      axios
        .get(`http://localhost:5000/employee/get/${id}`)
        .then((res) => {
          setEmployee(res.data.employee);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation checks
    if (!/^[a-zA-Z\s]+$/.test(employee.name)) {
      setAlertMessage("Name cannot contain numbers or special characters.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
      setAlertMessage("Invalid email format.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!/^\d{10}$/.test(employee.mobile)) {
      setAlertMessage("Mobile number must be exactly 10 digits.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!/^\d{12}$/.test(employee.nic)) {
      setAlertMessage("NIC must be exactly 12 digits.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    // If all validations pass, proceed with the API call
    axios
      .put(`http://localhost:5000/employee/update/${id}`, employee)
      .then(() => {
        // Save updated employee data to sessionStorage
        sessionStorage.setItem('employee', JSON.stringify(employee));
        setAlertMessage("Employee updated successfully!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((err) => {
        setAlertMessage("Error updating employee.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        console.error(err);
      });
  };

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
    <>
      <SideBar/>
    <div style={{ padding: "50px", width: "calc(100% - 250px)", boxSizing: "border-box", marginLeft: "250px" }}>
      <h1>Employee Update</h1>
      <div style={formStyle}>
        <form onSubmit={handleSubmit}>
          <div style={containerStyle}>
            <div className="form-group">
              <label htmlFor="name" style={labelStyle}>Name</label>
              <input type="text" id="name" name="name" value={employee.name} onChange={handleChange} style={inputStyle} required />
            </div>
            <div className="form-group">
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input type="email" id="email" name="email" value={employee.email} onChange={handleChange} style={inputStyle} required />
            </div>
            <div className="form-group">
              <label htmlFor="mobile" style={labelStyle}>Mobile No</label>
              <input type="text" id="mobile" name="mobile" value={employee.mobile} onChange={handleChange} style={inputStyle} required />
            </div>
            <div className="form-group">
              <label htmlFor="nic" style={labelStyle}>NIC</label>
              <input type="text" id="nic" name="nic" value={employee.nic} onChange={handleChange} style={inputStyle} required />
            </div>
            <div className="form-group">
              <label htmlFor="designation" style={labelStyle}>Designation</label>
              <input type="text" id="designation" name="designation" value={employee.designation} onChange={handleChange} style={inputStyle} required />
            </div>
            <div className="form-group">
              <label htmlFor="empid" style={labelStyle}>Employee ID</label>
              <input type="text" id="empid" name="empid" value={employee.empid} onChange={handleChange} style={inputStyle} required />
            </div>
          </div>
          <button type="submit" style={buttonStyle}>Update</button>
        </form>
      </div>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            style={alertStyle}
            initial={{ transform: "translateX(100%)" }}
            animate={{ transform: "translateX(0)" }}
            exit={{ transform: "translateX(100%)" }}
          >
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </>
  );
}
