import React, { useState } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar/EventSidebar";

export default function AddEventPlanner() {
  const [Name, setName] = useState("");
  const [AssignedEvent, setAssignedEvent] = useState("");
  const [Salary, setSalary] = useState("");
  const [Email, setEmail] = useState("");
  const [ContactNumber, setContactNumber] = useState("");

  // Error state for each field
  const [errors, setErrors] = useState({
    name: "",
    assignedEvent: "",
    salary: "",
    email: "",
    contactNumber: "",
  });

  function validateForm() {
    let tempErrors = { name: "", assignedEvent: "", salary: "", email: "", contactNumber: "" };
    let isValid = true;

    // Enhanced validation for name
    if (Name.trim() === "") {
      tempErrors.name = "Name is required.";
      isValid = false;
    } else if (Name.trim().length < 3) {
      tempErrors.name = "Name must be at least 3 characters.";
      isValid = false;
    } else if (/\d/.test(Name)) {
      tempErrors.name = "Name should not contain numbers.";
      isValid = false;
    }

    // Validation for assigned event
    if (AssignedEvent === "") {
      tempErrors.assignedEvent = "Assigned event is required.";
      isValid = false;
    }

    // Enhanced validation for contact number
    if (ContactNumber === "") {
      tempErrors.contactNumber = "Contact number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(ContactNumber)) {
      tempErrors.contactNumber = "Contact number must be exactly 10 digits.";
      isValid = false;
    }

    // Enhanced validation for email
    if (Email === "") {
      tempErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      tempErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Enhanced validation for salary
    if (Salary === "") {
      tempErrors.salary = "Salary is required.";
      isValid = false;
    } else if (isNaN(Salary) || parseFloat(Salary) <= 0) {
      tempErrors.salary = "Please enter a valid positive number.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  }

  // Validate fields immediately on change
  function validateField(field, value) {
    let tempErrors = { ...errors };
    switch (field) {
      case "name":
        if (value.trim() === "") {
          tempErrors.name = "Name is required.";
        } else if (value.trim().length < 3) {
          tempErrors.name = "Name must be at least 3 characters.";
        } else if (/\d/.test(value)) {
          tempErrors.name = "Name should not contain numbers.";
        } else {
          tempErrors.name = "";
        }
        break;
      case "assignedEvent":
        tempErrors.assignedEvent = value === "" ? "Assigned event is required." : "";
        break;
      case "contactNumber":
        if (value === "") {
          tempErrors.contactNumber = "Contact number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          tempErrors.contactNumber = "Contact number must be exactly 10 digits.";
        } else {
          tempErrors.contactNumber = "";
        }
        break;
      case "email":
        if (value === "") {
          tempErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          tempErrors.email = "Please enter a valid email address.";
        } else {
          tempErrors.email = "";
        }
        break;
      case "salary":
        if (value === "") {
          tempErrors.salary = "Salary is required.";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          tempErrors.salary = "Please enter a valid positive number.";
        } else {
          tempErrors.salary = "";
        }
        break;
      default:
        break;
    }
    setErrors(tempErrors);
  }

  function sendData(e) {
    e.preventDefault();

    if (!validateForm()) {
      return; // Exit if validation fails
    }

    const newEventPlanner = {
      Name,
      AssignedEvent,
      SalaryForTheEvent: Salary,
      Email,
      ContactNumber,
    };

    axios.post("http://localhost:5000/eventplanners/add", newEventPlanner)
      .then(() => {
        alert("Event Planner Added");
        // Clear form fields after submission
        setName("");
        setAssignedEvent("");
        setSalary("");
        setEmail("");
        setContactNumber("");
        setErrors({ name: "", assignedEvent: "", salary: "", email: "", contactNumber: "" });
      })
      .catch((err) => {
        alert(err);
      });
  }

  // ... (rest of your styles remain exactly the same)
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  };
  
  const formContainerStyle = {
    backgroundColor: "#dfdede",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    marginLeft:"250px",
    maxWidth: "600px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  
  const formGroupStyle = {
    marginBottom: "15px",
    width: "100%",
  };

  const formControlStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  const buttonStyle = {
    backgroundColor: "#b30000",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    width:"200px"
  };

  return (
    <div>
      <SideBar />
      <div style={containerStyle}>
        <form style={formContainerStyle} onSubmit={sendData}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add Event Planner</h2>
          <div style={formGroupStyle}>
            <label htmlFor="InputName">Name</label>
            <input
              type="text"
              style={formControlStyle}
              id="InputName"
              placeholder="Enter the Name"
              onChange={(e) => {
                setName(e.target.value);
                validateField("name", e.target.value);
              }}
              onBlur={(e) => validateField("name", e.target.value)}
              value={Name}
            />
            {errors.name && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.name}</p>}
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="InputAssignedEvent">Assigned Event</label>
            <select
              style={formControlStyle}
              id="InputAssignedEvent"
              onChange={(e) => {
                setAssignedEvent(e.target.value);
                validateField("assignedEvent", e.target.value);
              }}
              onBlur={(e) => validateField("assignedEvent", e.target.value)}
              value={AssignedEvent}
            >
              <option value="">Select Assigned Event</option>
              <option value="Inside Events">Inside Events</option>
              <option value="Outside Events">Outside Events</option>
            </select>
            {errors.assignedEvent && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.assignedEvent}</p>}
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="InputSalary">Salary</label>
            <input
              type="text"
              style={formControlStyle}
              id="InputSalary"
              placeholder="Enter the Salary"
              onChange={(e) => {
                setSalary(e.target.value);
                validateField("salary", e.target.value);
              }}
              onBlur={(e) => validateField("salary", e.target.value)}
              value={Salary}
            />
            {errors.salary && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.salary}</p>}
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="InputEmail">Email</label>
            <input
              type="email"
              style={formControlStyle}
              id="InputEmail"
              placeholder="Enter the Email"
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              onBlur={(e) => validateField("email", e.target.value)}
              value={Email}
            />
            {errors.email && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.email}</p>}
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="InputContactNumber">Contact Number</label>
            <input
              type="tel"
              style={formControlStyle}
              id="InputContactNumber"
              placeholder="Enter the Contact Number"
              onChange={(e) => {
                setContactNumber(e.target.value);
                validateField("contactNumber", e.target.value);
              }}
              onBlur={(e) => validateField("contactNumber", e.target.value)}
              value={ContactNumber}
              maxLength="10"
            />
            {errors.contactNumber && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.contactNumber}</p>}
          </div>
          <div style={buttonContainerStyle}>
            <button type="submit" style={buttonStyle}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}