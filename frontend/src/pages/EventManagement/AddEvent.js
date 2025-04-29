"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import SideBar from "../../components/SideBar/EventSidebar"

export default function AddEvent() {
  // Form state
  const [formData, setFormData] = useState({
    event: "",
    eventDate: "",
    venue: "",
    eventPlanner: "",
    startTime: "",
    endTime: "",
    decorations: "",
    noOfGuests: "",
  })

  // Error states
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Search for event planners
  useEffect(() => {
    if (searchTerm.length > 0) {
      axios
        .get(`http://localhost:5001/eventPlanners/search?name=${searchTerm}`)
        .then((response) => setSearchResults(response.data))
        .catch((err) => console.error("Error fetching event planners: ", err))
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  // Select event planner
  const handleEventPlannerSelect = (planner) => {
    setFormData((prev) => ({ ...prev, eventPlanner: planner.Name }))
    setSearchTerm(planner.Name)
    setSearchResults([])
    setErrors((prev) => ({ ...prev, eventPlanner: "" }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.event.trim()) newErrors.event = "Event name is required"
    if (!formData.eventDate) newErrors.eventDate = "Event date is required"
    if (!formData.venue.trim()) newErrors.venue = "Venue is required"
    if (!formData.eventPlanner.trim()) newErrors.eventPlanner = "Please select an event planner"
    if (!formData.startTime) newErrors.time = "Start time is required"
    if (!formData.endTime) newErrors.time = "End time is required"
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.time = "End time must be after start time"
    }
    if (!formData.decorations.trim()) newErrors.decorations = "Decorations information is required"
    if (!formData.noOfGuests) {
      newErrors.noOfGuests = "Number of guests is required"
    } else if (isNaN(Number(formData.noOfGuests)) || Number(formData.noOfGuests) <= 0) {
      newErrors.noOfGuests = "Number of guests must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit form
  const sendData = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      const newEvent = {
        Event: formData.event,
        Date: formData.eventDate,
        Venue: formData.venue,
        EventPlanner: formData.eventPlanner,
        StartTime: formData.startTime,
        EndTime: formData.endTime,
        Decorations: formData.decorations,
        NoOfGuests: Number(formData.noOfGuests),
        User: selectedUser,
      }

      axios
        .post("http://localhost:5001/events/add", newEvent)
        .then(() => {
          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
            resetForm()
          }, 2000)
        })
        .catch((err) => {
          setErrors((prev) => ({
            ...prev,
            form: `Error adding event: ${err.response?.data?.message || err.message}`,
          }))
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      event: "",
      eventDate: "",
      venue: "",
      eventPlanner: "",
      startTime: "",
      endTime: "",
      decorations: "",
      noOfGuests: "",
    })
    setErrors({})
    setSearchTerm("")
    setSearchResults([])
    setSelectedUser(null)
  }

  // Styles
  const styles = {
    pageContainer: {
      display: "flex",
      height: "100vh",
      background: "#f8f9fa",
      marginTop: "6.3rem"
    },
    contentContainer: {
      marginLeft: "250px",
      width: "calc(100% - 250px)",
      padding: "20px",
      overflowY: "auto",
    },
    formContainer: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      padding: "20px",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    formTitle: {
      color: "#0066FF",
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "center",
    },
    formRow: {
      display: "flex",
      gap: "20px",
      marginBottom: "15px",
    },
    formColumn: {
      flex: 1,
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "500",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "10px 15px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "14px",
      transition: "border-color 0.2s",
      boxSizing: "border-box",
    },
    inputError: {
      borderColor: "#FF3366",
    },
    errorText: {
      color: "#FF3366",
      fontSize: "12px",
      marginTop: "4px",
      display: "flex",
      alignItems: "center",
    },
    errorIcon: {
      marginRight: "5px",
      fontSize: "14px",
    },
    searchResults: {
      position: "absolute",
      top: "calc(100% + 5px)",
      left: "0",
      right: "0",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      zIndex: "10",
      maxHeight: "150px",
      overflowY: "auto",
    },
    searchResultItem: {
      padding: "8px 15px",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
      fontSize: "14px",
    },
    submitButton: {
      backgroundColor: "#00CC66",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      width: "100%",
      marginTop: "10px",
    },
    resetButton: {
      backgroundColor: "transparent",
      color: "#0066FF",
      border: "1px solid #0066FF",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "14px",
      cursor: "pointer",
      width: "100%",
      marginTop: "10px",
    },
    successMessage: {
      backgroundColor: "#00CC66",
      color: "#fff",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "15px",
      textAlign: "center",
    },
  }

  return (
    <div style={styles.pageContainer}>
      <SideBar />
      <div style={styles.contentContainer}>
        <div style={styles.formContainer}>
          {showSuccess && <div style={styles.successMessage}>✓ Event Added Successfully!</div>}

          <h2 style={styles.formTitle}>Add New Event</h2>

          <form onSubmit={sendData}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Search Event Planner:</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name"
                  style={{
                    ...styles.input,
                    ...(errors.eventPlanner ? styles.inputError : {}),
                  }}
                />

                {searchResults.length > 0 && (
                  <div style={styles.searchResults}>
                    {searchResults.map((planner) => (
                      <div
                        key={planner._id}
                        style={styles.searchResultItem}
                        onClick={() => handleEventPlannerSelect(planner)}
                      >
                        {planner.Name} - {planner.Email}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.eventPlanner && (
                <div style={styles.errorText}>
                  <span style={styles.errorIcon}>⚠️</span>
                  {errors.eventPlanner}
                </div>
              )}
            </div>

            <div style={styles.formRow}>
              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Name:</label>
                  <input
                    type="text"
                    name="event"
                    value={formData.event}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    style={{
                      ...styles.input,
                      ...(errors.event ? styles.inputError : {}),
                    }}
                  />
                  {errors.event && (
                    <div style={styles.errorText}>
                      <span style={styles.errorIcon}>⚠️</span>
                      {errors.event}
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date:</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.eventDate ? styles.inputError : {}),
                    }}
                  />
                  {errors.eventDate && (
                    <div style={styles.errorText}>
                      <span style={styles.errorIcon}>⚠️</span>
                      {errors.eventDate}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Venue:</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Enter venue"
                    style={{
                      ...styles.input,
                      ...(errors.venue ? styles.inputError : {}),
                    }}
                  />
                  {errors.venue && (
                    <div style={styles.errorText}>
                      <span style={styles.errorIcon}>⚠️</span>
                      {errors.venue}
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Planner:</label>
                  <input
                    type="text"
                    value={formData.eventPlanner}
                    readOnly
                    placeholder="Select an event planner above"
                    style={{
                      ...styles.input,
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Time:</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.time ? styles.inputError : {}),
                    }}
                  />
                </div>
              </div>

              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End Time:</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.time ? styles.inputError : {}),
                    }}
                  />
                </div>
              </div>
            </div>

            {errors.time && (
              <div style={styles.errorText}>
                <span style={styles.errorIcon}>⚠️</span>
                {errors.time}
              </div>
            )}

            <div style={styles.formRow}>
              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Decorations:</label>
                  <input
                    type="text"
                    name="decorations"
                    value={formData.decorations}
                    onChange={handleChange}
                    placeholder="Enter decoration details"
                    style={{
                      ...styles.input,
                      ...(errors.decorations ? styles.inputError : {}),
                    }}
                  />
                  {errors.decorations && (
                    <div style={styles.errorText}>
                      <span style={styles.errorIcon}>⚠️</span>
                      {errors.decorations}
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Number of Guests:</label>
                  <input
                    type="number"
                    name="noOfGuests"
                    value={formData.noOfGuests}
                    onChange={handleChange}
                    placeholder="Enter number of guests"
                    min="1"
                    max="1000"
                    style={{
                      ...styles.input,
                      ...(errors.noOfGuests ? styles.inputError : {}),
                    }}
                  />
                  {errors.noOfGuests && (
                    <div style={styles.errorText}>
                      <span style={styles.errorIcon}>⚠️</span>
                      {errors.noOfGuests}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {errors.form && (
              <div style={styles.errorText}>
                <span style={styles.errorIcon}>⚠️</span>
                {errors.form}
              </div>
            )}

            <div style={styles.formRow}>
              <div style={styles.formColumn}>
                <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? "Adding Event..." : "Add Event"}
                </button>
              </div>

              <div style={styles.formColumn}>
                <button type="button" onClick={resetForm} style={styles.resetButton}>
                  Reset Form
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

