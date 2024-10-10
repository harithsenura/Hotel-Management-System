import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../../components/Slider/EventSidebar.js";
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update the event details
        axios.put(`http://localhost:5000/events/${id}`, event)
            .then(() => {
                toast.success("Event updated successfully!");
               
                    navigate("/events"); // Redirect to events list after update
              
            })
            .catch(err => {
                setAlertMessage("Error updating event.");
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            });
    };

    return (
        <div>
           <SideBar/>
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
