import React, { useState } from "react";
import axios from "axios";
import SupplyerHeader from "./SupplyerHeader";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/SupplySideBar";

const AddSupplier = () => {
  const [supplyData, setSupplyData] = useState({
    supplyId: "",
    itemName: "",
    initialQuantity: "",
    unitPrice: "",
    description: "",
    category: "",
    status: "Available",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplyData({
      ...supplyData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
  
    // Validate Supply ID
    if (!supplyData.supplyId) {
      tempErrors.supplyId = "Supply ID is required";
    } else if (supplyData.supplyId.length > 20) {
      tempErrors.supplyId = "Supply ID must be less than 20 characters";
    }
  
    // Validate Item Name
    if (!supplyData.itemName) {
      tempErrors.itemName = "Item name is required";
    } else if (supplyData.itemName.length < 3 || supplyData.itemName.length > 50) {
      tempErrors.itemName = "Item name must be between 3 and 50 characters";
    } else if (/^\d+$/.test(supplyData.itemName)) {
      // Check if item name is numeric
      tempErrors.itemName = "Item name must not be purely numeric";
    }
  
    // Validate Initial Quantity
    if (!supplyData.initialQuantity) {
      tempErrors.initialQuantity = "Initial quantity is required";
    } else if (isNaN(supplyData.initialQuantity) || supplyData.initialQuantity < 0) {
      tempErrors.initialQuantity = "Initial quantity must be a positive number";
    } else if (!Number.isInteger(Number(supplyData.initialQuantity))) {
      tempErrors.initialQuantity = "Initial quantity must be an integer";
    }
  
    // Validate Unit Price
    if (!supplyData.unitPrice) {
      tempErrors.unitPrice = "Unit price is required";
    } else if (isNaN(supplyData.unitPrice) || supplyData.unitPrice < 0) {
      tempErrors.unitPrice = "Unit price must be a positive number";
    }
  
    // Validate Description
    if (supplyData.description && supplyData.description.length > 200) {
      tempErrors.description = "Description must be less than 200 characters";
    }
  
    // Validate Category
    if (!supplyData.category) {
      tempErrors.category = "Category is required";
    } else if (supplyData.category.length > 30) {
      tempErrors.category = "Category must be less than 30 characters";
    }
  
    // Set errors and return validation result
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      axios.post("http://localhost:5000/api/supply/addSupply", supplyData)
        .then((res) => {
          setAlertMessage("Supply Added Successfully");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          setSupplyData({
            supplyId: "",
            itemName: "",
            initialQuantity: "",
            unitPrice: "",
            description: "",
            category: "",
            status: "Available",
          });
          setErrors({});
        })
        .catch((err) => {
          console.error(err);
          setAlertMessage("Error Adding Supply");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
    }
  };

  return (
    <><SideBar/>
    <div style={formContainerStyle}>
      
      <h2>Add Supply</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {[
          { label: "Supply ID", name: "supplyId", type: "text" },
          { label: "Item Name", name: "itemName", type: "text" },
          { label: "Initial Quantity", name: "initialQuantity", type: "number" },
          { label: "Unit Price", name: "unitPrice", type: "number" },
          { label: "Description", name: "description", type: "text" },
          { label: "Category", name: "category", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name} style={formGroupStyle}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              name={name}
              value={supplyData[name]}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors[name] && <span style={errorStyle}>{errors[name]}</span>}
          </div>
        ))}
        <button type="submit" style={buttonStyle}>Add Supply</button>
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

export default AddSupplier;
