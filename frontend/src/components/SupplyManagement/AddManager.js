import React, { useState } from "react";
import axios from "axios";
import SupplyerHeader from "./SupplyerHeader";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/SupplySideBar";

const AddManager = () => {
  const [managerData, setManagerData] = useState({
    managerId: "",
    managerName: "",
    role: "",
    department: "",
    contactNo: "",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManagerData({
      ...managerData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};

    // Validate Manager ID
    if (!managerData.managerId) {
        tempErrors.managerId = "Manager ID is required";
    } else if (managerData.managerId.length < 5 || managerData.managerId.length > 10) {
        tempErrors.managerId = "Manager ID must be between 5 and 10 characters";
    }

    // Validate Manager Name
    if (!managerData.managerName) {
        tempErrors.managerName = "Manager name is required";
    } else if (managerData.managerName.length < 2 || managerData.managerName.length > 50) {
        tempErrors.managerName = "Manager name must be between 2 and 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(managerData.managerName)) {
        tempErrors.managerName = "Manager name can only contain letters and spaces";
    }

    // Validate Role
    const validRoles = ["Admin", "Supervisor", "Team Lead", "Manager"]; // Example roles
    if (!managerData.role) {
        tempErrors.role = "Role is required";
    } else if (!validRoles.includes(managerData.role)) {
        tempErrors.role = "Role must be one of: " + validRoles.join(", ");
    }

    // Validate Department
    const validDepartments = ["HR", "Engineering", "Sales", "Marketing"]; // Example departments
    if (!managerData.department) {
        tempErrors.department = "Department is required";
    } else if (!validDepartments.includes(managerData.department)) {
        tempErrors.department = "Department must be one of: " + validDepartments.join(", ");
    }

    // Validate Contact Number
    if (!managerData.contactNo) {
        tempErrors.contactNo = "Contact number is required";
    } else if (!/^\d{10}$/.test(managerData.contactNo)) { // Assuming a 10-digit contact number
        tempErrors.contactNo = "Contact number must be a 10-digit number";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
};


  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      axios.post("http://localhost:5000/api/managers/Add", managerData)
        .then((res) => {
          setAlertMessage("Manager Added Successfully");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          setManagerData({
            managerId: "",
            managerName: "",
            role: "",
            department: "",
            contactNo: "",
          });
          setErrors({});
        })
        .catch((err) => {
          console.error(err);
          setAlertMessage("Error Adding Manager");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
    }
  };
  

  return (
    <><SideBar/>
    <div style={formContainerStyle}>
      <h2>Add Manager</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {[
          { label: "Manager ID", name: "managerId", type: "text" },
          { label: "Manager Name", name: "managerName", type: "text" },
          { label: "Role", name: "role", type: "text" },
          { label: "Department", name: "department", type: "text" },
          { label: "Contact No", name: "contactNo", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name} style={formGroupStyle}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              name={name}
              value={managerData[name]}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors[name] && <span style={errorStyle}>{errors[name]}</span>}
          </div>
        ))}
        <button type="submit" style={buttonStyle}>Add Manager</button>
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
  padding: '20px',
  marginTop: '80px',
  marginLeft:'500px',
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

export default AddManager;
