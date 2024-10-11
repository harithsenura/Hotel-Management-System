import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/Slider/EventSidebar";
import "./AddEvent.css";

export default function AddEvent() {
  const [Event, setEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [Venue, setVenue] = useState("");
  const [EventPlanner, setEventPlanner] = useState("");
  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [Decorations, setDecorations] = useState("");
  const [NoOfGuests, setNoOfGuests] = useState("");
  const [timeError, setTimeError] = useState("");
  const [dateError, setDateError] = useState("");
  const [inputError, setInputError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      // Searching for users
      axios.get(`http://localhost:5000/users/search?name=${searchTerm}`)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((err) => {
          console.error("Error fetching users: ", err);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      // Searching for event planners
      axios.get(`http://localhost:5000/eventPlanners/search?name=${searchTerm}`)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((err) => {
          console.error("Error fetching event planners: ", err);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.name);
  };

  const handleEventPlannerSelect = (planner) => {
    setEventPlanner(planner.Name);
    setSearchTerm(planner.Name);
    setSearchResults([]);
  };

  const validateForm = () => {
    let isValid = true;
    let errors = "";

    // Check if all fields are filled
    if (!Event || !eventDate || !Venue || !EventPlanner || !StartTime || !EndTime || !Decorations || !NoOfGuests || NoOfGuests <= 0) {
      errors += "All fields must be filled, and number of guests must be a positive number.\n";
      isValid = false;
    }

    // Check if start time is before end time
    if (StartTime && EndTime && StartTime >= EndTime) {
      errors += "Start time must be earlier than end time.\n";
      isValid = false;
    }

    // Set errors to state if there are any
    if (!isValid) {
      setInputError(errors);
    } else {
      setInputError(""); // Clear errors if valid
    }

    return isValid;
  };

  const validateEventDate = (date) => {
    const today = new Date();
    const parsedEventDate = new Date(date); // Parse the selected date

    if (parsedEventDate < today) {
      setDateError("The event date must be in the future.");
      return false; // Invalid date
    } else {
      setDateError(""); // Clear error if valid
      return true; // Valid date
    }
  };

  const sendData = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newEvent = {
        Event,
        Date: eventDate,
        Venue,
        EventPlanner,
        StartTime,
        EndTime,
        Decorations,
        NoOfGuests,
        User: selectedUser,
      };

      axios
        .post("http://localhost:5000/events/add", newEvent)
        .then(() => {
          alert("Event Added");
          resetForm();
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const resetForm = () => {
    setEvent("");
    setEventDate("");
    setVenue("");
    setEventPlanner("");
    setStartTime("");
    setEndTime("");
    setDecorations("");
    setNoOfGuests("");
    setSelectedUser(null);
    setSearchTerm("");
    setSearchResults([]);
    setTimeError("");
    setInputError("");
    setDateError("");
  };

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
    <div>
      <SideBar />
      <div className="content-container">
        <div className="add-event-container">
          <div className="form-container">
            <h2>Add New Event</h2>
            <div className="user-search">
              <label>Search Event Planner:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name"
                className="search-input"
              />
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map((planner) => (
                    <li
                      key={planner._id}
                      className="search-result-item"
                      onClick={() => handleEventPlannerSelect(planner)}
                    >
                      {planner.Name} - {planner.Email}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form onSubmit={sendData} className="event-form">
              {selectedUser && (
                <>
                  <div className="user-info">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={selectedUser.name}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                  <div className="user-info">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={selectedUser.email}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                  <div className="user-info">
                    <label>Address:</label>
                    <input
                      type="text"
                      value={selectedUser.address}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Event:</label>
                <input
                  type="text"
                  value={Event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => {
                    setEventDate(e.target.value);
                    validateEventDate(e.target.value); // Validate date on change
                  }}
                  className="input-field"
                />
                {dateError && <p className="error-message">{dateError}</p>} {/* Display date error */}
              </div>
              <div className="form-group">
                <label>Venue:</label>
                <input
                  type="text"
                  value={Venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Event Planner:</label>
                <input
                  type="text"
                  value={EventPlanner}
                  readOnly
                  className="readonly-input"
                />
              </div>
              <div className="form-group">
                <label>Start Time:</label>
                <input
                  type="time"
                  value={StartTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>End Time:</label>
                <input
                  type="time"
                  value={EndTime}
                  onChange={handleEndTimeChange}
                  className="input-field"
                />
                {timeError && <p className="error-message">{timeError}</p>}
              </div>
              <div className="form-group">
                <label>Decorations:</label>
                <input
                  type="text"
                  value={Decorations}
                  onChange={(e) => setDecorations(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>No. of Guests:</label>
                <input
                  type="number"
                  value={NoOfGuests}
                  onChange={(e) => setNoOfGuests(e.target.value)}
                  className="input-field"
                />
              </div>

              {inputError && <p className="error-message">{inputError}</p>}
              
            </form>
            <div className="submit-container">
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
