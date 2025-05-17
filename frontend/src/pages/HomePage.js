"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUser, logout } from "../services/userService" // Import your existing user service
import image1 from "../images/view1.jpg"
import image3 from "../images/view3.jpg"
import image4 from "../images/view4.jpg"
import image5 from "../images/image5.jpg"
import instalogo from "../images/i.png"
import fblogo from "../images/f.png"
import twitterlogo from "../images/t.png"
import companylogo from "../images/company.png"
import headingImage from "../images/bg1.JPG"
import { ChevronRight, Gift, Star, Users, Utensils, Calendar, LogOut, Package, User } from 'lucide-react'
import axios from "axios"
import Gifts from "../images/gift.jpg";

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
      if (currentUser && currentUser._id) {
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

  // Update the useEffect for fetching rooms to only get 3 rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setRoomsLoading(true)
        const response = await axios.get('https://welcoming-wisdom-production.up.railway.app/room/');
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

  // Update the room image handling function to properly display images from the server
  const getRoomImageUrl = (room) => {
    if (room.images && room.images.length > 0) {
      // If room has multiple images, return the array of image URLs
      return room.images.map((img) => `https://welcoming-wisdom-production.up.railway.app${img}`)
    } else if (room.image) {
      // For backward compatibility with rooms that have a single image
      return [`https://welcoming-wisdom-production.up.railway.app${room.image}`]
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
      <style jsx>{`
        /* CSS Reset and Global Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          overflow-x: hidden;
          color: #333;
          background-color: #fafafa;
        }
        
        /* Loading Screen */
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ffffff, #f0f0f0);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        
        .spinner {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(220, 20, 60, 0.2);
          border-radius: 50%;
          border-top-color: #dc143c;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 20px;
        }
        
        .loading-text {
          font-size: 24px;
          font-weight: 600;
          color: #dc143c;
          letter-spacing: 1px;
          animation: pulse 1.5s infinite;
        }
        
        /* Animations */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes zoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        /* Container */
        .home-container {
          width: 100%;
          overflow-x: hidden;
        }
        
        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled {
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          padding: 15px 40px;
        }
        
        .logo {
          height: 50px;
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled .logo {
          height: 40px;
        }
        
        .nav-links {
          display: flex;
          gap: 30px;
        }
        
        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled .nav-link {
          color: #333333;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #dc143c;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
        
        .login-btn {
          background-color: #dc143c;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
        }
        
        .login-btn:hover {
          background-color: #b30000;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(220, 20, 60, 0.4);
        }
        
        /* User Avatar */
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #dc143c;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 600;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
          position: relative;
        }
        
        .user-avatar:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(220, 20, 60, 0.4);
        }
        
        .user-menu {
          position: absolute;
          top: 50px;
          right: 0;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
          padding: 10px 0;
          min-width: 180px;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        
        .user-menu-item {
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #333;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .user-menu-item:hover {
          background-color: #f5f5f5;
          color: #dc143c;
        }
        
        .user-menu-divider {
          height: 1px;
          background-color: #eee;
          margin: 5px 0;
        }
        
        /* Hero Section */
        .hero {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: zoomIn 1.5s ease-out;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 20px;
        }
        
        .hero-title {
          color: white;
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 20px;
          animation: fadeIn 1s ease-out 0.5s both;
        }
        
        .hero-subtitle {
          color: white;
          font-size: 1.5rem;
          font-weight: 400;
          max-width: 700px;
          margin-bottom: 30px;
          animation: fadeIn 1s ease-out 0.8s both;
        }
        
        .hero-btn {
          background-color: #dc143c;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeIn 1s ease-out 1.1s both;
          box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
        }
        
        .hero-btn:hover {
          background-color: #b30000;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(220, 20, 60, 0.4);
        }
        
        /* Novelty Gift Section */
        .novelty-section {
          padding: 120px 20px;
          background-color: #fff;
          position: relative;
          overflow: hidden;
        }
        
        .novelty-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        
        .novelty-content {
          animation: slideInLeft 1s ease-out;
        }
        
        .novelty-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #333333;
          position: relative;
          display: inline-block;
        }
        
        .novelty-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 80px;
          height: 3px;
          background-color: #dc143c;
        }
        
        .novelty-text {
          font-size: 1.1rem;
          color: #666666;
          margin-bottom: 30px;
          line-height: 1.7;
        }
        
        .novelty-features {
          display: grid;
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .novelty-feature {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .feature-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(220, 20, 60, 0.1);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #dc143c;
        }
        
        .feature-text {
          font-size: 1.1rem;
          color: #333333;
        }
        
        .novelty-image-container {
          position: relative;
          animation: slideInRight 1s ease-out;
        }
        
        .novelty-image {
          width: 100%;
          height: auto;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .novelty-badge {
          position: absolute;
          top: -20px;
          right: -20px;
          background-color: #dc143c;
          color: white;
          padding: 15px;
          border-radius: 50%;
          width: 100px;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(220, 20, 60, 0.3);
          animation: float 3s ease-in-out infinite;
        }
        
        .novelty-btn {
          background-color: #dc143c;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
        }
        
        .novelty-btn:hover {
          background-color: #b30000;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(220, 20, 60, 0.4);
        }
        
        /* Food Order Section */
        .food-order {
          padding: 120px 20px;
          text-align: center;
          background-color: #f8f9fa;
          position: relative;
          overflow: hidden;
        }
        
        .food-order::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 10% 10%, rgba(220, 20, 60, 0.05) 0%, transparent 60%),
                            radial-gradient(circle at 90% 90%, rgba(0, 128, 0, 0.05) 0%, transparent 60%);
          z-index: 0;
        }
        
        .food-order-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #333333;
          position: relative;
          display: inline-block;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background-color: #dc143c;
        }
        
        .section-text {
          font-size: 1.1rem;
          color: #666666;
          max-width: 800px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }
        
        .order-btn {
          background-color: #008000;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 128, 0, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        
        .order-btn:hover {
          background-color: #006400;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 128, 0, 0.4);
        }
        
        /* Rooms Section */
        .rooms-section {
          padding: 100px 20px;
          background-color: #f8f9fa;
          position: relative;
          overflow: hidden;
        }

        .rooms-section::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background-color: rgba(220, 20, 60, 0.05);
          z-index: 0;
        }

        .rooms-section::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.03);
          z-index: 0;
        }

        .rooms-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px;
          position: relative;
          z-index: 1;
        }

        .rooms-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .room-card {
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          transform: translateY(0);
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .room-card:nth-child(1) {
          animation-delay: 0.1s;
        }

        .room-card:nth-child(2) {
          animation-delay: 0.3s;
        }

        .room-card:nth-child(3) {
          animation-delay: 0.5s;
        }

        .room-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .room-image-container {
          height: 180px;
          position: relative;
          overflow: hidden;
        }

        .room-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .room-card:hover .room-image {
          transform: scale(1.1);
        }

        .room-price {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 15px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .room-card:hover .room-price {
          background-color: rgba(220, 20, 60, 0.9);
          transform: translateY(-5px);
        }

        .room-price span {
          font-size: 0.8rem;
          font-weight: 400;
        }

        .room-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background-color: rgba(16, 185, 129, 0.9);
          color: white;
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transform: translateY(0);
          transition: all 0.3s ease;
        }

        .room-card:hover .room-badge {
          transform: translateY(-3px) scale(1.05);
        }

        .room-content {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
          background: linear-gradient(to bottom, #ffffff, #f9f9f9);
        }

        .room-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #333333;
          transition: color 0.3s ease;
        }

        .room-card:hover .room-title {
          color: #dc143c;
        }

        .room-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .room-detail {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #666666;
        }

        .detail-value {
          font-weight: 600;
          color: #333333;
          font-size: 0.9rem;
        }

        .room-facilities {
          font-size: 0.85rem;
          color: #666666;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }

        .room-status {
          font-weight: 600;
          font-size: 0.9rem;
          padding: 5px 0;
          border-radius: 4px;
          text-align: center;
          margin-top: auto;
          transition: all 0.3s ease;
        }

        .rooms-loading {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
        }

        .no-rooms {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .view-all-container {
          display: flex;
          justify-content: center;
          margin-top: 50px;
          position: relative;
          z-index: 1;
        }

        .view-all-btn {
          background-color: #dc143c;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 25px rgba(220, 20, 60, 0.3);
          position: relative;
          overflow: hidden;
        }

        .view-all-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
        }

        .view-all-btn:hover {
          background-color: #b30000;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(220, 20, 60, 0.4);
        }

        .view-all-btn:hover::before {
          left: 100%;
        }

        /* Responsive adjustments for rooms section */
        @media (max-width: 992px) {
          .rooms-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .rooms-container {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
        }

        /* Features Section */
        .features {
          padding: 120px 20px;
          background-color: #ffffff;
          position: relative;
        }
        
        .features-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 60px;
        }
        
        .features-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #333333;
          position: relative;
          display: inline-block;
        }
        
        .features-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background-color: #dc143c;
        }
        
        .features-subtitle {
          font-size: 1.1rem;
          color: #666666;
          line-height: 1.7;
        }
        
        .features-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-card {
          background-color: #ffffff;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .card-image-container {
          height: 200px;
          overflow: hidden;
        }
        
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .card-content {
          padding: 25px;
          transition: background-color 0.3s ease;
        }
        
        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333333;
        }
        
        .card-text {
          font-size: 1rem;
          color: #666666;
          line-height: 1.6;
        }
        
        /* Testimonials */
        .testimonials {
          padding: 120px 20px;
          background-color: #f8f9fa;
          text-align: center;
        }
        
        .testimonials-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #333333;
          position: relative;
          display: inline-block;
        }
        
        .testimonials-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background-color: #dc143c;
        }
        
        .testimonials-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 30px;
          max-width: 1200px;
          margin: 60px auto 0;
        }
        
        .testimonial-card {
          background-color: #ffffff;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 350px;
          text-align: left;
        }
        
        .testimonial-stars {
          display: flex;
          gap: 5px;
          margin-bottom: 15px;
          color: #ffc107;
        }
        
        .testimonial-text {
          font-size: 1rem;
          color: #666666;
          line-height: 1.7;
          margin-bottom: 20px;
          font-style: italic;
        }
        
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .author-info {
          display: flex;
          flex-direction: column;
        }
        
        .author-name {
          font-weight: 600;
          color: #333333;
        }
        
        .author-title {
          font-size: 0.9rem;
          color: #999999;
        }
        
        /* Footer */
        .footer {
          background-color: #1a1a1a;
          color: #ffffff;
          padding: 80px 20px 30px;
          position: relative;
        }
        
        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 90% 10%, rgba(220, 20, 60, 0.1) 0%, transparent 50%);
          z-index: 0;
        }
        
        .footer-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
        }
        
        .footer-logo {
          width: 150px;
          margin-bottom: 20px;
        }
        
        .footer-about {
          margin-bottom: 20px;
          line-height: 1.7;
        }
        
        .footer-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
        }
        
        .footer-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 2px;
          background-color: #dc143c;
        }
        
        .footer-links {
          list-style: none;
        }
        
        .footer-link {
          margin-bottom: 12px;
        }
        
        .footer-link a {
          color: #cccccc;
          text-decoration: none;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .footer-link a:hover {
          color: #dc143c;
        }
        
        .social-icons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }
        
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #333333;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          background-color: #dc143c;
          transform: translateY(-5px);
        }
        
        .social-icon img {
          width: 20px;
          height: 20px;
        }
        
        .footer-bottom {
          position: relative;
          z-index: 1;
          margin-top: 60px;
          padding-top: 30px;
          border-top: 1px solid #333333;
          text-align: center;
          color: #999999;
          font-size: 0.9rem;
        }
        
        /* Modal */
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
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }
        
        .modal-container {
          background-color: #ffffff;
          border-radius: 15px;
          padding: 40px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
          text-align: center;
          animation: zoomIn 0.5s ease;
        }
        
        .modal-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 30px;
          color: #333333;
        }
        
        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .modal-btn {
          padding: 15px 20px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .admin-btn {
          background-color: #0066ff;
          color: white;
        }
        
        .admin-btn:hover {
          background-color: #0052cc;
        }
        
        .customer-btn {
          background-color: #dc143c;
          color: white;
        }
        
        .customer-btn:hover {
          background-color: #b30000;
        }
        
        .close-btn {
          background-color: #333333;
          color: white;
        }
        
        .close-btn:hover {
          background-color: #1a1a1a;
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .section-title, .novelty-title, .features-title, .testimonials-title {
            font-size: 2rem;
          }
          
          .novelty-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .novelty-image-container {
            order: -1;
          }
        }
        
        @media (max-width: 768px) {
          .navbar {
            padding: 15px 20px;
          }
          
          .navbar.scrolled {
            padding: 10px 20px;
          }
          
          .nav-links {
            display: none;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .hero-btn {
            padding: 12px 30px;
            font-size: 1rem;
          }
          
          .section-title, .novelty-title, .features-title, .testimonials-title {
            font-size: 1.8rem;
          }
          
          .section-text, .novelty-text {
            font-size: 1rem;
          }
          
          .order-btn, .novelty-btn {
            padding: 12px 30px;
            font-size: 1rem;
          }
          
          .features-container {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
          
          .testimonials-container {
            flex-direction: column;
            align-items: center;
          }
          
          .modal-container {
            padding: 30px;
          }
        }
        
        @media (max-width: 480px) {
          .logo {
            height: 40px;
          }
          
          .navbar.scrolled .logo {
            height: 35px;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 0.9rem;
          }
          
          .section-title, .novelty-title, .features-title, .testimonials-title {
            font-size: 1.5rem;
          }
          
          .novelty-badge {
            width: 80px;
            height: 80px;
            font-size: 0.8rem;
            top: -10px;
            right: -10px;
          }
          
          .footer-container {
            grid-template-columns: 1fr;
          }
          
          .modal-container {
            padding: 20px;
          }
          
          .modal-title {
            font-size: 1.5rem;
          }
        }

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
        <div className="features-header">
          <h2 className="features-title">Luxury Amenities</h2>
          <p className="features-subtitle">
            Discover our world-class facilities designed to provide you with the ultimate comfort and relaxation during
            your stay.
          </p>
        </div>
        <div className="features-container">
          <div
            className="feature-card"
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <div className="card-image-container">
              <img
                src={image1 || "/placeholder.svg?height=400&width=600&query=luxury hotel room"}
                alt="Luxurious Rooms"
                className="card-image"
              />
            </div>
            <div className="card-content">
              <h3 className="card-title">Luxurious Rooms</h3>
              <p className="card-text">
                Enjoy a stay in our beautifully furnished rooms with panoramic views, designed for ultimate relaxation
                and comfort.
              </p>
            </div>
          </div>

          <div
            className="feature-card"
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <div className="card-image-container">
              <img
                src={image5 || "/placeholder.svg?height=400&width=600&query=hotel spa"}
                alt="Exclusive Spa"
                className="card-image"
              />
            </div>
            <div className="card-content">
              <h3 className="card-title">Exclusive Spa</h3>
              <p className="card-text">
                Unwind with rejuvenating spa treatments designed to relax your senses and provide a peaceful retreat
                from daily stress.
              </p>
            </div>
          </div>

          <div
            className="feature-card"
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <div className="card-image-container">
              <img
                src={image3 || "/placeholder.svg?height=400&width=600&query=hotel swimming pool"}
                alt="Poolside Relaxation"
                className="card-image"
              />
            </div>
            <div className="card-content">
              <h3 className="card-title">Poolside Relaxation</h3>
              <p className="card-text">
                Dive into serenity at our beautiful poolside, a perfect setting for relaxation, socializing, and soaking
                up the sun.
              </p>
            </div>
          </div>

          <div
            className="feature-card"
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <div className="card-image-container">
              <img
                src={image4 || "/placeholder.svg?height=400&width=600&query=gourmet restaurant"}
                alt="Gourmet Dining"
                className="card-image"
              />
            </div>
            <div className="card-content">
              <h3 className="card-title">Gourmet Dining</h3>
              <p className="card-text">
                Indulge in world-class dining with fresh, gourmet cuisines prepared by our expert chefs using the finest
                ingredients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2 className="testimonials-title">Guest Experiences</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
            </div>
            <p className="testimonial-text">
              "The wedding gift selection service was incredible! Our guests loved being able to choose gifts online,
              and it made our special day even more memorable."
            </p>
            <div className="testimonial-author">
              <img src="/woman-portrait.png" alt="Sarah J." className="author-avatar" />
              <div className="author-info">
                <div className="author-name">Sarah J.</div>
                <div className="author-title">Wedding Guest</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
            </div>
            <p className="testimonial-text">
              "The rooms are absolutely stunning and the staff went above and beyond to make our stay perfect. The food
              was exceptional!"
            </p>
            <div className="testimonial-author">
              <img src="/thoughtful-man-portrait.png" alt="Michael T." className="author-avatar" />
              <div className="author-info">
                <div className="author-name">Michael T.</div>
                <div className="author-title">Business Traveler</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
              <Star className="fill-current" size={18} />
            </div>
            <p className="testimonial-text">
              "We hosted our anniversary celebration here and used the gift selection service. It was seamless and our
              guests appreciated the convenience."
            </p>
            <div className="testimonial-author">
              <img src="/romantic-couple.png" alt="David & Lisa" className="author-avatar" />
              <div className="author-info">
                <div className="author-name">David & Lisa</div>>
              <div className="author-info">
                <div className="author-name">David & Lisa</div>
                <div className="author-title">Anniversary Celebration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div>
            <img
              src={companylogo || "/placeholder.svg?height=60&width=150&query=hotel logo"}
              alt="Cinnamon Red Hotel"
              className="footer-logo"
            />
            <p className="footer-about">
              Cinnamon Red Hotel offers luxury accommodations with world-class amenities and exceptional service to make
              your stay unforgettable. Our new gift selection service makes special events even more memorable.
            </p>
            <div className="social-icons">
              <a href="https://www.facebook.com" className="social-icon">
                <img src={fblogo || "/placeholder.svg?height=20&width=20&query=facebook icon"} alt="Facebook" />
              </a>
              <a href="https://www.instagram.com" className="social-icon">
                <img src={instalogo || "/placeholder.svg?height=20&width=20&query=instagram icon"} alt="Instagram" />
              </a>
              <a href="https://twitter.com" className="social-icon">
                <img src={twitterlogo || "/placeholder.svg?height=20&width=20&query=twitter icon"} alt="Twitter" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <a href="#home">
                  <ChevronRight size={16} /> Home
                </a>
              </li>
              <li className="footer-link">
                <a href="#novelty">
                  <ChevronRight size={16} /> Gift Selection
                </a>
              </li>
              <li className="footer-link">
                <a href="#food">
                  <ChevronRight size={16} /> Food Order
                </a>
              </li>
              <li className="footer-link">
                <a href="#features">
                  <ChevronRight size={16} /> Amenities
                </a>
              </li>
              <li className="footer-link">
                <a href="#contact">
                  <ChevronRight size={16} /> Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Our Services</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <a href="#">
                  <ChevronRight size={16} /> Wedding Venues
                </a>
              </li>
              <li className="footer-link">
                <a href="#">
                  <ChevronRight size={16} /> Gift Selection
                </a>
              </li>
              <li className="footer-link">
                <a href="#">
                  <ChevronRight size={16} /> Room Service
                </a>
              </li>
              <li className="footer-link">
                <a href="#">
                  <ChevronRight size={16} /> Spa & Wellness
                </a>
              </li>
              <li className="footer-link">
                <a href="#">
                  <ChevronRight size={16} /> Business Events
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-links">
              <li className="footer-link">59 Ananda Coomaraswamy Mawatha, Colombo</li>
              <li className="footer-link">+94 11 2 161 161</li>
              <li className="footer-link">info@cinnamonred.com</li>
              <li className="footer-link">24/7 Customer Service</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2023 Cinnamon Red Hotel. All Rights Reserved</p>
        </div>
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
