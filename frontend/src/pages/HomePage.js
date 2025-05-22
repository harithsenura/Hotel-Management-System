"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUser, logout } from "../services/userService" // Import your existing user service
import api from "../services/api" // Import the custom API service we created earlier
import companylogo from "../images/company.png"
import headingImage from "../images/bg1.JPG"
import { ChevronRight, Gift, Users, Utensils, Calendar, LogOut, Package, User } from "lucide-react"
import Gifts from "../images/gift.jpg"

const HomePage = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isLoading, setIsLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [user, setUser] = useState(null)
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false)
  const [rooms, setRooms] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [showFoodLoginRequiredModal, setShowFoodLoginRequiredModal] = useState(false)
  const [currentImageIndices, setCurrentImageIndices] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Get user from localStorage using your service
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getUser()
      if (currentUser && (currentUser._id || currentUser.id)) {
        setUser(currentUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    }

    // Check auth on initial load
    checkAuth()

    // Set up an interval to periodically check auth status
    const authCheckInterval = setInterval(checkAuth, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(authCheckInterval)
  }, [])

  // Handle scroll events for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = ["home", "novelty", "food", "features", "contact"]
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  // Update the useEffect for fetching rooms to use our API service
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setRoomsLoading(true)

        // Use our custom API service instead of axios directly
        // This will handle CORS headers properly
        const response = await api.get("/room/")

        // Only get 3 rooms for the preview section
        const roomsData = response.data.slice(0, 3)
        setRooms(roomsData)

        // Initialize image indices
        const initialIndices = {}
        roomsData.forEach((room) => {
          initialIndices[room._id] = 0
        })
        setCurrentImageIndices(initialIndices)

        setRoomsLoading(false)
      } catch (error) {
        console.error("Error fetching rooms:", error)
        // Set empty rooms array on error to avoid showing loading indefinitely
        setRooms([])
        setRoomsLoading(false)
      }
    }

    fetchRooms()
  }, [])

  useEffect(() => {
    // Set up image rotation for rooms with multiple images
    const imageRotationInterval = setInterval(() => {
      if (rooms.length > 0) {
        setCurrentImageIndices((prevIndices) => {
          const newIndices = { ...prevIndices }

          rooms.forEach((room) => {
            const images = getRoomImageUrl(room)
            if (images.length > 1) {
              const currentIndex = prevIndices[room._id] || 0
              // Randomly select a different index than the current one
              let newIndex
              do {
                newIndex = Math.floor(Math.random() * images.length)
              } while (newIndex === currentIndex && images.length > 1)

              newIndices[room._id] = newIndex
            }
          })

          return newIndices
        })
      }
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(imageRotationInterval)
  }, [rooms])

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      // Show login popup message if user is not logged in
      setShowFoodLoginRequiredModal(true)
    } else {
      navigate("/home") // Navigate to the items page
    }
  }

  const handleLoginClick = () => {
    setShowModal(true)
  }

  const handleAdminLogin = () => {
    navigate("/adminpannel")
  }

  const handleCustomerLogin = () => {
    navigate("/login")
  }

  const handleGiftSelection = () => {
    if (!isAuthenticated) {
      // Show login popup message
      setShowLoginRequiredModal(true)
    } else {
      navigate("/gifts/showevents")
    }
  }

  const handleLogout = () => {
    logout() // Use your logout function
    setUser(null)
    setIsAuthenticated(false)
    setShowUserMenu(false)
    navigate("/")
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  // Get user's first initial
  const getUserInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase()
    }
    return "U"
  }

  // Animation for cards on hover
  const handleCardHover = (e, isHovering) => {
    const card = e.currentTarget
    const image = card.querySelector(".card-image")
    const content = card.querySelector(".card-content")

    if (isHovering) {
      card.style.transform = "translateY(-10px)"
      image.style.transform = "scale(1.1)"
      content.style.backgroundColor = "#f8f9fa"
    } else {
      card.style.transform = "translateY(0)"
      image.style.transform = "scale(1.0)"
      content.style.backgroundColor = "#ffffff"
    }
  }

  // Add this function to handle navigation to all rooms page
  const handleViewAllRooms = () => {
    navigate("/all-rooms")
  }

  // Add this function to get status style (similar to what you have in room-list.tsx)
  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return { color: "green" }
      case "Reserved":
        return { color: "blue" }
      case "Booked":
        return { color: "red" }
      default:
        return {}
    }
  }

  // Update the room image handling function to use the API_BASE_URL from our api service
  const getRoomImageUrl = (room) => {
    const API_BASE_URL =
      process.env.NODE_ENV === "production"
        ? "https://welcoming-wisdom-production.up.railway.app"
        : "http://localhost:5001"

    if (room.images && room.images.length > 0) {
      // If room has multiple images, return the array of image URLs
      return room.images.map((img) => `${API_BASE_URL}${img}`)
    } else if (room.image) {
      // For backward compatibility with rooms that have a single image
      return [`${API_BASE_URL}${room.image}`]
    }
    return [`/placeholder.svg?height=300&width=400&query=luxury ${room.roomType} hotel room`]
  }

  // Handle profile navigation
  const handleProfileClick = () => {
    navigate("/profile")
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <div className="loading-text">Welcome to Cinnamon Red</div>
      </div>
    )
  }

  return (
    <div className="home-container">
      {/* The rest of your component remains the same */}
      <style jsx>{`
        /* Your existing styles remain the same */
      `}</style>

      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <img
          src={companylogo || "/placeholder.svg?height=50&width=150&query=hotel logo"}
          alt="Cinnamon Red Hotel"
          className="logo"
        />

        <div className="nav-links">
          <a href="#home" className={`nav-link ${activeSection === "home" ? "active" : ""}`}>
            Home
          </a>
          <a href="#novelty" className={`nav-link ${activeSection === "novelty" ? "active" : ""}`}>
            Gift Selection
          </a>
          <a href="#food" className={`nav-link ${activeSection === "food" ? "active" : ""}`}>
            Food
          </a>
          <a href="#features" className={`nav-link ${activeSection === "features" ? "active" : ""}`}>
            Features
          </a>
          <a href="#contact" className={`nav-link ${activeSection === "contact" ? "active" : ""}`}>
            Contact
          </a>
        </div>

        {isAuthenticated ? (
          <div style={{ position: "relative" }}>
            <div className="user-avatar" onClick={toggleUserMenu}>
              {getUserInitial()}
            </div>

            {showUserMenu && (
              <div className="user-menu">
                <div className="user-menu-item">
                  <span>Signed in as</span>
                </div>
                <div className="user-menu-item" style={{ fontWeight: "bold" }}>
                  {user.name}
                </div>
                <div className="user-menu-divider"></div>
                <div className="user-menu-item" onClick={handleGiftSelection}>
                  <Gift size={16} />
                  Gift Selection
                </div>
                <div className="user-menu-item" onClick={() => navigate("/gifts/ordered")}>
                  <Package size={16} />
                  Ordered Gifts
                </div>
                <div className="user-menu-item" onClick={handleProfileClick}>
                  <User size={16} />
                  My Profile
                </div>
                <div className="user-menu-item" onClick={() => navigate("/orders")}>
                  <Package size={16} />
                  My Orders
                </div>
                <div className="user-menu-divider"></div>
                <div className="user-menu-item" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <img
          src={headingImage || "/placeholder.svg?height=1080&width=1920&query=luxury hotel view"}
          alt="Cinnamon Red Hotel"
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">Experience Luxury & Comfort</h1>
          <p className="hero-subtitle">
            Welcome to Cinnamon Red Hotel, where exceptional service meets modern elegance. Create unforgettable
            memories with us.
          </p>
          <button className="hero-btn" onClick={handleOrderClick}>
            Explore Now
          </button>
        </div>
      </section>

      {/* Novelty Gift Selection Section */}
      <section id="novelty" className="novelty-section">
        <div className="novelty-container">
          <div className="novelty-content">
            <h2 className="novelty-title">Wedding Gift Selection</h2>
            <p className="novelty-text">
              Make your special day even more memorable with our exclusive Wedding Gift Selection service. Guests
              attending your wedding or event can conveniently select and purchase gifts through our website, ensuring
              you receive exactly what you desire.
            </p>
            <div className="novelty-features">
              <div className="novelty-feature">
                <div className="feature-icon">
                  <Gift size={20} />
                </div>
                <div className="feature-text">Curated gift collections for every taste</div>
              </div>
              <div className="novelty-feature">
                <div className="feature-icon">
                  <Users size={20} />
                </div>
                <div className="feature-text">Easy access for all your guests</div>
              </div>
              <div className="novelty-feature">
                <div className="feature-icon">
                  <Calendar size={20} />
                </div>
                <div className="feature-text">Perfect for weddings and special events</div>
              </div>
            </div>
            <button className="novelty-btn" onClick={handleGiftSelection}>
              Explore Gift Selection <ChevronRight size={18} />
            </button>
          </div>
          <div className="novelty-image-container">
            <img src={Gifts || "/placeholder.svg"} alt="Wedding Gift Selection" className="novelty-image" />
            <div className="novelty-badge">
              <span>NEW</span>
              <span>Feature</span>
            </div>
          </div>
        </div>
      </section>

      {/* Food Order Section */}
      <section id="food" className="food-order">
        <div className="food-order-content">
          <h2 className="section-title">Exquisite Dining Experience</h2>
          <p className="section-text">
            Indulge in a wide variety of gourmet dishes from our exclusive menu. Our expert chefs craft culinary
            masterpieces using the finest ingredients, delivering an unforgettable dining experience whether in your
            room or at our elegant restaurant.
          </p>
          <button className="order-btn" onClick={handleOrderClick}>
            Order Food Now <Utensils size={18} />
          </button>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="rooms-section">
        <div className="rooms-header">
          <h2 className="section-title">Luxurious Accommodations</h2>
          <p className="section-text">
            Experience the perfect blend of comfort and elegance in our thoughtfully designed rooms and suites. Each
            space is crafted to provide you with an unforgettable stay.
          </p>
        </div>

        <div className="rooms-container">
          {roomsLoading ? (
            <div className="rooms-loading">
              <div className="loading-spinner"></div>
              <p>Loading rooms...</p>
            </div>
          ) : rooms.length > 0 ? (
            rooms.map((room) => (
              <div className="room-card" key={room._id} onClick={() => navigate(`/room/${room._id}`)}>
                <div className="room-image-container">
                  <img
                    src={
                      Array.isArray(getRoomImageUrl(room))
                        ? getRoomImageUrl(room)[currentImageIndices[room._id] || 0]
                        : getRoomImageUrl(room)[0]
                    }
                    alt={`${room.roomType} Room`}
                    className="room-image"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/comfortable-hotel-room.png"
                    }}
                  />
                  <div className="room-price">
                    LKR {room.price}
                    <span>/night</span>
                  </div>
                  {room.status === "Available" && <div className="room-badge">Available</div>}
                </div>
                <div className="room-content">
                  <h3 className="room-title">{room.roomType} Room</h3>
                  <div className="room-details">
                    <div className="room-detail">
                      <span className="detail-label">Room:</span>
                      <span className="detail-value">{room.roomNumber}</span>
                    </div>
                    <div className="room-detail">
                      <span className="detail-label">Bed:</span>
                      <span className="detail-value">{room.bedType}</span>
                    </div>
                  </div>
                  <p className="room-facilities">{room.facilities}</p>
                  <div className="room-status" style={getStatusStyle(room.status)}>
                    {room.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-rooms">
              <p>No rooms available at the moment.</p>
            </div>
          )}
        </div>

        <div className="view-all-container">
          <button className="view-all-btn" onClick={handleViewAllRooms}>
            View All Rooms <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        {/* Features content remains the same */}
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">{/* Testimonials content remains the same */}</section>

      {/* Footer */}
      <footer id="contact" className="footer">
        {/* Footer content remains the same */}
      </footer>

      {/* Login Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Select Login Type</h2>
            <div className="modal-buttons">
              <button className="modal-btn admin-btn" onClick={handleAdminLogin}>
                Admin Login
              </button>
              <button className="modal-btn customer-btn" onClick={handleCustomerLogin}>
                Customer Login
              </button>
              <button className="modal-btn close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Modal */}
      {showLoginRequiredModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Login Required</h2>
            <p style={{ marginBottom: "20px" }}>Please log in to explore the gift selection.</p>
            <div className="modal-buttons">
              <button
                className="modal-btn customer-btn"
                onClick={() => {
                  setShowLoginRequiredModal(false)
                  navigate("/login")
                }}
              >
                Login Now
              </button>
              <button className="modal-btn close-btn" onClick={() => setShowLoginRequiredModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Food Order Login Required Modal */}
      {showFoodLoginRequiredModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Login Required</h2>
            <p style={{ marginBottom: "20px" }}>Please log in to access our food ordering service.</p>
            <div className="modal-buttons">
              <button
                className="modal-btn customer-btn"
                onClick={() => {
                  setShowFoodLoginRequiredModal(false)
                  navigate("/login")
                }}
              >
                Login Now
              </button>
              <button className="modal-btn close-btn" onClick={() => setShowFoodLoginRequiredModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
