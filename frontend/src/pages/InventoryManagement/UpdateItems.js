import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/Slider/InventoryManagementSidebar";

export default function UpdateItems({ item, onSave, onClose }) {
  const { id } = useParams(); // Get the item ID from the URL parameters
  const navigate = useNavigate(); // for navigation

  const [itemName, setName] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setStock] = useState("");
  const [date, setDate] = useState("");
  const [statusOfItem, setStatusOfItem] = useState("");
  const [errors, setErrors] = useState({}); // State for validation errors
  const [isDateDisabled, setIsDateDisabled] = useState(false); // State to control if the date field should be disabled

  function validateForm() {
    let formErrors = {};
    let valid = true;

    // Name validation
    if (!itemName.trim()) {
      formErrors.itemName = "Item name is required.";
      valid = false;
    }

    // Category validation
    if (!category.trim()) {
      formErrors.category = "Category is required.";
      valid = false;
    }

    // In-stock validation
    if (!inStock || inStock <= 0) {
      formErrors.inStock = "Number of items should be a positive number.";
      valid = false;
    }

    // Date validation
    if (!date) {
      formErrors.date = "Date is required.";
      valid = false;
    }

    // Status validation
    if (!statusOfItem) {
      formErrors.statusOfItem = "Status is required.";
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  }

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/inventory/stocks/${id}`)
      .then((response) => {
        setName(response.data.itemName);
        setCategory(response.data.category);
        setStock(response.data.inStock);

        // Format the date
        const fetchedDate = response.data.date; // Adjust this if needed
        const formattedDate = new Date(fetchedDate).toISOString().split('T')[0];
        setDate(formattedDate);

        setStatusOfItem(response.data.statusOfItem);

        // Only disable the date field if it has already been set
        if (fetchedDate) {
          setIsDateDisabled(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Exit if the form is invalid
    }

    const updatedItem = {
      itemName: itemName,
      category: category,
      inStock: inStock,
      date: date,
      statusOfItem: statusOfItem,
    };

    // Save the updated item
    axios
      .put(`http://localhost:5000/api/inventory/stocks/update/${id}`, updatedItem)
      .then((response) => {
        alert("Success Update")
        navigate("/inventory/manageitems"); // Navigate back after successful update
      })
      .catch((err) => {
        alert("Update failed: " + err);
      });
  };

  return (
    <div>
      <SideBar />
      <div
        style={{
          maxWidth: "600px",
          padding: "20px",
          marginLeft: "600px",
          marginTop:"50px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          width:"100%"
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
        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 5px;
        }
        .form-control {
          width: 100%;
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
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
        .btn-primary:hover {
          background-color: #871c2b;
        }
      `}</style>

        <div className="update-items-form">
          <h2>Update Item Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="itemName" className="form-label">
                Item Name
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                id="itemName"
                required
              />
              {errors.itemName && <div className="error-message">{errors.itemName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                value={category}
                className="form-control"
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="restaurant">Restaurant</option>
                <option value="bar">Bar</option>
                <option value="both">Both</option>
              </select>
              {errors.category && <div className="error-message">{errors.category}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="inStock" className="form-label">
                In-Stock
              </label>
              <input
                type="number"
                value={inStock}
                onChange={(e) => setStock(e.target.value)}
                className="form-control"
                id="inStock"
                required
              />
              {errors.inStock && <div className="error-message">{errors.inStock}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
                id="date"
                required
              // Removed disabled attribute to keep the date field editable
              />
              {errors.date && <div className="error-message">{errors.date}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                value={statusOfItem}
                className="form-control"
                onChange={(e) => setStatusOfItem(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="in-stock">In-stock</option>
                <option value="out-of-stock">Out-of-stock</option>
                <option value="ordered">Ordered</option>
                <option value="pending">Pending</option>
              </select>
              {errors.statusOfItem && <div className="error-message">{errors.statusOfItem}</div>}
            </div>

            <div className="btn-container">
              <button type="submit" className="btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
