import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import SideBar from "../../components/SideBar/EventSidebar";

export default function Dashboard() {
  const [events, setEvents] = useState([]); // Ensure it's initialized as an empty array

  useEffect(() => {
    // Fetch the events data
    axios.get("http://localhost:5000/events")
      .then(response => {
        // Access the correct property of the response
        if (Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setEvents([]); // Set to an empty array if not
        }
      })
      .catch(err => {
        console.error("Error fetching events: ", err);
        setEvents([]); // Optional: Clear events on error
      });
  }, []);

  // Helper function to check if the event is in the current month
  const isCurrentMonth = (eventDate) => {
    const event = new Date(eventDate);
    const today = new Date();

    console.log("Event Month:", event.getMonth(), "Event Year:", event.getFullYear());
    console.log("Current Month:", today.getMonth(), "Current Year:", today.getFullYear());

    return event.getMonth() === today.getMonth() && event.getFullYear() === today.getFullYear();
  };

  // Filter the events for the current month and upcoming events
  const currentMonthEvents = events.filter(event => isCurrentMonth(event.Date));
  const upcomingEvents = events.filter(event => !isCurrentMonth(event.Date) && new Date(event.Date) > new Date());

  return (
    <div>
      <SideBar/>
      <div className="dashboard-container">
        {/* Current Month Section */}
        <div className="event-section current-month">
          <h2>Current Month</h2>
          <table className="event-table-current">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event Type</th>
                <th>Name</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthEvents.length > 0 ? (
                currentMonthEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{new Date(event.Date).toLocaleDateString()}</td>
                    <td>{event.Event}</td>
                    <td>{event.EventPlanner}</td>
                    <td>{event.Venue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No events this month</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Upcoming Events Section */}
        <div className="event-section upcoming">
          <h2>Upcoming</h2>
          <table className="event-table-upcomming">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event Type</th>
                <th>Name</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{new Date(event.Date).toLocaleDateString()}</td>
                    <td>{event.Event}</td>
                    <td>{event.EventPlanner}</td>
                    <td>{event.Venue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No upcoming events</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
