"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api" // Import the custom API service
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  Search,
  Filter,
  Star,
  MapPin,
  Users,
  Coffee,
  Wifi,
  Tv,
  Bath,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Calendar,
  User,
  Home,
  X,
  Eye,
} from "lucide-react"
import companylogo from "../../images/company.png"

const AllRooms = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterPrice, setFilterPrice] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [user, setUser] = useState(null)
  const [hoveredRoom, setHoveredRoom] = useState(null)
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookingDays, setBookingDays] = useState(1)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFullGallery, setShowFullGallery] = useState(false)

  // New state for search form
  const [searchFormSubmitted, setSearchFormSubmitted] = useState(false)
  const [guestCount, setGuestCount] = useState(1)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([])
  const [availableRoomTypes, setAvailableRoomTypes] = useState([])
  const [searchError, setSearchError] = useState("")
  const [filteredRooms, setFilteredRooms] = useState([])

  // Get user from localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem("user")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  // Fetch rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        // Use our custom API service
        const response = await api.get("/room/")
        setRooms(response.data)

        // Extract unique room types for the filter
        const roomTypes = [...new Set(response.data.map((room) => room.roomType))]
        setAvailableRoomTypes(roomTypes)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching rooms:", error)
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  // Reset current image index when modal opens
  useEffect(() => {
    if (showRoomModal) {
      setCurrentImageIndex(0)
      setShowFullGallery(false)
    }
  }, [showRoomModal])

  // Calculate minimum check-out date based on check-in date
  const getMinCheckoutDate = () => {
    if (!checkInDate) return ""

    const nextDay = new Date(checkInDate)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay.toISOString().split("T")[0]
  }

  // Handle room type selection
  const handleRoomTypeToggle = (roomType) => {
    setSelectedRoomTypes((prev) => {
      if (prev.includes(roomType)) {
        return prev.filter((type) => type !== roomType)
      } else {
        return [...prev, roomType]
      }
    })
  }

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchError("")

    // Validate form
    if (!checkInDate || !checkOutDate) {
      setSearchError("Please select both check-in and check-out dates")
      return
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    if (checkIn >= checkOut) {
      setSearchError("Check-out date must be after check-in date")
      return
    }

    // Calculate number of days for booking
    const diffTime = Math.abs(checkOut - checkIn)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setBookingDays(diffDays)

    // Filter rooms based on criteria
    let filtered = [...rooms]

    // Filter by guest count
    filtered = filtered.filter((room) => {
      let capacity = 1
      if (room.roomType === "Single") capacity = 1
      else if (room.roomType === "Double") capacity = 2
      else if (room.roomType === "VIP" || room.roomType === "King") capacity = 4
      else capacity = 2 // Default for other types

      return capacity >= guestCount
    })

    // Filter by room type if any selected
    if (selectedRoomTypes.length > 0) {
      filtered = filtered.filter((room) => selectedRoomTypes.includes(room.roomType))
    }

    // Filter by availability
    filtered = filtered.filter((room) => room.status === "Available")

    setFilteredRooms(filtered)
    setSearchFormSubmitted(true)
  }

  // Reset search form
  const resetSearchForm = () => {
    setGuestCount(1)
    setCheckInDate("")
    setCheckOutDate("")
    setSelectedRoomTypes([])
    setSearchFormSubmitted(false)
    setSearchError("")
  }

  // Filter rooms based on search query and filters (for additional filtering after search)
  const getDisplayedRooms = () => {
    if (!searchFormSubmitted) return []

    return filteredRooms
      .filter((room) => {
        const matchesSearch =
          room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.facilities.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.bedType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.status.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = filterType ? room.roomType === filterType : true

        const matchesPrice = filterPrice
          ? filterPrice === "asc"
            ? true
            : filterPrice === "desc"
              ? true
              : filterPrice === "low"
                ? room.price <= 100
                : filterPrice === "medium"
                  ? room.price > 100 && room.price <= 200
                  : filterPrice === "high"
                    ? room.price > 200
                    : true
          : true

        return matchesSearch && matchesType && matchesPrice
      })
      .sort((a, b) => {
        if (filterPrice === "asc") return a.price - b.price
        if (filterPrice === "desc") return b.price - a.price
        return 0
      })
  }

  const displayedRooms = getDisplayedRooms()

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return { backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderColor: "#10b981" }
      case "Reserved":
        return { backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", borderColor: "#3b82f6" }
      case "Booked":
        return { backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderColor: "#ef4444" }
      default:
        return {}
    }
  }

  // Function to get room image URLs
  const getRoomImageUrls = (room) => {
    const API_BASE_URL =
      process.env.NODE_ENV === "production"
        ? "https://welcoming-wisdom-production.up.railway.app"
        : "http://localhost:5001"

    if (room.images && room.images.length > 0) {
      return room.images.map((img) => `${API_BASE_URL}${img}`)
    } else if (room.image) {
      return [`${API_BASE_URL}${room.image}`]
    }

    // Generate placeholder images if no images are available
    return [
      `/luxury-still-life.png?height=300&width=400&query=luxury ${room.roomType} hotel room`,
      `/luxury-hotel-room.png?height=300&width=400&query=elegant ${room.roomType} hotel room`,
      `/comfortable-hotel-room.png?height=300&width=400&query=modern ${room.roomType} hotel room`,
    ]
  }

  // Function to get the main room image for the card
  const getRoomImageUrl = (room) => {
    const API_BASE_URL =
      process.env.NODE_ENV === "production"
        ? "https://welcoming-wisdom-production.up.railway.app"
        : "http://localhost:5001"

    if (room.images && room.images.length > 0) {
      return `${API_BASE_URL}${room.images[0]}`
    } else if (room.image) {
      return `${API_BASE_URL}${room.image}`
    }
    return `/luxury-still-life.png?height=300&width=400&query=luxury ${room.roomType} hotel room`
  }

  // New function to handle View button click
  const handleViewRoom = (room) => {
    setSelectedRoom(room)
    setShowRoomModal(true)
  }

  const handleBookNow = () => {
    if (!selectedRoom || !user) {
      // Show login popup message if no user
      if (!user) {
        alert("Please log in to book a room")
        navigate("/login")
        return
      }
      return
    }

    if (!searchFormSubmitted) {
      // If user hasn't submitted the search form yet, show a message
      alert("Please select check-in and check-out dates first")
      return
    }

    // Navigate to payment page with room data
    navigate("/room-payment", {
      state: {
        roomData: selectedRoom,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        guestCount: guestCount,
      },
    })
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const clearFilters = () => {
    setFilterType("")
    setFilterPrice("")
    setSearchQuery("")
  }

  const handleCloseModal = () => {
    setShowRoomModal(false)
    setSelectedRoom(null)
    setBookingSuccess(false)
    setShowFullGallery(false)
  }

  // Get random amenities icons for each room
  const getAmenityIcon = (index) => {
    const icons = [
      <Wifi key="wifi" size={16} />,
      <Tv key="tv" size={16} />,
      <Coffee key="coffee" size={16} />,
      <Bath key="bath" size={16} />,
    ]
    return icons[index % icons.length]
  }

  // Handle image navigation
  const nextImage = () => {
    if (selectedRoom) {
      const images = getRoomImageUrls(selectedRoom)
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (selectedRoom) {
      const images = getRoomImageUrls(selectedRoom)
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }
  }

  const selectImage = (index) => {
    setCurrentImageIndex(index)
  }

  const toggleFullGallery = () => {
    setShowFullGallery(!showFullGallery)
  }

  // Get room capacity based on room type
  const getRoomCapacity = (roomType) => {
    switch (roomType) {
      case "Single":
        return 1
      case "Double":
        return 2
      case "VIP":
        return 4
      case "King":
        return 4
      case "Flex":
        return 3
      default:
        return 2
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  }

  // Get today's date in YYYY-MM-DD format for min date in date pickers
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  return (
    <div className="all-rooms-container">
      <style jsx>{`
        .all-rooms-container {
          padding: 40px 20px 80px;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #dc143c;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background-color: rgba(220, 20, 60, 0.1);
          transform: translateX(-5px);
        }

        .logo {
          height: 40px;
        }

        .page-title-container {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: #333333;
          position: relative;
          display: inline-block;
        }

        .page-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background-color: #dc143c;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Search Form Styles */
        .search-form-container {
          background-color: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .search-form-container::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background-color: rgba(220, 20, 60, 0.05);
          border-radius: 0 0 0 100%;
          z-index: 0;
        }

        .search-form-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 25px;
          color: #333;
          position: relative;
          z-index: 1;
        }

        .search-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-weight: 600;
          color: #555;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .form-input {
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          background-color: #f9f9f9;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #dc143c;
          box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
          background-color: #fff;
        }

        .guest-input-container {
          display: flex;
          align-items: center;
          background-color: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }

        .guest-btn {
          width: 40px;
          height: 40px;
          border: none;
          background-color: transparent;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #666;
        }

        .guest-btn:hover {
          background-color: #f0f0f0;
          color: #dc143c;
        }

        .guest-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .guest-input {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          text-align: center;
          font-size: 1rem;
          font-weight: 600;
          color: #333;
        }

        .guest-input:focus {
          outline: none;
        }

        .room-types-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .room-type-chip {
          padding: 8px 15px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: #f9f9f9;
          border: 1px solid #e0e0e0;
          color: #666;
        }

        .room-type-chip.selected {
          background-color: #dc143c;
          color: white;
          border-color: #dc143c;
        }

        .room-type-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
        }

        .search-actions {
          grid-column: 1 / -1;
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 10px;
        }

        .reset-btn {
          padding: 12px 25px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          background-color: #f9f9f9;
          color: #666;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .reset-btn:hover {
          border-color: #dc143c;
          color: #dc143c;
          background-color: #fff;
        }

        .search-btn {
          padding: 12px 30px;
          border-radius: 8px;
          background-color: #dc143c;
          color: white;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(220, 20, 60, 0.2);
        }

        .search-btn:hover {
          background-color: #b30000;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(220, 20, 60, 0.3);
        }

        .search-error {
          grid-column: 1 / -1;
          color: #ef4444;
          font-size: 0.9rem;
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .search-results-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        .results-count {
          font-weight: 600;
          color: #333;
        }

        .results-dates {
          display: flex;
          align-items: center;
          gap: 15px;
          color: #666;
          font-size: 0.95rem;
        }

        .date-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background-color: #f8f9fa;
          border-radius: 6px;
          font-weight: 500;
        }

        .search-filter-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
          background-color: white;
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .search-container {
          position: relative;
          flex-grow: 1;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }

        .search-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border-radius: 50px;
          border: 1px solid #e0e0e0;
          background-color: #f9f9f9;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #dc143c;
          box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
          background-color: #fff;
        }

        .filter-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #f9f9f9;
          border: 1px solid #e0e0e0;
          color: #333;
          padding: 12px 25px;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-button:hover {
          border-color: #dc143c;
          color: #dc143c;
          background-color: #fff;
        }

        .filter-button.active {
          background-color: #dc143c;
          border-color: #dc143c;
          color: #fff;
        }

        .filters-panel {
          background-color: #fff;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-label {
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
        }

        .filter-select {
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          background-color: #f9f9f9;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #dc143c;
          box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
          background-color: #fff;
        }

        .filter-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 25px;
          gap: 15px;
        }

        .clear-button {
          padding: 12px 25px;
          border-radius: 50px;
          border: 1px solid #e0e0e0;
          background-color: #f9f9f9;
          color: #666;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-button:hover {
          border-color: #dc143c;
          color: #dc143c;
          background-color: #fff;
        }

        .rooms-list {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .room-card {
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: row;
          height: 280px;
          position: relative;
        }

        .room-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        .room-image-container {
          width: 40%;
          position: relative;
          overflow: hidden;
        }

        .room-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }

        .room-card:hover .room-image {
          transform: scale(1.05);
        }

        .room-price {
          position: absolute;
          top: 20px;
          left: 20px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 15px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          z-index: 2;
        }

        .room-card:hover .room-price {
          background-color: rgba(220, 20, 60, 0.9);
          transform: translateY(-3px);
        }

        .room-price span {
          font-size: 0.8rem;
          font-weight: 400;
        }

        .room-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background-color: rgba(16, 185, 129, 0.9);
          color: white;
          padding: 6px 15px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          z-index: 2;
        }

        .room-card:hover .room-badge {
          transform: translateY(-3px);
        }

        .room-content {
          width: 60%;
          padding: 30px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .room-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #333333;
          transition: color 0.3s ease;
        }

        .room-card:hover .room-title {
          color: #dc143c;
        }

        .room-location {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .room-details {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .room-detail {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #666666;
        }

        .detail-value {
          font-weight: 600;
          color: #333333;
          font-size: 0.95rem;
        }

        .room-facilities {
          font-size: 0.95rem;
          color: #666666;
          margin-bottom: 15px;
          line-height: 1.6;
        }

        .amenities {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .amenity {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: #f8f9fa;
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 0.85rem;
          color: #555;
          transition: all 0.3s ease;
        }

        .room-card:hover .amenity {
          background-color: #f0f0f0;
        }

        .room-status {
          display: inline-block;
          font-weight: 600;
          margin-bottom: 15px;
          padding: 6px 15px;
          border-radius: 50px;
          font-size: 0.85rem;
          border: 1px solid;
          transition: all 0.3s ease;
        }

        .room-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 15px;
        }

        .rating-stars {
          color: #ffc107;
          display: flex;
        }

        .rating-value {
          font-weight: 600;
          color: #333;
        }

        .view-btn {
          position: absolute;
          bottom: 30px;
          right: 30px;
          background-color: #0066cc;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 5px 15px rgba(0, 102, 204, 0.2);
        }

        .view-btn:hover {
          background-color: #0052a3;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 102, 204, 0.3);
        }

        .view-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .view-btn .eye-icon {
          transition: transform 0.3s ease;
        }

        .view-btn:hover .eye-icon {
          transform: scale(1.1);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(220, 20, 60, 0.2);
          border-radius: 50%;
          border-top-color: #dc143c;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-rooms {
          text-align: center;
          padding: 60px 40px;
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .no-rooms h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #333;
        }

        .no-rooms p {
          color: #666;
        }

        @media (max-width: 992px) {
          .room-card {
            height: auto;
            flex-direction: column;
          }
          
          .room-image-container {
            width: 100%;
            height: 250px;
          }
          
          .room-content {
            width: 100%;
            padding-bottom: 80px;
          }
          
          .view-btn {
            bottom: 20px;
            right: 20px;
          }
        }

        @media (max-width: 768px) {
          .search-filter-container {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            max-width: none;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }
          
          .page-title {
            font-size: 2rem;
          }
          
          .room-details {
            flex-wrap: wrap;
          }
          
          .amenities {
            flex-wrap: wrap;
          }
          
          .search-form {
            grid-template-columns: 1fr;
          }
          
          .results-dates {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .room-content {
            padding: 20px;
            padding-bottom: 80px;
          }
          
          .room-title {
            font-size: 1.3rem;
          }
          
          .view-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Room Modal Styles */
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

        .room-modal {
          background-color: white;
          border-radius: 24px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 30px;
          border-bottom: 1px solid #f0f0f0;
        }

        .modal-header h2 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #333;
          margin: 0;
          background: linear-gradient(90deg, #0066cc, #0099ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .close-modal-btn {
          background: none;
          border: none;
          font-size: 1.8rem;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-modal-btn:hover {
          background-color: #f8f8f8;
          color: #dc143c;
          transform: rotate(90deg);
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        @media (min-width: 768px) {
          .modal-body {
            flex-direction: row;
          }
        }

        /* Image Gallery Styles */
        .modal-room-image {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .modal-room-image {
            width: 40%;
            height: auto;
          }
        }

        .modal-room-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .room-modal:hover .modal-room-image img {
          transform: scale(1.05);
        }

        .modal-room-price {
          position: absolute;
          top: 20px;
          left: 20px;
          background: linear-gradient(135deg, #0066cc, #0099ff);
          color: white;
          padding: 10px 18px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
          z-index: 5;
        }

        .modal-room-price span {
          font-size: 0.8rem;
          font-weight: 400;
        }

        .modal-room-details {
          padding: 30px;
          flex: 1;
        }

        .modal-room-details h3 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #333;
          position: relative;
          display: inline-block;
        }

        .modal-room-details h3::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #0066cc, #0099ff);
          border-radius: 3px;
        }

        .detail-row {
          display: flex;
          margin-bottom: 15px;
          align-items: flex-start;
        }

        .detail-row .detail-label {
          width: 120px;
          font-weight: 600;
          color: #666;
          font-size: 0.95rem;
        }

        .detail-row .detail-value {
          flex: 1;
          color: #333;
          font-size: 0.95rem;
        }

        .facilities-list {
          line-height: 1.6;
        }

        .booking-days {
          margin: 25px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .booking-days label {
          font-weight: 600;
          color: #333;
          font-size: 1.1rem;
        }

        .days-input-container {
          display: flex;
          align-items: center;
          max-width: 180px;
          background-color: #f8f9fa;
          border-radius: 12px;
          padding: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .days-btn {
          width: 40px;
          height: 40px;
          border: none;
          background-color: white;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 10px;
          color: #666;
        }

        .days-btn:hover {
          background-color: #f0f0f0;
          color: #dc143c;
        }

        .days-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .days-input-container input {
          width: 70px;
          height: 40px;
          border: none;
          background: transparent;
          text-align: center;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        .days-input-container input:focus {
          outline: none;
        }

        .total-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-weight: 600;
        }

        .total-price .price {
          font-size: 1.5rem;
          color: #dc143c;
        }

        .modal-footer {
          padding: 20px 30px;
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          border-top: 1px solid #f0f0f0;
        }

        .cancel-btn, .book-now-btn {
          padding: 14px 30px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
        }

        .cancel-btn {
          background-color: #f8f9fa;
          color: #666;
          border: 1px solid #e0e0e0;
        }

        .cancel-btn:hover {
          background-color: #f1f1f1;
          transform: translateY(-2px);
        }

        .book-now-btn {
          background: linear-gradient(135deg, #dc143c, #ff4d6d);
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
        }

        .book-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 20, 60, 0.4);
        }

        .book-now-btn:disabled {
          background: linear-gradient(135deg, #f1a1a1, #ffb3c0);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        /* Success Animation */
        .booking-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes checkmark-circle {
          0% {
            stroke-dashoffset: 480;
          }
          100% {
            stroke-dashoffset: 960;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #dc143c;
          border-radius: 2px;
          animation: confetti 3s ease-in-out infinite;
        }

        .success-icon {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 30px;
        }

        .success-icon svg {
          width: 100%;
          height: 100%;
        }

        .success-icon svg circle {
          fill: none;
          stroke: #10b981;
          stroke-width: 2;
          stroke-dasharray: 480;
          stroke-dashoffset: 480;
          animation: checkmark-circle 1s ease-in-out forwards;
        }

        .success-icon svg path {
          fill: none;
          stroke: #10b981;
          stroke-width: 2;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: checkmark 1s 0.5s ease-in-out forwards;
        }

        .booking-success h3 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: #333;
          background: linear-gradient(90deg, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .booking-success p {
          color: #666;
          font-size: 1.2rem;
        }

        /* Image Gallery Styles */
        .image-gallery-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .image-navigation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 15px;
          z-index: 4;
        }

        .nav-button {
          background-color: rgba(255, 255, 255, 0.7);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #333;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-button:hover {
          background-color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          color: #dc143c;
        }

        .image-counter {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          z-index: 4;
        }

        .view-all-images {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 4;
        }

        .view-all-images:hover {
          background-color: rgba(0, 0, 0, 0.8);
          transform: translateY(-2px);
        }

        .thumbnail-gallery {
          display: flex;
          gap: 10px;
          padding: 15px;
          overflow-x: auto;
          background-color: #f8f9fa;
          scrollbar-width: thin;
          scrollbar-color: #dc143c #f0f0f0;
        }

        .thumbnail-gallery::-webkit-scrollbar {
          height: 6px;
        }

        .thumbnail-gallery::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 10px;
        }

        .thumbnail-gallery::-webkit-scrollbar-thumb {
          background-color: #dc143c;
          border-radius: 10px;
        }

        .thumbnail {
          width: 70px;
          height: 50px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          flex-shrink: 0;
        }

        .thumbnail.active {
          border-color: #dc143c;
          transform: scale(1.05);
        }

        .thumbnail:hover {
          transform: scale(1.05);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Full Gallery Modal */
        .full-gallery-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .full-gallery-header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2001;
        }

        .gallery-title {
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .close-gallery-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.3s ease;
        }

        .close-gallery-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .full-gallery-content {
          position: relative;
          width: 90%;
          height: 70vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .full-gallery-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .full-gallery-navigation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }

        .full-gallery-nav-button {
          background-color: rgba(255, 255, 255, 0.2);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .full-gallery-nav-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .full-gallery-counter {
          position: absolute;
          bottom: 20px;
          left: 0;
          width: 100%;
          text-align: center;
          color: white;
          font-size: 1rem;
          font-weight: 600;
        }

        .full-gallery-thumbnails {
          display: flex;
          gap: 10px;
          padding: 20px;
          overflow-x: auto;
          width: 90%;
          max-width: 800px;
          margin-top: 20px;
          scrollbar-width: thin;
          scrollbar-color: white rgba(255, 255, 255, 0.2);
        }

        .full-gallery-thumbnails::-webkit-scrollbar {
          height: 6px;
        }

        .full-gallery-thumbnails::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        .full-gallery-thumbnails::-webkit-scrollbar-thumb {
          background-color: white;
          border-radius: 10px;
        }

        .full-gallery-thumbnail {
          width: 80px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          flex-shrink: 0;
          opacity: 0.7;
        }

        .full-gallery-thumbnail.active {
          border-color: white;
          opacity: 1;
          transform: scale(1.05);
        }

        .full-gallery-thumbnail:hover {
          opacity: 1;
          transform: scale(1.05);
        }

        .full-gallery-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .full-gallery-content {
            height: 50vh;
          }
          
          .full-gallery-thumbnails {
            width: 100%;
          }
          
          .full-gallery-thumbnail {
            width: 60px;
            height: 45px;
          }
        }
      `}</style>

      <div className="header">
        <button className="back-button" onClick={() => navigate("/")}>
          <ChevronLeft size={18} /> Back to Home
        </button>
        <img
          src={companylogo || "/placeholder.svg?height=40&width=120&query=hotel logo"}
          alt="Cinnamon Red Hotel"
          className="logo"
        />
      </div>

      <div className="page-title-container">
        <h1 className="page-title">Our Luxurious Rooms</h1>
        <p className="page-subtitle">
          Experience the perfect blend of comfort and elegance in our thoughtfully designed rooms and suites
        </p>
      </div>

      {/* Search Form */}
      <div className="search-form-container">
        <h2 className="search-form-title">Find Your Perfect Room</h2>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={16} /> Number of Guests
            </label>
            <div className="guest-input-container">
              <button
                type="button"
                className="guest-btn"
                onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                disabled={guestCount <= 1}
              >
                -
              </button>
              <input
                type="number"
                className="guest-input"
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                min="1"
                max="10"
                readOnly
              />
              <button
                type="button"
                className="guest-btn"
                onClick={() => setGuestCount((prev) => Math.min(10, prev + 1))}
                disabled={guestCount >= 10}
              >
                +
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} /> Check-in Date
            </label>
            <input
              type="date"
              className="form-input"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={getTodayDate()}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} /> Check-out Date
            </label>
            <input
              type="date"
              className="form-input"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={getMinCheckoutDate() || getTodayDate()}
              disabled={!checkInDate}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Home size={16} /> Room Type
            </label>
            <div className="room-types-container">
              {availableRoomTypes.map((roomType) => (
                <div
                  key={roomType}
                  className={`room-type-chip ${selectedRoomTypes.includes(roomType) ? "selected" : ""}`}
                  onClick={() => handleRoomTypeToggle(roomType)}
                >
                  {roomType}
                </div>
              ))}
            </div>
          </div>

          {searchError && (
            <div className="search-error">
              <X size={16} /> {searchError}
            </div>
          )}

          <div className="search-actions">
            <button type="button" className="reset-btn" onClick={resetSearchForm}>
              <X size={16} /> Reset
            </button>
            <button type="submit" className="search-btn">
              <Search size={16} /> Search Rooms
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchFormSubmitted && (
        <>
          <div className="search-results-info">
            <div className="results-count">
              {displayedRooms.length} {displayedRooms.length === 1 ? "room" : "rooms"} found
            </div>
            <div className="results-dates">
              <div className="date-badge">
                <Calendar size={16} /> Check-in: {new Date(checkInDate).toLocaleDateString()}
              </div>
              <div className="date-badge">
                <Calendar size={16} /> Check-out: {new Date(checkOutDate).toLocaleDateString()}
              </div>
              <div className="date-badge">
                <User size={16} /> Guests: {guestCount}
              </div>
            </div>
          </div>

          <div className="search-filter-container">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search rooms by type, facilities, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button className={`filter-button ${showFilters ? "active" : ""}`} onClick={toggleFilters}>
              <Filter size={18} /> {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="filters-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="filters-grid">
                  <div className="filter-group">
                    <label className="filter-label">Room Type</label>
                    <select
                      className="filter-select"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      {availableRoomTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label className="filter-label">Price</label>
                    <select
                      className="filter-select"
                      value={filterPrice}
                      onChange={(e) => setFilterPrice(e.target.value)}
                    >
                      <option value="">All Prices</option>
                      <option value="asc">Price: Low to High</option>
                      <option value="desc">Price: High to Low</option>
                      <option value="low">Budget (Under LKR 100)</option>
                      <option value="medium">Standard (LKR 100 - LKR 200)</option>
                      <option value="high">Luxury (Above LKR 200)</option>
                    </select>
                  </div>
                </div>
                <div className="filter-actions">
                  <button className="clear-button" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading rooms...</p>
            </div>
          ) : (
            <motion.div className="rooms-list" variants={containerVariants} initial="hidden" animate="visible">
              {displayedRooms.length > 0 ? (
                displayedRooms.map((room, index) => (
                  <motion.div
                    key={room._id}
                    variants={itemVariants}
                    className="room-card"
                    onMouseEnter={() => setHoveredRoom(room._id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="room-image-container">
                      <img
                        src={getRoomImageUrl(room) || "/placeholder.svg"}
                        alt={`${room.roomType} Room`}
                        className="room-image"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/luxury-hotel-room.png"
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
                      <div className="room-location">
                        <MapPin size={14} /> Cinnamon Red Hotel, Colombo
                      </div>
                      <div className="room-details">
                        <div className="room-detail">
                          <span className="detail-label">Room Number</span>
                          <span className="detail-value">{room.roomNumber}</span>
                        </div>
                        <div className="room-detail">
                          <span className="detail-label">Bed Type</span>
                          <span className="detail-value">{room.bedType}</span>
                        </div>
                        <div className="room-detail">
                          <span className="detail-label">Capacity</span>
                          <span className="detail-value">
                            <Users size={14} style={{ marginRight: 5, display: "inline" }} />
                            {getRoomCapacity(room.roomType)}{" "}
                            {getRoomCapacity(room.roomType) === 1 ? "Person" : "People"}
                          </span>
                        </div>
                      </div>
                      <p className="room-facilities">{room.facilities}</p>

                      <div className="amenities">
                        {["WiFi", "TV", "Coffee", "Bathroom"].map((amenity, i) => (
                          <div className="amenity" key={i}>
                            {getAmenityIcon(i)} {amenity}
                          </div>
                        ))}
                      </div>

                      <div className="room-status" style={getStatusStyle(room.status)}>
                        {room.status}
                      </div>

                      <div className="room-rating">
                        <div className="rating-stars">
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                          <Star
                            size={16}
                            fill={room.roomType === "VIP" || room.roomType === "King" ? "currentColor" : "none"}
                            stroke="currentColor"
                          />
                        </div>
                        <span className="rating-value">
                          {room.roomType === "VIP" || room.roomType === "King" ? "5.0" : "4.8"}
                        </span>
                      </div>

                      <motion.button
                        className="view-btn"
                        onClick={() => handleViewRoom(room)}
                        disabled={room.status !== "Available"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye size={16} className="eye-icon" /> View
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="no-rooms"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3>No rooms match your search criteria</h3>
                  <p>Try adjusting your filters or search query.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </>
      )}

      {/* Room Details Modal */}
      {showRoomModal && selectedRoom && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <motion.div
            className="room-modal"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Room Details</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Image Gallery */}
              <div className="modal-room-image">
                <div className="image-gallery-container">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={getRoomImageUrls(selectedRoom)[currentImageIndex] || "/placeholder.svg"}
                      alt={`${selectedRoom.roomType} Room`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/luxury-hotel-room.png"
                      }}
                    />
                  </AnimatePresence>

                  <div className="image-navigation">
                    <button className="nav-button" onClick={prevImage}>
                      <ChevronLeft size={20} />
                    </button>
                    <button className="nav-button" onClick={nextImage}>
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="image-counter">
                    {currentImageIndex + 1} / {getRoomImageUrls(selectedRoom).length}
                  </div>

                  <div className="view-all-images" onClick={toggleFullGallery}>
                    <span>View all photos</span>
                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="thumbnail-gallery">
                  {getRoomImageUrls(selectedRoom).map((img, idx) => (
                    <div
                      key={idx}
                      className={`thumbnail ${idx === currentImageIndex ? "active" : ""}`}
                      onClick={() => selectImage(idx)}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${selectedRoom.roomType} Room Thumbnail ${idx + 1}`}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/luxury-hotel-room.png"
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="modal-room-price">
                  LKR {selectedRoom.price}
                  <span>/night</span>
                </div>
              </div>

              <div className="modal-room-details">
                <h3>{selectedRoom.roomType} Room</h3>

                <div className="detail-row">
                  <div className="detail-label">Room Number:</div>
                  <div className="detail-value">{selectedRoom.roomNumber}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Bed Type:</div>
                  <div className="detail-value">{selectedRoom.bedType}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Status:</div>
                  <div className="detail-value" style={getStatusStyle(selectedRoom.status)}>
                    {selectedRoom.status}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Facilities:</div>
                  <div className="detail-value facilities-list">{selectedRoom.facilities}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Check-in:</div>
                  <div className="detail-value">{new Date(checkInDate).toLocaleDateString()}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Check-out:</div>
                  <div className="detail-value">{new Date(checkOutDate).toLocaleDateString()}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">Guests:</div>
                  <div className="detail-value">
                    {guestCount} {guestCount === 1 ? "person" : "people"}
                  </div>
                </div>

                <div className="total-price">
                  <span>Total Price:</span>
                  <span className="price">LKR {(selectedRoom.price * bookingDays).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="book-now-btn" onClick={handleBookNow}>
                Book Now
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Full Gallery Modal */}
      {showFullGallery && selectedRoom && (
        <div className="full-gallery-overlay">
          <div className="full-gallery-header">
            <div className="gallery-title">{selectedRoom.roomType} Room</div>
            <button className="close-gallery-btn" onClick={toggleFullGallery}>
              <X size={20} />
            </button>
          </div>

          <div className="full-gallery-content">
            <img
              src={getRoomImageUrls(selectedRoom)[currentImageIndex] || "/placeholder.svg"}
              alt={`${selectedRoom.roomType} Room`}
              className="full-gallery-image"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/luxury-hotel-room.png"
              }}
            />

            <div className="full-gallery-navigation">
              <button className="full-gallery-nav-button" onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
              <button className="full-gallery-nav-button" onClick={nextImage}>
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="full-gallery-counter">
            {currentImageIndex + 1} / {getRoomImageUrls(selectedRoom).length}
          </div>

          <div className="full-gallery-thumbnails">
            {getRoomImageUrls(selectedRoom).map((img, idx) => (
              <div
                key={idx}
                className={`full-gallery-thumbnail ${idx === currentImageIndex ? "active" : ""}`}
                onClick={() => selectImage(idx)}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`${selectedRoom.roomType} Room Thumbnail ${idx + 1}`}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/luxury-hotel-room.png"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AllRooms
