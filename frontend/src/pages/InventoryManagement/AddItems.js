import React, { useState } from "react";
import axios from "axios";
import SideBar from "../../components/Slider/InventoryManagementSidebar";
import { toast } from "react-toastify";
import { delay } from "framer-motion";

export default function AddItems({ onItemAdded }) {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState("");
  const [date, setDate] = useState("");
  const [statusOfItem, setStatusOfItem] = useState("");
  const [errors, setErrors] = useState({});

  // Form validation logic
  function validateForm() {
    let formErrors = {};
    let valid = true;

    // Validate item name
    if (!itemName.trim()) {
      formErrors.itemName = "Item name is required.";
      valid = false;
    }

    // Validate category
    if (!category.trim()) {
      formErrors.category = "Category is required.";
      valid = false;
    }

    // Validate in-stock amount
    if (!inStock || inStock < 0) {
      formErrors.inStock = "Number of items should be a non-negative number.";
      valid = false;
    }

    // Validate date
    if (!date) {
      formErrors.date = "Date is required.";
      valid = false;
    } else {
      const today = new Date();
      const selectedDate = new Date(date);
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        formErrors.date = "Please select today or a future date.";
        valid = false;
      }
    }

    // Validate item status
    if (!statusOfItem.trim()) {
      formErrors.statusOfItem = "Status is required.";
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  }

  // Real-time validation for In Stock and Date
  function handleInputChange(field) {
    if (field === "inStock") {
      const newStock = parseInt(inStock, 10);
      if (isNaN(newStock) || newStock < 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          inStock: "Number of items should be a non-negative number.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          inStock: null,
        }));
      }
    }

    if (field === "date") {
      if (!date) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          date: "",
        }));
      } else {
        const today = new Date();
        const selectedDate = new Date(date);
        if (selectedDate < today.setHours(0, 0, 0, 0)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            date: "Please select today or a future date.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            date: null,
          }));
        }
      }
    }
  }

  // Form submission logic
  function sendData(e) {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return; // Stop if the form is invalid
    }

    // Create new item object to send
    const newItem = {
      itemName,
      category,
      inStock,
      date,
      statusOfItem,
    };

    // Post data to the backend
    axios
      .post("http://localhost:5000/api/inventory/stocks/send", newItem)
      .then((response) => {
        alert("Item added successfully");
        // Reset form fields after successful submission
        setItemName("");
        setCategory("");
        setInStock("");
        setDate("");
        setStatusOfItem("");
    

        // Call callback function if it exists
        if (typeof onItemAdded === "function") {
          onItemAdded(response.data);
        }
      })
      .catch((err) => {
        alert("Error: " + err.response?.data?.message || err.message);
      });
  }

  return (
    <>
      <SideBar />
      <div>
        {/* Title */}
        <h1
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontSize: 32,
          }}
        >
          Add New Item
        </h1>

        {/* Form container */}
        <div
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            marginRight: "350px",
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

          .error-message {
            color: red;
            font-size: 14px;
            margin-top: 5px;
          }

          .btn-primary {
            background-color: #A02334;
            color: #fff;
            padding: 15px 20px;
            font-size: 18px;
            width: 200px;
            height: 40px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .btn-primary:hover {
            background-color: #871c2b;
          }
        `}</style>

          {/* Form */}
          <form onSubmit={sendData}>
            {/* Item name input */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Item Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              {errors.itemName && (
                <div className="error-message">{errors.itemName}</div>
              )}
            </div>

            {/* Category input */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                value={category}
                className="form-control"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="restaurant">Restaurant</option>
                <option value="bar">Bar</option>
                <option value="both">Restaurant & Bar</option>
              </select>
              {errors.category && (
                <div className="error-message">{errors.category}</div>
              )}
            </div>

            {/* In stock input */}
            <div className="form-group">
              <label htmlFor="stock" className="form-label">
                In Stock
              </label>
              <input
                type="number"
                className="form-control"
                id="stock"
                value={inStock}
                onChange={(e) => {
                  setInStock(e.target.value);
                  handleInputChange("inStock");
                }}
              />
              {errors.inStock && (
                <div className="error-message">{errors.inStock}</div>
              )}
            </div>

            {/* Date input */}
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
                  setDate(e.target.value);
                  handleInputChange("date");
                }}
              />
              {errors.date && (
                <div className="error-message">{errors.date}</div>
              )}
            </div>

            {/* Status input */}
            <div className="form-group">
              <label htmlFor="statusOfItem" className="form-label">
                Status
              </label>
              <select
                id="status"
                value={statusOfItem}
                className="form-control"
                onChange={(e) => setStatusOfItem(e.target.value)}
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="in-stock">In-stock</option>
                <option value="out-of-stock">Out-of-stock</option>
                <option value="ordered">Ordered</option>
                <option value="pending">Pending</option>
              </select>
              {errors.statusOfItem && (
                <div className="error-message">{errors.statusOfItem}</div>
              )}
            </div>

            {/* Submit button */}
            <div className="btn-container">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
