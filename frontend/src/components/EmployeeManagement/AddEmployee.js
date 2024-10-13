import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/AdminEmployeeSideBar";
import "./AddEmployee.css"; // Import the CSS file

export default function AddEmployee() {
  const [isHovering, setIsHovering] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Fixed typo from setShowAleart
  const [alertMessage, setAlertMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [nic, setNic] = useState("");
  const [designation, setDesignation] = useState("");
  const [basicsal, setBasicsal] = useState("");
  const [empid, setEmpid] = useState("");

  const sendData = (e) => {
    e.preventDefault();

    // Validation
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setAlertMessage("Name can only contain letters.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setAlertMessage("Please enter a valid email address.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setAlertMessage(
        "Mobile number must contain exactly 10 digits without letters, symbols, or decimals."
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!/^(?:\d{9}[vV]|\d{12})$/.test(nic)) {
      setAlertMessage(
        "NIC must be in the format 000000000V or 000000000000, with no letters or symbols."
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!Number.isInteger(Number(basicsal)) || Number(basicsal) <= 0) {
      setAlertMessage(
        "Basic salary must be a positive whole number without letters or symbols."
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(designation)) {
      setAlertMessage(
        "Designation cannot contain numbers or special characters."
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const newEmployee = {
      name,
      email,
      mobile,
      nic,
      designation,
      basicsal,
      empid,
    };

    axios
      .post("http://localhost:5000/employee/add", newEmployee)
      .then(() => {
        setAlertMessage("Employee Added Successfully");
        setShowAlert(true);

        // Clear form fields
        setName("");
        setEmail("");
        setMobile("");
        setNic("");
        setDesignation("");
        setBasicsal("");
        setEmpid("");

        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage("Error Adding Employee");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  return (
    <>
      <SideBar />
      <div className="form-page">
        <form className="form-container" onSubmit={sendData}>
          <div className="form-grid">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="mobileno" className="form-label">
                Mobile No
              </label>
              <input
                type="tel"
                className="form-control"
                id="mobileno"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                pattern="\d{10}"
                title="Mobile number must be exactly 10 digits."
              />
            </div>

            <div className="mb-3">
              <label htmlFor="nic" className="form-label">
                NIC
              </label>
              <input
                type="text"
                className="form-control"
                id="nic"
                placeholder="Enter NIC"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="designation" className="form-label">
                Designation
              </label>
              <input
                type="text"
                className="form-control"
                id="designation"
                placeholder="Enter Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="basicsal" className="form-label">
                Basic Salary
              </label>
              <input
                type="number"
                className="form-control"
                id="basicsal"
                placeholder="Enter Basic Salary"
                value={basicsal}
                onChange={(e) => setBasicsal(e.target.value)}
                required
                min="1"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="empid" className="form-label">
                Employee ID
              </label>
              <input
                type="text"
                className="form-control"
                id="empid"
                placeholder="Enter Employee ID"
                value={empid}
                onChange={(e) => setEmpid(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Submit
          </button>
        </form>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              className="alert"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "100%" }}
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
