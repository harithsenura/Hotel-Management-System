import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateOrders({ order, onSave, onClose }) {
  const { id } = useParams(); // Get the order ID from the URL parameters
  const navigate = useNavigate(); // for navigation

  const [orderName, setOrderName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [noOfItems, setNoOfItems] = useState("");
  const [errors, setErrors] = useState({});
  const [isDateDisabled, setIsDateDisabled] = useState(false); // State to control if the date field should be disabled

  function validateForm() {
    let formErrors = {};
    let valid = true;

    if (!orderName.trim()) {
      formErrors.name = "Order name is required.";
      valid = false;
    }

    if (!supplier.trim()) {
      formErrors.supplier = "Supplier name is required.";
      valid = false;
    }

    if (!date) {
      formErrors.date = "Date is required.";
      valid = false;
    }

    if (!noOfItems || noOfItems <= 0) {
      formErrors.noOfItems = "Number of items should be a positive number.";
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  }
  
  useEffect(() =>{
    console.log("order",order);
  }

  );

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/orders/${id}`).then((response)=>{
      setOrderName(response.data.orderName);
      setSupplier(response.data.supplier);
      setDate(response.data.date);
      setNoOfItems(response.data.noOfItems);
      if (response.data.date) {
        setIsDateDisabled(true); // Disable date field if it's already set
      }
    }).catch((err)=>{console.log(err)});
    
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const updatedOrder = {
      
        orderName: orderName,
        supplier: supplier,
        date: date,
        noOfItems: noOfItems
    
    };

    // Save the updated order using axios
    axios
      .put(`http://localhost:5000/api/v1/orders/${id}`,updatedOrder)
      .then((response) => {
       // alert("Order updated successfully");
       // onSave(updatedOrder); // Call onSave with the updated order
        navigate("/manage");
        
      })
      .catch((err) => {
        alert("Update failed: " + err);
      });
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <style>{`
        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          display: block;
          margin-bottom: 10px;
        }
        .form-control {
          width: 100%;
          padding: 5px;
          font-size: 16px;
          border: 1px solid #ccc;
        }
        .btn-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .btn-primary {
          background-color: #A02334;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
           .error-message {
            color: red;
            font-size: 14px;
            margin-top: 5px;
          }
        .btn-primary:hover {
          background-color: #871c2b;
        }
      `}</style>

      <div className="update-orders-form">
        <h2>Update Order Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Order Name:</label>
            <input
              type="text"
              className="form-control"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Supplier:</label>
            <input
              type="text"
              className="form-control"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date:</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isDateDisabled} // Disable the date field if isDateDisabled is true
            />
          </div>
          <div className="form-group">
            <label className="form-label">No Of Items:</label>
            <input
              type="number"
              className="form-control"
              value={noOfItems}
              onChange={(e) => setNoOfItems(e.target.value)}
              required
            />
            {errors.noOfItems && <div className="error-message">{errors.noOfItems}</div>}
          </div>
          <div className="btn-container">
            <button type="submit" className="btn-primary">
              Save
            </button>
           
          </div>
        </form>
      </div>
    </div>
  );
}
