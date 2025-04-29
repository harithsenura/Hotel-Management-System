"use client"

import { useState, useEffect } from "react"
import { FaUsers, FaUserTie, FaMoneyBillWave, FaUtensils, FaCocktail, FaCalendarAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

// Dashboard component
const Dashboard = () => {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [activeCard, setActiveCard] = useState(null)
  const [currentEvents, setCurrentEvents] = useState([
    { id: 1, name: "Corporate Gala", date: "May 15, 2023", venue: "Grand Ballroom", planner: "John Smith" },
    { id: 2, name: "Wedding Reception", date: "May 22, 2023", venue: "Garden Terrace", planner: "Emma Johnson" },
    { id: 3, name: "Product Launch", date: "May 28, 2023", venue: "Conference Center", planner: "Michael Brown" },
  ])

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 4, name: "Charity Fundraiser", date: "June 5, 2023", venue: "Lakeside Pavilion", planner: "Sarah Davis" },
    { id: 5, name: "Tech Conference", date: "June 12, 2023", venue: "Innovation Hub", planner: "David Wilson" },
    { id: 6, name: "Anniversary Party", date: "June 18, 2023", venue: "Skyline Lounge", planner: "Lisa Thompson" },
  ])

  useEffect(() => {
    setLoaded(true)

    // Simulate cards appearing one by one
    const timer = setTimeout(() => {
      setActiveCard("all")
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Enhanced Card component with hover effect and icon
  const Card = ({ title, content, Icon, onClick, index }) => {
    const [hovered, setHovered] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(activeCard === "all" || activeCard === index)
      }, index * 150) // Staggered animation

      return () => clearTimeout(timer)
    }, [activeCard, index])

    return (
      <div
        className={`dashboard-card ${visible ? "visible" : ""} ${hovered ? "hovered" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <div className={`icon-container ${hovered ? "hovered" : ""}`}>
          <Icon className="card-icon" />
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-content">{content}</p>
        <div className="card-badge">Manage</div>
      </div>
    )
  }

  return (
    <div className={`dashboard-wrapper ${loaded ? "loaded" : ""}`}>
      <div className="title-bar">
        <h1 className="title-text">Admin Dashboard</h1>
      </div>

      <div className="dashboard-container">
        {/* Cards Grid */}
        <div className="cards-grid">
          <Card
            title="Customer Management"
            content="View and manage customer profiles, preferences, and history"
            Icon={FaUsers}
            onClick={() => navigate("/cuslogin")}
            index={0}
          />
          <Card
            title="Employee Management"
            content="Handle staff scheduling, performance, and records"
            Icon={FaUserTie}
            onClick={() => navigate("/LoginChoose")}
            index={1}
          />
          <Card
            title="Finance Management"
            content="Monitor revenue, expenses, and generate reports"
            Icon={FaMoneyBillWave}
            onClick={() => navigate("/finance/login")}
            index={2}
          />
          <Card
            title="Restaurant Management"
            content="Manage menus, tables, orders, and kitchen operations"
            Icon={FaUtensils}
            onClick={() => navigate("/dashboard")}
            index={3}
          />
          <Card
            title="Bar Management"
            content="Track inventory, cocktail menus, and bar operations"
            Icon={FaCocktail}
            onClick={() => navigate("/barlogin")}
            index={4}
          />
          <Card
            title="Event Management"
            content="Schedule, organize, and manage special events"
            Icon={FaCalendarAlt}
            onClick={() => navigate("/eventlogin")}
            index={5}
          />
        </div>

        {/* Event Dashboard Section */}
        <div className="events-dashboard">
          <div className="event-section current-month">
            <h2 className="section-title">Current Month Events</h2>
            <div className="table-container">
              <table className="event-table-current">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Event Planner</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEvents.map((event) => (
                    <tr key={event.id} className="event-row">
                      <td>{event.name}</td>
                      <td>{event.date}</td>
                      <td>{event.venue}</td>
                      <td>{event.planner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="event-section upcoming">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="table-container">
              <table className="event-table-upcomming">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Event Planner</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((event) => (
                    <tr key={event.id} className="event-row">
                      <td>{event.name}</td>
                      <td>{event.date}</td>
                      <td>{event.venue}</td>
                      <td>{event.planner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Ultra Modern Dashboard Styles with White, Green, and Blue */
        :root {
          --primary: #0ea5e9; /* Blue */
          --primary-light: #e0f2fe;
          
          --secondary: #10b981; /* Green */
          --secondary-light: #d1fae5;
          
          --white: #ffffff;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
          --gray-900: #111827;
          
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(0, 0, 0, 0.02);
          --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.03), 0 10px 10px rgba(0, 0, 0, 0.02);
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background: var(--white);
          color: var(--gray-800);
          min-height: 100vh;
        }
        
        .title-bar {
          
          padding: 1.25rem 2rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .title-text {
          color: black;
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: 0.5px;
        }
        
        .dashboard-wrapper {
          min-height: 100vh;
          padding-top: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          background: var(--white);
        }
        
        .dashboard-wrapper.loaded {
          opacity: 1;
          transform: translateY(0);
        }
        
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding-bottom: 2rem;
        }
        
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 7rem;

        }
        
        .dashboard-card {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          height: 100%;
          min-height: 250px;
        }
        
        .dashboard-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .dashboard-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .dashboard-card.hovered {
          transform: translateY(-10px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-light);
        }
        
        .dashboard-card.hovered::before {
          transform: scaleX(1);
        }
        
        .dashboard-card:nth-child(even)::before {
          background: var(--secondary);
        }
        
        .icon-container {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: var(--primary-light);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
          box-shadow: 0 4px 10px rgba(14, 165, 233, 0.1);
        }
        
        .dashboard-card:nth-child(even) .icon-container {
          background: var(--secondary-light);
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.1);
        }
        
        .icon-container.hovered {
          transform: scale(1.1);
          background: var(--primary);
        }
        
        .dashboard-card:nth-child(even) .icon-container.hovered {
          background: var(--secondary);
        }
        
        .card-icon {
          font-size: 32px;
          color: var(--primary);
          transition: color 0.3s ease;
        }
        
        .dashboard-card:nth-child(even) .card-icon {
          color: var(--secondary);
        }
        
        .icon-container.hovered .card-icon {
          color: var(--white);
        }
        
        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 0.75rem;
          transition: color 0.3s ease;
        }
        
        .dashboard-card.hovered .card-title {
          color: var(--primary);
        }
        
        .dashboard-card:nth-child(even).hovered .card-title {
          color: var(--secondary);
        }
        
        .card-content {
          font-size: 0.875rem;
          color: var(--gray-600);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex-grow: 1;
        }
        
        .card-badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 8px;
          background-color: var(--primary-light);
          color: var(--primary);
          transition: all 0.3s ease;
        }
        
        .dashboard-card:nth-child(even) .card-badge {
          background-color: var(--secondary-light);
          color: var(--secondary);
        }
        
        .dashboard-card.hovered .card-badge {
          background: var(--primary);
          color: var(--white);
          transform: scale(1.05);
        }
        
        .dashboard-card:nth-child(even).hovered .card-badge {
          background: var(--secondary);
          color: var(--white);
        }
        
        /* Events Dashboard Styles */
        .events-dashboard {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .event-section {
          background-color: var(--white);
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid var(--gray-100);
        }
        
        .event-section:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-light);
        }
        
        .current-month {
          border-top: 4px solid var(--primary);
        }
        
        .upcoming {
          border-top: 4px solid var(--secondary);
        }
        
        .section-title {
          padding: 1.25rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-800);
          background-color: var(--white);
          border-bottom: 1px solid var(--gray-200);
        }
        
        .current-month .section-title {
          color: var(--primary);
        }
        
        .upcoming .section-title {
          color: var(--secondary);
        }
        
        .table-container {
          padding: 1rem;
          overflow-x: auto;
        }
        
        .event-table-current,
        .event-table-upcomming {
          width: 100%;
          border-collapse: collapse;
        }
        
        .event-table-current th,
        .event-table-upcomming th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-700);
          border-bottom: 2px solid var(--gray-200);
        }
        
        .event-table-current th {
          color: var(--primary);
        }
        
        .event-table-upcomming th {
          color: var(--secondary);
        }
        
        .event-table-current td,
        .event-table-upcomming td {
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: var(--gray-700);
          border-bottom: 1px solid var(--gray-200);
        }
        
        .event-row {
          transition: background-color 0.2s ease;
        }
        
        .event-row:hover {
          background-color: var(--gray-50);
        }
        
        /* Responsive Adjustments */
        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
          }
          
          .events-dashboard {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 640px) {
          .title-text {
            font-size: 1.5rem;
          }
          
          .dashboard-wrapper {
            padding-top: 6rem;
          }
          
          .cards-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(6, 1fr);
          }
        }
        
        /* Animation Keyframes */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        /* Card hover animation */
        .dashboard-card:hover .icon-container {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default Dashboard

