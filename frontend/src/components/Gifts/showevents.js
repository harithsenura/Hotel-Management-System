"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { format, isToday, isThisWeek, parseISO } from "date-fns"
import axios from "axios"
import { Calendar, MapPin, Clock, Users, Star, ChevronRight, Search, Filter, X, Heart, Share, ArrowLeft, ShoppingBag } from 'lucide-react'

const ShowEvents = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("today")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVenue, setSelectedVenue] = useState("all")
  const [selectedGiftItem, setSelectedGiftItem] = useState(null)
  const [showGiftModal, setShowGiftModal] = useState(false)

  // Gift items for each event
  const giftItems = [
    { id: 1, name: "Premium Wine Set", price: 120, image: "/wine-gift-set.png", category: "Beverages" },
    { id: 2, name: "Luxury Chocolate Box", price: 65, image: "/placeholder.svg?key=x1hr6", category: "Food" },
    { id: 3, name: "Crystal Vase", price: 180, image: "/crystal-vase.png", category: "Home Decor" },
    { id: 4, name: "Silver Photo Frame", price: 95, image: "/silver-photo-frame.png", category: "Home Decor" },
    { id: 5, name: "Spa Gift Basket", price: 150, image: "/spa-gift-basket.png", category: "Wellness" },
    { id: 6, name: "Gourmet Coffee Set", price: 85, image: "/placeholder.svg?key=ke7rf", category: "Beverages" },
    {
      id: 7,
      name: "Scented Candle Collection",
      price: 70,
      image: "/scented-candle-collection.png",
      category: "Home Decor",
    },
    {
      id: 8,
      name: "Personalized Champagne",
      price: 110,
      image: "/champagne-bottle.png",
      category: "Beverages",
    },
  ]

  // Fetch events from MongoDB
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5001/events/")
        const fetchedEvents = Array.isArray(res.data.data) ? res.data.data : []

        // Add gift options to each event
        const eventsWithGifts = fetchedEvents.map((event) => {
          // Randomly assign 2-4 gift options to each event
          const numGifts = Math.floor(Math.random() * 3) + 2
          const giftOptions = []

          for (let i = 0; i < numGifts; i++) {
            const randomGiftId = Math.floor(Math.random() * giftItems.length) + 1
            if (!giftOptions.includes(randomGiftId)) {
              giftOptions.push(randomGiftId)
            }
          }

          // Add a category field if it doesn't exist
          const category = event.Decorations || "Wedding"

          // Add an image URL if it doesn't exist
          const imageUrl = `/placeholder.svg?height=400&width=600&query=${category} event`

          return {
            ...event,
            GiftOptions: giftOptions,
            Category: category,
            ImageUrl: imageUrl,
          }
        })

        setEvents(eventsWithGifts)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching events:", err)
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleGiftSelect = (event, giftId) => {
    const gift = giftItems.find((item) => item.id === giftId)
    setSelectedGiftItem({
      ...gift,
      event: event.Event,
    })
    setShowGiftModal(true)
  }

  const handleAddToCart = () => {
    // In a real app, you would add to cart in your state management
    setShowGiftModal(false)
    // Show success message
    alert(`${selectedGiftItem.name} has been added to your cart!`)
  }

  const handleViewAllGifts = (eventId) => {
    navigate(`/gifts/select/${eventId}`)
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.Event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.Venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.Category && event.Category.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || event.Category === selectedCategory
    const matchesVenue = selectedVenue === "all" || event.Venue === selectedVenue

    return matchesSearch && matchesCategory && matchesVenue
  })

  // Get unique categories and venues from events for filters
  const categories = [...new Set(events.map((event) => event.Category).filter(Boolean))]
  const venues = [...new Set(events.map((event) => event.Venue).filter(Boolean))]

  // Filter events for today and this week
  const todayEvents = filteredEvents.filter((event) => isToday(parseISO(event.Date)))
  const thisWeekEvents = filteredEvents.filter(
    (event) => isThisWeek(parseISO(event.Date)) && !isToday(parseISO(event.Date)),
  )

  const displayEvents = activeTab === "today" ? todayEvents : thisWeekEvents

  return (
    <div className="show-events-container">
      <style jsx>{`
        /* Global Styles */
        .show-events-container {
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
          color: #333;
        }
        
        /* Header Styles */
        .events-header {
          background-color: #ffffff;
          padding: 1.5rem 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #333;
          font-weight: 500;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50px;
          transition: all 0.2s ease;
        }
        
        .back-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }
        
        .search-filter-container {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .search-bar {
          position: relative;
          flex-grow: 1;
          max-width: 400px;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 50px;
          border: 1px solid #e0e0e0;
          background-color: #f5f5f5;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #dc143c;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }
        
        .filter-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          color: #333;
          padding: 0.75rem 1.25rem;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-button:hover {
          background-color: #eeeeee;
        }
        
        .filter-button.active {
          background-color: #dc143c;
          color: white;
          border-color: #dc143c;
        }
        
        /* Tabs */
        .events-tabs {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .tab-button {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #666;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .tab-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .tab-button.active {
          background-color: #dc143c;
          color: white;
        }
        
        .tab-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        .tab-button.active .tab-count {
          background-color: white;
          color: #dc143c;
        }
        
        /* Filters Panel */
        .filters-panel {
          background-color: white;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .filters-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
        }
        
        .close-filters {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .close-filters:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #333;
        }
        
        .filter-groups {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
        }
        
        .filter-group {
          flex: 1;
          min-width: 200px;
        }
        
        .filter-group-title {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #666;
        }
        
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .filter-option {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
        }
        
        .filter-option:hover {
          background-color: #eeeeee;
        }
        
        .filter-option.selected {
          background-color: #dc143c;
          color: white;
          border-color: #dc143c;
        }
        
        /* Main Content */
        .events-content {
          padding: 2rem;
        }
        
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 1.5rem;
        }
        
        /* Event Card */
        .event-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .event-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .event-card:hover .event-image {
          transform: scale(1.05);
        }
        
        .event-category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background-color: rgba(220, 20, 60, 0.9);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .event-actions {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
        }
        
        .event-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          border: none;
          color: #666;
        }
        
        .event-action-btn:hover {
          transform: scale(1.1);
          color: #dc143c;
        }
        
        .event-content {
          padding: 1.5rem;
        }
        
        .event-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .event-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #dc143c;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .event-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .event-detail {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #666;
          font-size: 0.9rem;
        }
        
        .event-detail-icon {
          color: #888;
        }
        
        .event-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .event-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f0f0f0;
          padding-top: 1.5rem;
        }
        
        .gift-selection-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #666;
          margin: 0;
        }
        
        .gift-selection-items {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        
        .gift-item {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .gift-item:hover {
          border-color: #dc143c;
          transform: scale(1.05);
        }
        
        .gift-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #f5f5f5;
          border: none;
          color: #333;
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .view-all-btn:hover {
          background-color: #eeeeee;
        }
        
        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .empty-state-image {
          max-width: 250px;
          margin-bottom: 1.5rem;
        }
        
        .empty-state-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .empty-state-text {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        /* Gift Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .gift-modal {
          background-color: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .gift-modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .gift-modal-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
        }
        
        .close-modal {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .close-modal:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #333;
        }
        
        .gift-modal-content {
          padding: 1.5rem;
        }
        
        .gift-modal-image {
          width: 100%;
          height: 250px;
          object-fit: contain;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        
        .gift-modal-details {
          margin-bottom: 1.5rem;
        }
        
        .gift-modal-event {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
        
        .gift-modal-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .gift-modal-price {
          font-size: 1.3rem;
          font-weight: 600;
          color: #dc143c;
          margin-bottom: 1rem;
        }
        
        .gift-modal-category {
          display: inline-block;
          background-color: #f5f5f5;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
          color: #666;
        }
        
        .gift-modal-description {
          color: #666;
          line-height: 1.6;
          margin: 1.5rem 0;
        }
        
        .gift-modal-footer {
          padding: 1.5rem;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .add-to-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: #dc143c;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-grow: 1;
          justify-content: center;
        }
        
        .add-to-cart-btn:hover {
          background-color: #b30000;
        }
        
        /* Loading Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(220, 20, 60, 0.2);
          border-radius: 50%;
          border-top-color: #dc143c;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1.5rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
          .events-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }
        
        @media (max-width: 768px) {
          .events-header {
            padding: 1rem;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
          
          .events-content {
            padding: 1rem;
          }
          
          .events-grid {
            grid-template-columns: 1fr;
          }
          
          .filter-groups {
            flex-direction: column;
            gap: 1rem;
          }
        }
        
        @media (max-width: 576px) {
          .header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .search-filter-container {
            width: 100%;
          }
          
          .search-bar {
            max-width: none;
            width: 100%;
          }
          
          .events-tabs {
            width: 100%;
            justify-content: space-between;
          }
          
          .tab-button {
            flex: 1;
            justify-content: center;
            padding: 0.75rem 1rem;
          }
          
          .gift-modal {
            width: 95%;
          }
        }
      `}</style>

      {/* Header */}
      <header className="events-header">
        <div className="header-top">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <h1 className="page-title">Select Your Event</h1>

          <div className="search-filter-container">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search events..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className={`filter-button ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        <div className="events-tabs">
          <button
            className={`tab-button ${activeTab === "today" ? "active" : ""}`}
            onClick={() => setActiveTab("today")}
          >
            <Calendar size={18} />
            Today's Events
            <span className="tab-count">{todayEvents.length}</span>
          </button>

          <button className={`tab-button ${activeTab === "week" ? "active" : ""}`} onClick={() => setActiveTab("week")}>
            <Calendar size={18} />
            This Week
            <span className="tab-count">{thisWeekEvents.length}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="events-content">
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="filters-panel"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-header">
                <h2 className="filters-title">Filter Events</h2>
                <button className="close-filters" onClick={() => setShowFilters(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="filter-groups">
                <div className="filter-group">
                  <h3 className="filter-group-title">Event Type</h3>
                  <div className="filter-options">
                    <div
                      className={`filter-option ${selectedCategory === "all" ? "selected" : ""}`}
                      onClick={() => setSelectedCategory("all")}
                    >
                      All
                    </div>
                    {categories.map((category) => (
                      <div
                        key={category}
                        className={`filter-option ${selectedCategory === category ? "selected" : ""}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <h3 className="filter-group-title">Venue</h3>
                  <div className="filter-options">
                    <div
                      className={`filter-option ${selectedVenue === "all" ? "selected" : ""}`}
                      onClick={() => setSelectedVenue("all")}
                    >
                      All
                    </div>
                    {venues.map((venue) => (
                      <div
                        key={venue}
                        className={`filter-option ${selectedVenue === venue ? "selected" : ""}`}
                        onClick={() => setSelectedVenue(venue)}
                      >
                        {venue}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : displayEvents.length > 0 ? (
          <div className="events-grid">
            {displayEvents.map((event) => (
              <motion.div
                key={event._id}
                className="event-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="event-image-container">
                  
                  <div className="event-category">{event.Category || event.Decorations || "Event"}</div>
                  <div className="event-actions">
                    <button className="event-action-btn">
                      <Heart size={18} />
                    </button>
                    <button className="event-action-btn">
                      <Share size={18} />
                    </button>
                  </div>
                </div>

                <div className="event-content">
                  <h2 className="event-title">{event.Event}</h2>
                  <div className="event-date">
                    <Calendar size={18} />
                    {format(parseISO(event.Date), "MMMM d, yyyy")}
                  </div>

                  <div className="event-details">
                    <div className="event-detail">
                      <MapPin size={18} className="event-detail-icon" />
                      <span>{event.Venue}</span>
                    </div>
                    <div className="event-detail">
                      <Clock size={18} className="event-detail-icon" />
                      <span>
                        {event.StartTime} - {event.EndTime}
                      </span>
                    </div>
                    <div className="event-detail">
                      <Users size={18} className="event-detail-icon" />
                      <span>{event.NoOfGuests} Guests</span>
                    </div>
                    <div className="event-detail">
                      <Star size={18} className="event-detail-icon" />
                      <span>Planner: {event.EventPlanner}</span>
                    </div>
                  </div>

                  <p className="event-description">
                    {event.Description ||
                      `A beautiful ${event.Category || event.Decorations || "event"} with elegant decorations and a wonderful atmosphere.`}
                  </p>

                  <div className="event-footer">
                    <div>
                      <h3 className="gift-selection-title">Gift Options</h3>
                      
                    </div>

                    <button className="view-all-btn" onClick={() => handleViewAllGifts(event._id)}>
                      View All <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <img src="/empty-calendar-illustration.png" alt="No events found" className="empty-state-image" />
            <h2 className="empty-state-title">No events found</h2>
            <p className="empty-state-text">
              {activeTab === "today"
                ? "There are no events scheduled for today that match your criteria."
                : "There are no events scheduled for this week that match your criteria."}
            </p>
            <button
              className="view-all-btn"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedVenue("all")
              }}
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </main>

      {/* Gift Modal */}
      <AnimatePresence>
        {showGiftModal && selectedGiftItem && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGiftModal(false)}
          >
            <motion.div
              className="gift-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gift-modal-header">
                <h2 className="gift-modal-title">Gift Details</h2>
                <button className="close-modal" onClick={() => setShowGiftModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="gift-modal-content">
                <img
                  src={selectedGiftItem.image || "/placeholder.svg"}
                  alt={selectedGiftItem.name}
                  className="gift-modal-image"
                />

                <div className="gift-modal-details">
                  <div className="gift-modal-event">For: {selectedGiftItem.event}</div>
                  <h3 className="gift-modal-name">{selectedGiftItem.name}</h3>
                  <div className="gift-modal-price">${selectedGiftItem.price.toFixed(2)}</div>
                  <div className="gift-modal-category">{selectedGiftItem.category}</div>
                </div>

                <p className="gift-modal-description">
                  This premium gift is perfect for the occasion. It will be beautifully wrapped and delivered to the
                  event venue or directly to the recipient's address of choice.
                </p>
              </div>

              <div className="gift-modal-footer">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShowEvents
