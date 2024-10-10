import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventProfileUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Event: "",
    Date: "",
    Venue: "",
    EventPlanner: "",
    StartTime: "",
    EndTime: "",
    Decorations: "",
    NoOfGuests: ""
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/events/${id}`)
        .then((res) => {
          if (res.data) {
            setEventData(res.data);
            setFormData(res.data);
          } else {
            setError("Event not found.");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching event data:", err);
          setError("Failed to fetch event data.");
          setLoading(false);
        });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/events/${id}`, formData)
      .then((res) => {
        alert("Event updated successfully!");
        setEventData(res.data);
        setIsEditing(false);
      })
      .catch((err) => {
        alert("Failed to update event.");
        console.error("Update error:", err);
      });
  };

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;

  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "20px",
    margin: "20px auto",
    maxWidth: "600px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    margin: "5px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const updateButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#800000", // Green
    color: "white",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d", // Gray
    color: "white",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>{isEditing ? "Update Event" : "Event Profile"}</h1>

      {!isEditing ? (
        <div style={cardStyle}>
          <h5>{eventData.Event}</h5>
          <p><strong>Date:</strong> {eventData.Date}</p>
          <p><strong>Venue:</strong> {eventData.Venue}</p>
          <p><strong>Event Planner:</strong> {eventData.EventPlanner}</p>
          <p><strong>Start Time:</strong> {eventData.StartTime}</p>
          <p><strong>End Time:</strong> {eventData.EndTime}</p>
          <p><strong>Decorations:</strong> {eventData.Decorations}</p>
          <p><strong>No of Guests:</strong> {eventData.NoOfGuests}</p>
          <button onClick={() => setIsEditing(true)} style={updateButtonStyle}>
            Update Event
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={cardStyle}>
          <h5>Update Event Details</h5>

          {Object.keys(formData).map((key) => (
            <div style={{ marginBottom: "15px" }} key={key}>
              <label style={{ display: "block", marginBottom: "5px" }}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</label>
              <input
                type={key === "Date" ? "date" : key.includes("Time") ? "time" : "text"}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          <button type="submit" style={updateButtonStyle}>Update Event</button>
          <button type="button" style={cancelButtonStyle} onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EventProfileUpdate;
