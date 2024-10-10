import React, { useState } from "react";
import axios from "axios";

export default function AddEventPlanner() {
  const [Name, setName] = useState("");
  const [AssignedEvent, setAssignedEvent] = useState("");
  const [SalaryForTheEvent, setSalaryForTheEvent] = useState("");
  const [Email, setEmail] = useState("");
  const [ContactNumber, setContactNumber] = useState("");

  function sendData(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validation for contact number
    // Check if the length of the contact number is exactly 10
    // and if it contains only digits using a regular expression
    if (ContactNumber.length !== 10 || !/^\d+$/.test(ContactNumber)) {
      alert("Contact number must be 10 digits."); // Alert the user if validation fails
      return; // Exit the function if validation fails
    }

    // Validation for email
    // Check if the email contains the '@' character
    if (!Email.includes("@")) {
      alert("Email must contain an '@' sign."); // Alert the user if validation fails
      return; // Exit the function if validation fails
    }

    const newEventPlanner = {
      Name,
      AssignedEvent,
      SalaryForTheEvent,
      Email,
      ContactNumber,
    };

    // Send a POST request to the server with the new event planner data
    axios.post("http://localhost:5000/planner/add", newEventPlanner)
      .then(() => {
        alert("Event Planner Added"); // Alert the user on successful addition
        // Clear form fields after submission
        setName("");
        setAssignedEvent("");
        setSalaryForTheEvent("");
        setEmail("");
        setContactNumber("");
      })
      .catch((err) => {
        alert(err); // Alert the user if there's an error in the request
      });
  }

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", // Full viewport height for vertical centering
    backgroundColor: "#f0f0f0",
    padding: "20px",
  };

  const formContainerStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%", // Ensure the form container takes full width
    maxWidth: "600px", // Adjust max width for better appearance
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const formGroupStyle = {
    marginBottom: "15px",
    width: "100%", // Ensure form fields take full width of the form container
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
    justifyContent: "flex-end",
    width: "100%", // Ensure the button container takes full width
  };

  const buttonStyle = {
    backgroundColor: "#b30000",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div style={containerStyle}>
      <form style={formContainerStyle} onSubmit={sendData}>
        <div style={formGroupStyle}>
          <label htmlFor="InputName">Name</label>
          <input
            type="text"
            style={formControlStyle}
            id="InputName"
            placeholder="Enter the Name"
            onChange={(e) => setName(e.target.value)}
            value={Name}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="InputAssignedEvent">Assigned Event</label>
          <input
            type="text"
            style={formControlStyle}
            id="InputAssignedEvent"
            placeholder="Enter the Assigned Event"
            onChange={(e) => setAssignedEvent(e.target.value)}
            value={AssignedEvent}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="InputSalaryForTheEvent">Salary For The Event</label>
          <input
            type="text"
            style={formControlStyle}
            id="InputSalaryForTheEvent"
            placeholder="Enter the Salary"
            onChange={(e) => setSalaryForTheEvent(e.target.value)}
            value={SalaryForTheEvent}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="InputEmail">Email</label>
          <input
            type="email"
            style={formControlStyle}
            id="InputEmail"
            placeholder="Enter the Email"
            onChange={(e) => setEmail(e.target.value)}
            value={Email}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="InputContactNumber">Contact Number</label>
          <input
            type="tel"
            style={formControlStyle}
            id="InputContactNumber"
            placeholder="Enter the Contact Number"
            onChange={(e) => setContactNumber(e.target.value)}
            value={ContactNumber}
          />
        </div>
        <div style={buttonContainerStyle}>
          <button type="submit" style={buttonStyle}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
