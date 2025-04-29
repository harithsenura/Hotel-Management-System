import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar/EventSidebar.js"; // Import the sidebar
import { toast } from "react-toastify"; // Import toast for notifications

export default function UpdatePlanner() {
    const { id } = useParams(); // Retrieve the planner ID from the URL
    const navigate = useNavigate(); // For navigation after update

    const [planner, setPlanner] = useState({
        Name: "",
        AssignedEvent: "",
        SalaryForTheEvent: "",
        Email: "",
        ContactNumber: ""
    });

    useEffect(() => {
        // Fetch the planner details
        axios.get(`http://localhost:5000/eventplanners/${id}`)
            .then(res => setPlanner(res.data))
            .catch(err => toast.error("Error fetching planner details: " + err.message));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlanner(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update the planner details
        axios.put(`http://localhost:5000/eventplanners/${id}`, planner)
            .then(() => {
                toast.success("Event Planner updated successfully!");
                navigate("/eventplanners"); // Redirect to planners list after update
            })
            .catch(err => {
                toast.error("Error updating planner: " + err.message);
            });
    };

    return (
        <div>
            <SideBar />
            <div style={containerStyle}>
                <h1 style={headerStyle}>Update Event Planner</h1>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Name:</label>
                        <input
                            type="text"
                            name="Name"
                            value={planner.Name}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Assigned Event:</label>
                        <input
                            type="text"
                            name="AssignedEvent"
                            value={planner.AssignedEvent}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Salary For The Event:</label>
                        <input
                            type="number"
                            name="SalaryForTheEvent"
                            value={planner.SalaryForTheEvent}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Email:</label>
                        <input
                            type="email"
                            name="Email"
                            value={planner.Email}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Contact Number:</label>
                        <input
                            type="text"
                            name="ContactNumber"
                            value={planner.ContactNumber}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <button type="submit" style={buttonStyle}>Update Planner</button>
                </form>
            </div>
        </div>
    );
}

// Styles
const containerStyle = {
    padding: '20px',
    width: 'calc(100% - 250px)',
    boxSizing: 'border-box',
    marginLeft: '250px',
};

const headerStyle = {
    textAlign: 'left',
    fontSize: '24px',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
};

const formGroupStyle = {
    marginBottom: '15px',
};

const labelStyle = {
    marginBottom: '5px',
    fontSize: '16px',
};

const inputStyle = {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ddd',
};

const buttonStyle = {
    backgroundColor: '#800000',
    color: '#ffffff',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '150px',
};
