import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function UpdateEventPlannerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [planner, setPlanners] = useState({
    Name: "",
    AssignedEvent: "",
    SalaryForTheEvent: "",
    Email: "",
    ContactNumber: "",

  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/planner/get/${id}`)
      .then((res) => {
        setPlanners(res.data.plannerr);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setPlanners((prevState) => ({ ...prevState, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios.put(`http://localhost:5000/planner/update/${id}`, planner)
      .then(() => {
        setAlertMessage("Event Planner updated successfully!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
        navigate(`/planner/${id}`);
      })
      .catch((err) => {
        setAlertMessage("Error updating event planner.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  }

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
  };

  const labelStyle = {
    color: '#333333',
    fontWeight: 'bold',
  };

  const inputStyle = {
    backgroundColor: '#f2f2f2',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    padding: '10px',
    color: '#333333',
    width: '100%',
  };

  const buttonStyle = {
    backgroundColor: '#800000',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
  };

  const alertStyle = {
    backgroundColor: '#ffffff',
    color: '#800000',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'fixed',
    top: '80px',
    right: '20px',
    zIndex: 1000,
    width: '300px',
    transform: 'translateX(100%)',
  };

  return (
    <div style={{ padding: '50px', width: 'calc(100% - 250px)', boxSizing: 'border-box', marginLeft: '250px' }}>
      <h1>Update Customer Profile</h1>
      <div style={formStyle}>
        <form onSubmit={handleSubmit}>
          <div style={containerStyle}>
            <div className="form-group">
              <label htmlFor="Name" style={labelStyle}>Name</label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={planner.Name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label htmlFor="AssignedEvent" style={labelStyle}>Assigned Event</label>
              <input
                type="text"
                id="AssignedEvent"
                name="AssignedEvent"
                value={planner.AssignedEvent}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label htmlFor="SalaryForTheEvent" style={labelStyle}>SalaryForTheEvent</label>
              <input
                type="text"
                id="SalaryForTheEvent"
                name="SalaryForTheEvent"
                value={planner.SalaryForTheEvent}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>


            <div className="form-group">
              <label htmlFor="nationality" style={labelStyle}>Email</label>
              <input
                type="text"
                id="Email"
                name="Email"
                value={planner.Email}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" style={labelStyle}>Contact Number</label>
              <input
                type="text"
                id="ContactNumber"
                name="ContactNumber"
                value={planner.ContactNumber}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

          </div>

          <button
            type="submit"
            style={buttonStyle}
          >
            Update
          </button>
        </form>
      </div>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            style={alertStyle}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: '0%' }}
            exit={{ opacity: 0, x: '100%' }}
          >
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
