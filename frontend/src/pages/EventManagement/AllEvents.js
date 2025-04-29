import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash, FaFilePdf, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdLocationOn, MdPeople, MdAccessTime } from "react-icons/md";
import { RiUserStarFill } from "react-icons/ri";
import { GiPartyPopper } from "react-icons/gi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../../components/SideBar/EventSidebar.js";
import "./AllEvents.css";
import logo from '../../images/company.png';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5001/events/");
        setEvents(Array.isArray(res.data.data) ? res.data.data : []);
        setIsLoading(false);
      } catch (err) {
        alert(err.message);
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const handleDeleteClick = (event) => {
    setConfirmDialogData(event);
    setShowConfirmDialog(true);
  };

  const handleDelete = async () => {
    if (confirmDialogData) {
      try {
        await axios.delete(`http://localhost:5001/events/${confirmDialogData._id}`);
        setAlertMessage("Event deleted successfully!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setEvents(events.filter((event) => event._id !== confirmDialogData._id));
      } catch (err) {
        setAlertMessage("Error deleting event.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
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
      event.EventPlanner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateReport = () => {
    const doc = new jsPDF();

    // Add the logo
    doc.addImage(logo, "PNG", 10, 10, 25, 13);

    // Add company details
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("Cinnomon Red Colombo", 10, 30);
    doc.text("Address :1234 Event St, City, State, ZIP", 10, 35);
    doc.text("Contact :(123) 456-7890", 10, 40);
    doc.text("Email : info@cinnomred.com", 10, 45);

    // Add centered heading
    doc.setFontSize(18);
    doc.setTextColor(0);
    const headingY = 60;
    doc.text("Event Management", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });

    // Draw underline for heading
    const headingWidth = doc.getTextWidth("Event Management");
    const underlineY = headingY + 1;
    doc.setDrawColor(0);
    doc.line((doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2), underlineY,
      (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2), underlineY);

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
      startY: 80,
      styles: {
        cellPadding: 5,
        fontSize: 10,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Add footer
    const endingY = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(10);
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" });
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" });

    // Draw page border
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Save the PDF
    doc.save("All_Events_report.pdf");
  };

  return (
    <div className="all-events-container">
      <SideBar />

      <div className="content-container">
        <motion.div 
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="page-title">Event Management</h1>
          <p className="page-subtitle">View and manage all scheduled events</p>
        </motion.div>

        <motion.div 
          className="action-bar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
          <button onClick={generateReport} className="generate-report-button">
            <FaFilePdf /> Generate Report
          </button>
        </motion.div>

        {isLoading ? (
          <motion.div 
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </motion.div>
        ) : (
          <motion.div
            className="events-table-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredEvents.length > 0 ? (
              <>
                <table className="events-table">
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>Event</th>
                      <th style={{ width: '12%' }}>Date</th>
                      <th style={{ width: '15%' }}>Venue</th>
                      <th style={{ width: '12%' }}>Planner</th>
                      <th style={{ width: '14%' }}>Time</th>
                      <th style={{ width: '10%' }}>Status</th>
                      <th style={{ width: '7%' }}>Guests</th>
                      <th style={{ width: '15%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvents.map((event) => (
                      <motion.tr 
                        key={event._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="event-name-cell">
                          {event.Event}
                          {event.Decorations && (
                            <div className="decorations-tag">{event.Decorations}</div>
                          )}
                        </td>
                        <td className="event-date-cell">
                          {new Date(event.Date).toLocaleDateString()}
                        </td>
                        <td>{event.Venue}</td>
                        <td>{event.EventPlanner}</td>
                        <td className="event-time-cell">
                          <MdAccessTime />
                          {event.StartTime} - {event.EndTime}
                        </td>
                        <td>
                          <span className="status-badge status-active">
                            Active
                          </span>
                        </td>
                        <td>{event.NoOfGuests}</td>
                        <td>
                          <div className="table-actions">
                            <Link 
                              to={`/events/${event._id}`} 
                              className="table-action-btn view"
                              title="View Details"
                            >
                              <FaEye />
                            </Link>
                            <Link 
                              to={`/events/edit/${event._id}`} 
                              className="table-action-btn edit"
                              title="Edit Event"
                            >
                              <FaEdit />
                            </Link>
                            <button 
                              onClick={() => handleDeleteClick(event)} 
                              className="table-action-btn delete"
                              title="Delete Event"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="table-footer">
                    <div>Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events</div>
                    <div className="pagination">
                      <button 
                        className="pagination-btn" 
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <FaChevronLeft />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      ))}
                      <button 
                        className="pagination-btn" 
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                className="table-empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img src="https://cdn.dribbble.com/users/1175431/screenshots/6188233/media/ad42057889c385dd8f84f6f7554a3e5f.png" 
                     alt="No events found" 
                     className="no-events-image" />
                <h3>No events found</h3>
                <p>Try adjusting your search or add a new event</p>
              </motion.div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {showAlert && (
            <motion.div
              className="alert"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {showConfirmDialog && (
          <motion.div 
            className="confirm-dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="confirm-dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete the event "{confirmDialogData?.Event}"?</p>
              <div className="dialog-buttons">
                <button onClick={handleDelete} className="confirm-delete">
                  Delete
                </button>
                <button onClick={handleCancel} className="cancel-delete">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
    </div>
  );
};

export default AllEvents;