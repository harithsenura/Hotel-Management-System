import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddEvent() {
  const [Event, setEvent] = useState("");
  const [Date, setDate] = useState("");
  const [Venue, setVenue] = useState("");
  const [EventPlanner, setEventPlanner] = useState("");
  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [Decorations, setDecorations] = useState("");
  const [NoOfGuests, setNoOfGuests] = useState("");
  const [timeError, setTimeError] = useState(""); // State to handle time error

  // User search and auto-fill related state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      // Call the backend API to search users
      axios.get(`http://localhost:5000/users/search?name=${searchTerm}`)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((err) => {
          console.error("Error fetching users: ", err);
        });
    } else {
      setSearchResults([]); // Clear search results if search term is empty
    }
  }, [searchTerm]);

  // When a user is selected from search results
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.name); // Display user name in the search bar
  };

  function sendData(e) {
    e.preventDefault();

    if (NoOfGuests <= 0) {
      alert("Number of guests must be a positive number.");
      return;
    }

    if (StartTime && EndTime && StartTime >= EndTime) {
      setTimeError("Start time must be earlier than end time.");
      return;
    }

    const newEvent = {
      Event,
      Date,
      Venue,
      EventPlanner,
      StartTime,
      EndTime,
      Decorations,
      NoOfGuests,
      User: selectedUser, // Include selected user data in the event details
    };

    axios
      .post("http://localhost:5000/events/add", newEvent)
      .then(() => {
        alert("Event Added");
        setEvent("");
        setDate("");
        setVenue("");
        setEventPlanner("");
        setStartTime("");
        setEndTime("");
        setDecorations("");
        setNoOfGuests("");
        setSelectedUser(null); // Clear selected user
        setSearchTerm(""); // Clear search field
        setTimeError("");
      })
      .catch((err) => {
        alert(err);
      });
  }

  const handleEndTimeChange = (e) => {
    const selectedEndTime = e.target.value;
    setEndTime(selectedEndTime);

    if (StartTime && selectedEndTime && StartTime >= selectedEndTime) {
      setTimeError("Start time must be earlier than end time.");
    } else {
      setTimeError("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* User Search */}
      <div style={{ marginBottom: "20px" }}>
        <label>Search User:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email"
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        {/* Display search results */}
        {searchResults.length > 0 && (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {searchResults.map((user) => (
              <li
                key={user._id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => handleUserSelect(user)}
              >
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={sendData}>
        {/* Auto-filled fields based on selected user */}
        {selectedUser && (
          <>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={selectedUser.name}
                readOnly
                style={{ ...formControlStyle, backgroundColor: "#f0f0f0" }}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={selectedUser.email}
                readOnly
                style={{ ...formControlStyle, backgroundColor: "#f0f0f0" }}
              />
            </div>
            <div>
              <label>Address:</label>
              <input
                type="text"
                value={selectedUser.address}
                readOnly
                style={{ ...formControlStyle, backgroundColor: "#f0f0f0" }}
              />
            </div>
          </>
        )}

        {/* Other Event Fields */}
        <div>
          <label>Event:</label>
          <input
            type="text"
            value={Event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={Date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Venue:</label>
          <input
            type="text"
            value={Venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>
        <div>
          <label>Event Planner:</label>
          <input
            type="text"
            value={EventPlanner}
            onChange={(e) => setEventPlanner(e.target.value)}
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            value={StartTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="time"
            value={EndTime}
            onChange={handleEndTimeChange}
          />
          {timeError && <p style={{ color: "red" }}>{timeError}</p>}
        </div>
        <div>
          <label>Decorations:</label>
          <input
            type="text"
            value={Decorations}
            onChange={(e) => setDecorations(e.target.value)}
          />
        </div>
        <div>
          <label>No. of Guests:</label>
          <input
            type="number"
            value={NoOfGuests}
            onChange={(e) => setNoOfGuests(e.target.value)}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
}

const formControlStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const buttonStyle = {
  backgroundColor: "#b30000",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
