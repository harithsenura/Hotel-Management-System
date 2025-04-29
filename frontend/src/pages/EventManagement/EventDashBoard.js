import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SideBar from "../../components/SideBar/EventSidebar";
import { 
  FaCalendarAlt, 
  FaCalendarPlus, 
  FaRegClock, 
  FaMapMarkerAlt, 
  FaUserTie,
  FaExclamationTriangle 
} from "react-icons/fa";
import "./EventDashBoard.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5001/events");
        if (Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching events: ", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const isCurrentMonth = (eventDate) => {
    const event = new Date(eventDate);
    const today = new Date();
    return event.getMonth() === today.getMonth() && 
           event.getFullYear() === today.getFullYear();
  };

  const currentMonthEvents = events.filter(event => isCurrentMonth(event.Date));
  const upcomingEvents = events.filter(event => !isCurrentMonth(event.Date) && 
                        new Date(event.Date) > new Date());

  // Sort events by date
  const sortedCurrentMonthEvents = [...currentMonthEvents].sort((a, b) => 
    new Date(a.Date) - new Date(b.Date));
  const sortedUpcomingEvents = [...upcomingEvents].sort((a, b) => 
    new Date(a.Date) - new Date(b.Date));

  // Calculate statistics
  const totalEvents = events.length;
  const thisMonthCount = currentMonthEvents.length;
  const upcomingCount = upcomingEvents.length;
  
  // Get closest event
  const getClosestEvent = () => {
    const futureEvents = events.filter(event => new Date(event.Date) > new Date());
    if (futureEvents.length === 0) return null;
    
    return futureEvents.reduce((closest, event) => {
      if (!closest) return event;
      return new Date(event.Date) < new Date(closest.Date) ? event : closest;
    }, null);
  };
  
  const closestEvent = getClosestEvent();
  const daysUntilClosest = closestEvent ? 
    Math.ceil((new Date(closestEvent.Date) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  if (isLoading) {
    return (
      <div className="dashboard-wrapper">
        <SideBar />
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <SideBar />
        <div className="dashboard-container">
          <div className="error-container">
            <FaExclamationTriangle className="error-icon" />
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get a random gradient based on event type
  const getEventGradient = (eventType) => {
    const type = eventType.toLowerCase();
    switch(type) {
      case 'wedding': 
        return 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)';
      case 'corporate': 
        return 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)';
      case 'birthday': 
        return 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)';
      case 'conference': 
        return 'linear-gradient(to right, #84fab0 0%, #8fd3f4 100%)';
      default: 
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return (
    <div className="dashboard-wrapper">
      <SideBar />
      <div className="dashboard-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="dashboard-header"
        >
          <div className="header-content">
            <h1>Event Dashboard</h1>
            <p className="dashboard-summary">
              Manage and monitor all your upcoming events
            </p>
          </div>
          
          <div className="header-date">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="stats-container"
        >
          <div className="stat-card">
            <div className="stat-icon total">
              <FaCalendarAlt />
            </div>
            <div className="stat-details">
              <h3>Total Events</h3>
              <p className="stat-value">{totalEvents}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon current">
              <FaCalendarAlt />
            </div>
            <div className="stat-details">
              <h3>This Month</h3>
              <p className="stat-value">{thisMonthCount}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon upcoming">
              <FaCalendarPlus />
            </div>
            <div className="stat-details">
              <h3>Upcoming</h3>
              <p className="stat-value">{upcomingCount}</p>
            </div>
          </div>
          
          {closestEvent && (
            <div className="stat-card next-event">
              <div className="stat-icon next">
                <FaRegClock />
              </div>
              <div className="stat-details">
                <h3>Next Event</h3>
                <p className="stat-value">{daysUntilClosest} days</p>
                <p className="stat-description">{closestEvent.Event}</p>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="tabs-container"
        >
          <button 
            className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Current Month Events
            <span className="tab-badge">{currentMonthEvents.length}</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
            <span className="tab-badge">{upcomingEvents.length}</span>
          </button>
        </motion.div>

        {/* Event Tables */}
        {activeTab === 'current' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="event-section"
          >  
            <div className="table-container">
              {sortedCurrentMonthEvents.length > 0 ? (
                <table className="event-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Event Type</th>
                      <th>Event Planner</th>
                      <th>Venue</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCurrentMonthEvents.map((event, index) => (
                      <tr key={`current-${index}`}>
                        <td>
                          <div className="date-cell">
                            <div className="date-icon">
                              <FaCalendarAlt />
                            </div>
                            <div className="date-text">
                              {new Date(event.Date).toLocaleDateString('en-US', { 
                                month: 'short', day: 'numeric', year: 'numeric' 
                              })}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="event-type-pill"
                            style={{ 
                              background: getEventGradient(event.Event)
                            }}
                          >
                            {event.Event}
                          </span>
                        </td>
                        <td>
                          <div className="planner-cell">
                            <div className="planner-icon">
                              <FaUserTie />
                            </div>
                            <div>{event.EventPlanner}</div>
                          </div>
                        </td>
                        <td>
                          <div className="venue-cell">
                            <div className="venue-icon">
                              <FaMapMarkerAlt />
                            </div>
                            <div>{event.Venue}</div>
                          </div>
                        </td>
                        <td>
                          <span className="status-badge active">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FaCalendarAlt />
                  </div>
                  <h3>No events this month</h3>
                  <p>There are no events scheduled for the current month</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {activeTab === 'upcoming' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="event-section"
          >  
            <div className="table-container">
              {sortedUpcomingEvents.length > 0 ? (
                <table className="event-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Event Type</th>
                      <th>Event Planner</th>
                      <th>Venue</th>
                      <th>Days Until</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUpcomingEvents.map((event, index) => {
                      const daysUntil = Math.ceil(
                        (new Date(event.Date) - new Date()) / (1000 * 60 * 60 * 24)
                      );
                      
                      return (
                        <tr key={`upcoming-${index}`}>
                          <td>
                            <div className="date-cell">
                              <div className="date-icon">
                                <FaCalendarAlt />
                              </div>
                              <div className="date-text">
                                {new Date(event.Date).toLocaleDateString('en-US', { 
                                  month: 'short', day: 'numeric', year: 'numeric' 
                                })}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span 
                              className="event-type-pill"
                              style={{ 
                                background: getEventGradient(event.Event)
                              }}
                            >
                              {event.Event}
                            </span>
                          </td>
                          <td>
                            <div className="planner-cell">
                              <div className="planner-icon">
                                <FaUserTie />
                              </div>
                              <div>{event.EventPlanner}</div>
                            </div>
                          </td>
                          <td>
                            <div className="venue-cell">
                              <div className="venue-icon">
                                <FaMapMarkerAlt />
                              </div>
                              <div>{event.Venue}</div>
                            </div>
                          </td>
                          <td>
                            <span className="days-badge">
                              {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FaCalendarPlus />
                  </div>
                  <h3>No upcoming events</h3>
                  <p>There are no events scheduled for future months</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}