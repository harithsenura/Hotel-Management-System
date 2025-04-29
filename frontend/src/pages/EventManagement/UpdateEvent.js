import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar/EventSidebar.js";
import { toast } from "react-toastify";

export default function UpdateEvent() {
    const { id } = useParams(); // Retrieve the event ID from the URL
    const navigate = useNavigate(); // For navigation after update

    const [event, setEvent] = useState({
        Event: "",
        Date: "",
        Venue: "",
        EventPlanner: "",
        StartTime: "",
        EndTime: "",
        Decorations: "",
        NoOfGuests: ""
    });

    const [errors, setErrors] = useState({
        Event: "",
        Date: "",
        Venue: "",
        EventPlanner: "",
        StartTime: "",
        EndTime: "",
        Decorations: "",
        NoOfGuests: ""
    });

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        // Fetch the event details
        axios.get(`http://localhost:5000/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(err => alert("Error fetching event details: " + err.message));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear errors on change
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const validateFields = () => {
        let newErrors = {};

        // Validate Event Name
        if (!event.Event.trim()) {
            newErrors.Event = "Event name is required.";
        }

        // Validate Date
        const today = new Date();
        const selectedDate = new Date(event.Date);
        if (!event.Date) {
            newErrors.Date = "Event date is required.";
        } else if (selectedDate <= today) {
            newErrors.Date = "Event date must be in the future.";
        }

        // Validate Venue
        if (!event.Venue.trim()) {
            newErrors.Venue = "Venue is required.";
        }

        // Validate Event Planner
        if (!event.EventPlanner.trim()) {
            newErrors.EventPlanner = "Event planner is required.";
        }

        // Validate Start Time
        if (!event.StartTime) {
            newErrors.StartTime = "Start time is required.";
        }

        // Validate End Time
        if (!event.EndTime) {
            newErrors.EndTime = "End time is required.";
        } else if (event.EndTime <= event.StartTime) {
            newErrors.EndTime = "End time must be after start time.";
        }

        // Validate Decorations
        if (!event.Decorations.trim()) {
            newErrors.Decorations = "Decorations information is required.";
        }

        // Validate Number of Guests
        if (!event.NoOfGuests) {
            newErrors.NoOfGuests = "Number of guests is required.";
        } else if (event.NoOfGuests <= 0) {
            newErrors.NoOfGuests = "Number of guests must be greater than 0.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateFields()) {
            // Update the event details
            axios.put(`http://localhost:5000/events/${id}`, event)
                .then(() => {
                    setAlertMessage("Success Update");
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 3000);
                    navigate("/events"); // Redirect to events list after update
                })
                .catch(err => {
                    setAlertMessage("Error updating event.");
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 3000);
                });
        }
    };

    return (
        <div>
            <SideBar />
            <div style={containerStyle}>
                <h1 style={headerStyle}>Update Event</h1>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Event:</label>
                        <input
                            type="text"
                            name="Event"
                            value={event.Event}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                        {errors.Event && <p style={errorStyle}>{errors.Event}</p>}
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Date:</label>
                        <input
                            type="date"
                            name="Date"
                            value={event.Date ? event.Date.split("T")[0] : ""} // Conditionally format date
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                        {errors.Date && <p style={errorStyle}>{errors.Date}</p>}
                    </div>

                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Venue:</label>
                        <input
                            type="text"
                            name="Venue"
                            value={event.Venue}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                        {errors.Venue && <p style={errorStyle}>{errors.Venue}</p>}
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Event Planner:</label>
                        <input
                            type="text"
                            name="EventPlanner"
                            value={event.EventPlanner}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                        {errors.EventPlanner && <p style={errorStyle}>{errors.EventPlanner}</p>}
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Start Time:</label>
                        <input
                            type="time"
                            name="StartTime"
                            value={event.StartTime}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                        {errors.StartTime && <p style={errorStyle}>{errors.StartTime}</p>}
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>End Time:</label>
                        <input
                            type="time"
                            name="EndTime"
                            value={event.EndTime}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                        {errors.EndTime && <p style={errorStyle}>{errors.EndTime}</p>}
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Decorations:</label>
                        <input
                            type="text"
                            name="Decorations"
                            value={event.Decorations}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                        {errors.Decorations && <p style={errorStyle}>{errors.Decorations}</p>}
                    </div>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>No. of Guests:</label>
                        <input
                            type="number"
                            name="NoOfGuests"
                            value={event.NoOfGuests}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                        {errors.NoOfGuests && <p style={errorStyle}>{errors.NoOfGuests}</p>}
                    </div>
                    <button type="submit" style={buttonStyle}>Update Event</button>
                </form>

                {showAlert && (
                    <div style={alertStyle}>
                        {alertMessage}
                    </div>
                )}
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

const alertStyle = {
    backgroundColor: '#ffffff',
    color: '#800000',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginTop: '20px',
};

const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
};
