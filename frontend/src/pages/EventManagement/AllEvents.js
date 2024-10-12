import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../../components/SideBar/EventSidebar.js";
import "./AllEvents.css"; // External styles
import logo from '../../images/company.png';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/events/")
      .then((res) => {
        setEvents(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => alert(err.message));
  }, []);

  const handleDeleteClick = (event) => {
    setConfirmDialogData(event);
    setShowConfirmDialog(true);
  };

  const handleDelete = () => {
    if (confirmDialogData) {
      axios
        .delete(`http://localhost:5000/events/${confirmDialogData._id}`)
        .then(() => {
          setAlertMessage("Event deleted successfully!");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          setEvents(events.filter((event) => event._id !== confirmDialogData._id));
        })
        .catch((err) => {
          setAlertMessage("Error deleting event.");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.Event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.Venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.EventPlanner.toLowerCase().includes(searchQuery.toLowerCase()));


  const generateReport = () => {
    const doc = new jsPDF();

    // Add the logo
    doc.addImage(logo, "PNG", 10, 10, 25, 13); // Adjust the dimensions as necessary

    // Add company details below the logo
    doc.setFontSize(8);
    doc.setTextColor(0); // Set a lighter color for professionalism
    doc.text("Cinnomon Red Colombo", 10, 30);
    doc.text("Address :1234 Event St, City, State, ZIP", 10, 35);
    doc.text("Contact :(123) 456-7890", 10, 40);
    doc.text("Email : info@cinnomred.com", 10, 45);

    // Add centered heading
    doc.setFontSize(18);
    doc.setTextColor(0); // Reset text color to black
    const headingY = 60; // Adjusted position for heading
    doc.text("Event Management", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });

    // Draw underline for heading
    const headingWidth = doc.getTextWidth("Event Management"); // Calculate the width of the heading
    const underlineY = headingY + 1; // Position for underline
    doc.setDrawColor(0); // Set color for the underline
    doc.line((doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2), underlineY,
      (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2), underlineY); // Draw line

    // Add a line break
    doc.setFontSize(12);
    doc.text("Report", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" });

    // Define table columns and rows
    const columns = [
      "Event",
      "Date",
      "Venue",
      "Event Planner",
      "Start Time",
      "End Time",
      "Decorations",
      "No. of Guests",
    ];
    const rows = filteredEvents.map((event) => [
      event.Event,
      new Date(event.Date).toLocaleDateString(),
      event.Venue,
      event.EventPlanner,
      event.StartTime,
      event.EndTime,
      event.Decorations,
      event.NoOfGuests,
    ]);

    // Add the table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 80, // Start position after the logo and company details
    });

    // Add a professional ending
    const endingY = doc.internal.pageSize.getHeight() - 30; // Fix position for ending at the bottom
    doc.setFontSize(10);
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" });

    // Add contact number sample below the thank you message
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" });

    // Draw page border
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw a border with 5 unit padding

    // Save the PDF
    doc.save("All_Events_report.pdf");
  };


  return (
    <div>
      <SideBar />

      <div className="content-container">
        <h1 className="page-title">All Events</h1>

        <div className="search-bar-container">
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Event Planner</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Decorations</th>
                <th>No. of Guests</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr key={event._id}>
                    <td>{event.Event}</td>
                    <td>{new Date(event.Date).toLocaleDateString()}</td>
                    <td>{event.Venue}</td>
                    <td>{event.EventPlanner}</td>
                    <td>{event.StartTime}</td>
                    <td>{event.EndTime}</td>
                    <td>{event.Decorations}</td>
                    <td>{event.NoOfGuests}</td>
                    <td>
                      <Link to={`/events/${event._id}`} className="update-button">
                        <FaEdit /> {/* Update icon */}
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteClick(event)} className="delete-button">
                        <FaTrash /> {/* Delete icon */}
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data">
                    No events available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

        {showConfirmDialog && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this event?</p>
              <div className="dialog-buttons">
                <button onClick={handleDelete} className="confirm-delete">
                  Yes, Delete
                </button>
                <button onClick={handleCancel} className="cancel-delete">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="report-button-container">
          <button onClick={generateReport} className="generate-report-button">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

// SearchBar Component
const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <button type="submit">
        <FaSearch />
      </button>
    </div>
  );
};

export default AllEvents;
