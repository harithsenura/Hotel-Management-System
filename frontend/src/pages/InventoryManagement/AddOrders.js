import React, { useState } from "react";
import axios from "axios";
import SideBar from "../../components/Slider/InventoryManagementSidebar";

export default function AddOrders({ onOrderAdded }) {
  const [name, setname] = useState("");
  const [supplier, setsupplier] = useState("");
  const [date, setdate] = useState("");
  const [noOfItems, setnoOfitems] = useState("");
  const [errors, setErrors] = useState({});

  function validateForm() {
    let formErrors = {};
    let valid = true;

    if (!name.trim()) {
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

  function sendData(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const newOrder = {
        orderName: name,
        supplier,
        date,
        noOfItems: Number(noOfItems), // Ensure noOfItems is a number
    };

    console.log("Order Data:", newOrder); // Log the order data before sending

    axios
        .post("http://localhost:5000/api/inventory/orders/send", newOrder)
        .then((response) => {
            alert("Order Added");
            setname("");
            setsupplier("");
            setdate("");
            setnoOfitems("");
        })
        .catch((err) => {
            console.error("Error:", err.response?.data); // Log the error response for debugging
            alert("Error: " + (err.response?.data?.message || err.message)); // Show specific error message if available
        });
}

  return (
    <div>
      <SideBar />
      <div>
        {/* Add title here */}
        <h1 style={{ textAlign: "center", marginLeft: "250px", marginTop: "0px", fontSize: 32 }}>Add Order Details</h1>

        <div
          style={{
            maxWidth: "800px",
            margin: "40px auto",
            padding: "20px",
            marginLeft: '490px',
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <style>
            {`
          .form-group {
            margin-bottom: 20px;
          }
          .form-label {
            display: block;
            margin-bottom: 10px;
          }
          .form-control {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
          }
          .btn-primary {
            background-color: #A02334;
            color: #fff;
            padding: 10px 20px;
            border: none;
            width: 150px;
            height: 40px;
            border-radius: 5px;
            cursor: pointer;
          }
          .btn-primary:hover {
            background-color: #871c2b;
          }
          .error-message {
            color: red;
            font-size: 14px;
            margin-top: 5px;
          }
          .button-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }
        `}
          </style>
          <form onSubmit={sendData}>
            <div className="form-group">
              <label htmlFor="Name" className="form-label">
                Order Name
              </label>
              <input
                type="text"
                className="form-control"
                id="Name"
                value={name}
                onChange={(e) => {
                  setname(e.target.value);
                }}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="supplier" className="form-label">
                Supplier Name
              </label>
              <input
                type="text"
                className="form-control"
                id="supplier"
                value={supplier}
                onChange={(e) => {
                  setsupplier(e.target.value);
                }}
              />
              {errors.supplier && <div className="error-message">{errors.supplier}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                value={date}
                onChange={(e) => {
                  setdate(e.target.value);
                }}
              />
              {errors.date && <div className="error-message">{errors.date}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="noOfItems" className="form-label">
                No of Items
              </label>
              <input
                type="number"
                className="form-control"
                id="noOfItems"
                value={noOfItems}
                onChange={(e) => {
                  setnoOfitems(e.target.value);
                }}
              />
              {errors.noOfItems && <div className="error-message">{errors.noOfItems}</div>}
            </div>
            <div className="button-container">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
