import React, { useState } from "react";
import axios from "axios";
import SideBar from "../../components/Slider/EventSidebar";

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

    // Validation for name
    if (Name.trim() === "") {
      tempErrors.name = "Name is required.";
      isValid = false;
    }

    // Validation for assigned event
    if (AssignedEvent === "") {
      tempErrors.assignedEvent = "Assigned event is required.";
      isValid = false;
    }

    // Validation for contact number
    if (ContactNumber.length !== 10 || !/^\d+$/.test(ContactNumber)) {
      tempErrors.contactNumber = "Contact number must be 10 digits.";
      isValid = false;
    }

    // Validation for email
    if (!Email.includes("@") || !Email.includes(".")) {
      tempErrors.email = "Email must be valid.";
      isValid = false;
    }

    // Validation for salary
    if (!Salary) {
      tempErrors.salary = "Salary is required.";
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
        tempErrors.name = value.trim() === "" ? "Name is required." : "";
        break;
      case "assignedEvent":
        tempErrors.assignedEvent = value === "" ? "Assigned planner is required." : "";
        break;
      case "contactNumber":
        tempErrors.contactNumber =
          value.length !== 10 || !/^\d+$/.test(value) ? "Contact number must be 10 digits." : "";
        break;
      case "email":
        tempErrors.email =
          !value.includes("@") || !value.includes(".") ? "Email must be valid." : "";
        break;
      case "salary":
        const salaryValue = parseFloat(value);
        tempErrors.salary = value.trim() === "" || isNaN(salaryValue) || salaryValue < 0 ? "Enter a valid salary value." : "";
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

  const containerStyle = {
    display: "flex",
    justifyContent: "center",  // Horizontally centers the form
    alignItems: "center",      // Vertically centers the form
    minHeight: "100vh",        // Makes the container take up the full viewport height
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
                validateField("name", e.target.value); // Validate on change
              }}
              value={Name}
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="InputAssignedEvent">Assigned Event</label>
            <select
              style={formControlStyle}
              id="InputAssignedEvent"
              onChange={(e) => {
                setAssignedEvent(e.target.value);
                validateField("assignedEvent", e.target.value); // Validate on change
              }}
              value={AssignedEvent}
            >
              <option value="">Select Assigned Event</option>
              <option value="Inside Events">Inside Events</option>
              <option value="Outside Events">Outside Events</option>
            </select>
            {errors.assignedEvent && <p style={{ color: "red" }}>{errors.assignedEvent}</p>}
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
                validateField("salary", e.target.value); // Validate on change
              }}
              value={Salary}
            />
            {errors.salary && <p style={{ color: "red" }}>{errors.salary}</p>}
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
                validateField("email", e.target.value); // Validate on change
              }}
              value={Email}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
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
                validateField("contactNumber", e.target.value); // Validate on change
              }}
              value={ContactNumber}
            />
            {errors.contactNumber && <p style={{ color: "red" }}>{errors.contactNumber}</p>}
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
