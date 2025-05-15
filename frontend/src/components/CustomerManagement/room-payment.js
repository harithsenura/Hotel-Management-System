"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CreditCard, Check, AlertCircle, FileText, Calendar, User, Home, Bed } from "lucide-react"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { getUser } from "../../services/userService"
import axios from "axios"

const RoomPayment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [roomData, setRoomData] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // 'success', 'error', or null
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [bookingId, setBookingId] = useState("")
  const [currentUser, setCurrentUser] = useState(null)
  const [debugInfo, setDebugInfo] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guestCount, setGuestCount] = useState(1)
  const [bookingDays, setBookingDays] = useState(1)

  // Get room data from location state
  useEffect(() => {
    if (location.state && location.state.roomData) {
      setRoomData(location.state.roomData)

      // Set check-in and check-out dates from location state
      if (location.state.checkInDate) setCheckInDate(location.state.checkInDate)
      if (location.state.checkOutDate) setCheckOutDate(location.state.checkOutDate)
      if (location.state.guestCount) setGuestCount(location.state.guestCount)

      // Calculate booking days
      if (location.state.checkInDate && location.state.checkOutDate) {
        const checkIn = new Date(location.state.checkInDate)
        const checkOut = new Date(location.state.checkOutDate)
        const diffTime = Math.abs(checkOut - checkIn)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        setBookingDays(diffDays)
      }
    } else {
      // If no room data, redirect back to rooms page
      navigate("/rooms")
    }

    // Generate a random booking ID
    const randomBookingId = "BKG-" + Math.floor(100000 + Math.random() * 900000)
    setBookingId(randomBookingId)
  }, [location.state, navigate])

  // Get user data
  useEffect(() => {
    const user = getUser()
    setCurrentUser(user)

    // Debug info
    if (user) {
      setDebugInfo(`User found: ${user.name}, ID: ${user._id || user.id || "No ID"}`)
    } else {
      setDebugInfo("No user found in localStorage")
    }

    // If we have a user, pre-fill the card name
    if (user) {
      setPaymentDetails((prev) => ({
        ...prev,
        cardName: user.name,
      }))
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    })

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const createTestUser = () => {
    const testUser = {
      _id: "test_user_" + Math.floor(Math.random() * 1000000),
      name: "Test User",
      email: "test@example.com",
      role: "user",
      address: "Kandy, Sri Lanka",
    }

    localStorage.setItem("user", JSON.stringify(testUser))
    setCurrentUser(testUser)
    setDebugInfo(`Created test user: ${testUser.name}, ID: ${testUser._id}`)

    // Pre-fill the card name
    setPaymentDetails((prev) => ({
      ...prev,
      cardName: testUser.name,
    }))

    return testUser
  }

  const createBooking = async () => {
    try {
      // Check if currentUser exists, if not create a test user
      let userForBooking = currentUser
      if (!userForBooking) {
        console.warn("No user found when creating booking, creating test user")
        userForBooking = createTestUser()
      }

      console.log("Current user:", userForBooking)

      // Make sure we have a user ID
      if (!userForBooking._id && !userForBooking.id) {
        console.error("User object exists but has no ID")
        alert("User ID not found. Creating a temporary user ID.")
        userForBooking._id = "temp_user_" + Math.floor(Math.random() * 1000000)
      }

      // Create booking in database
      const bookingData = {
        user: userForBooking._id || userForBooking.id,
        room: roomData._id,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        guestCount: guestCount,
        totalAmount: calculateTotal(),
        paymentMethod: "credit_card",
        paymentDetails: {
          cardLast4: paymentDetails.cardNumber.slice(-4) || "1234",
          cardBrand: "Visa", // Simplified for demo
        },
        status: "Confirmed",
        bookingId: bookingId,
      }

      // Log the booking data
      console.log("Creating booking with data:", bookingData)
      setDebugInfo((prev) => prev + "\nSending booking with user ID: " + bookingData.user)

      // Update room status to Booked
      await axios.patch(`http://localhost:5001/room/updateStatus/${roomData.roomNumber}`, {
        status: "Booked",
      })

      // Store booking in localStorage for backup
      try {
        const userBookings = localStorage.getItem("userBookings")
          ? JSON.parse(localStorage.getItem("userBookings"))
          : {}

        if (bookingData.user) {
          if (!userBookings[bookingData.user]) {
            userBookings[bookingData.user] = []
          }

          userBookings[bookingData.user].push({
            bookingId: bookingId,
            roomNumber: roomData.roomNumber,
            roomType: roomData.roomType,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            totalAmount: calculateTotal(),
          })

          localStorage.setItem("userBookings", JSON.stringify(userBookings))
          console.log("Booking stored in localStorage")
        }
      } catch (storageError) {
        console.error("Error storing booking in localStorage:", storageError)
      }

      return bookingData
    } catch (error) {
      console.error("Error creating booking:", error)
      setDebugInfo((prev) => prev + "\nError creating booking: " + error.message)
      if (error.response) {
        setDebugInfo((prev) => prev + "\nServer response: " + JSON.stringify(error.response.data))
      }
      return null
    }
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const centerX = pageWidth / 2

    // Add current date
    const today = new Date()
    const dateStr = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const timeStr = today.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Header
    doc.setFillColor(220, 20, 60) // #dc143c (crimson)
    doc.rect(0, 0, pageWidth, 40, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("ROOM BOOKING RECEIPT", centerX, 25, { align: "center" })

    // Booking details
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    doc.text(`Booking ID: ${bookingId}`, 15, 50)
    doc.text(`Date: ${dateStr}`, 15, 58)
    doc.text(`Time: ${timeStr}`, 15, 66)

    // Customer info
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Customer Information", 15, 80)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Name: ${paymentDetails.cardName || "Guest Customer"}`, 15, 90)
    doc.text(`Payment Method: Credit Card (xxxx-xxxx-xxxx-${paymentDetails.cardNumber.slice(-4) || "1234"})`, 15, 98)

    // Room details
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Room Details", 15, 115)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Room Type: ${roomData.roomType}`, 15, 125)
    doc.text(`Room Number: ${roomData.roomNumber}`, 15, 133)
    doc.text(`Bed Type: ${roomData.bedType}`, 15, 141)
    doc.text(`Check-in Date: ${new Date(checkInDate).toLocaleDateString()}`, 15, 149)
    doc.text(`Check-out Date: ${new Date(checkOutDate).toLocaleDateString()}`, 15, 157)
    doc.text(`Number of Guests: ${guestCount}`, 15, 165)
    doc.text(`Number of Days: ${bookingDays}`, 15, 173)

    // Payment summary
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Payment Summary", 15, 190)

    // Table for payment details
    const tableColumn = ["Description", "Price", "Days", "Total"]
    const tableRows = [
      [
        `${roomData.roomType} Room`,
        `$${roomData.price.toFixed(2)}/night`,
        bookingDays,
        `$${(roomData.price * bookingDays).toFixed(2)}`,
      ],
    ]

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 195,
      theme: "striped",
      headStyles: {
        fillColor: [220, 20, 60],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        cellPadding: 3,
      },
    })

    // Get the y position after the table
    const finalY = doc.lastAutoTable.finalY + 10

    // Tax and total
    const subtotal = roomData.price * bookingDays
    const tax = subtotal * 0.1
    const total = subtotal + tax

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, pageWidth - 60, finalY)
    doc.text(`Tax (10%): $${tax.toFixed(2)}`, pageWidth - 60, finalY + 8)

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(`Total: $${total.toFixed(2)}`, pageWidth - 60, finalY + 20)

    // Hotel policies
    const policiesY = finalY + 40
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Hotel Policies", 15, policiesY)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("• Check-in time: 2:00 PM", 15, policiesY + 10)
    doc.text("• Check-out time: 12:00 PM", 15, policiesY + 18)
    doc.text("• No smoking in rooms", 15, policiesY + 26)
    doc.text("• Pets are not allowed", 15, policiesY + 34)
    doc.text("• Cancellation must be made 24 hours before check-in to avoid charges", 15, policiesY + 42)

    // Footer
    doc.setFillColor(220, 20, 60)
    doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 20, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Thank you for choosing our hotel!", centerX, doc.internal.pageSize.getHeight() - 10, { align: "center" })

    // Save the PDF
    doc.save(`Room_Booking_Receipt_${bookingId}.pdf`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Skip validation for demo purposes
    setIsProcessing(true)

    // Show processing for a moment
    setTimeout(async () => {
      setIsProcessing(false)
      setShowSuccessAnimation(true)

      // After animation completes, show success message and generate PDF
      setTimeout(async () => {
        setPaymentStatus("success")

        // Create booking in database
        const booking = await createBooking()
        console.log("Booking created successfully:", booking)

        // Generate and download PDF
        generatePDF()

        // After 3 seconds, redirect to profile page or booking status page
        setTimeout(() => {
          navigate("/profile")
        }, 3000)
      }, 1500)
    }, 1500)
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const calculateTotal = () => {
    if (!roomData) return 0
    const subtotal = roomData.price * bookingDays
    const tax = subtotal * 0.1
    return subtotal + tax
  }

  // Generate years for dropdown (current year + 10 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = 0; i < 11; i++) {
      years.push(currentYear + i)
    }
    return years
  }

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Function to get the full image URL
  const getRoomImageUrl = (room) => {
    if (!room) return "/luxury-hotel-room.png"

    if (room.images && room.images.length > 0) {
      return `http://localhost:5001${room.images[0]}`
    } else if (room.image) {
      return `http://localhost:5001${room.image}`
    }

    return `/luxury-still-life.png?height=300&width=400&query=luxury ${room.roomType} hotel room`
  }

  if (!roomData) {
    return <div>Loading...</div>
  }

  return (
    <div className="payment-container">
      <style jsx>{`
        /* Global Styles */
        .payment-container {
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
          color: #333;
          position: relative;
        }
        
        /* Header Styles */
        .payment-header {
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
          margin-bottom: 1rem;
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
        
        /* Main Content */
        .payment-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .payment-content {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
        }
        
        /* Booking Summary */
        .booking-summary {
          background-color: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .summary-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #333;
        }
        
        .room-details {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .room-image {
          width: 120px;
          height: 120px;
          border-radius: 8px;
          object-fit: cover;
        }
        
        .room-info {
          flex-grow: 1;
        }
        
        .room-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .room-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: #dc143c;
          margin-bottom: 0.5rem;
        }
        
        .room-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }
        
        .meta-icon {
          color: #dc143c;
        }
        
        .booking-dates {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .date-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        
        .date-label {
          font-weight: 500;
          color: #666;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .date-value {
          font-weight: 600;
          color: #333;
        }
        
        .summary-totals {
          margin-top: 1.5rem;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .summary-row.total {
          font-size: 1.2rem;
          font-weight: 700;
          color: #333;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }
        
        /* Payment Form */
        .payment-form-container {
          background-color: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .payment-form-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #333;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #555;
        }
        
        .form-input {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #dc143c;
          box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
        }
        
        .form-input.error {
          border-color: #dc143c;
        }
        
        .error-message {
          color: #dc143c;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .expiry-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        
        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background-color: #dc143c;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }
        
        .submit-button:hover {
          background-color: #b30000;
        }
        
        .submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        /* Payment Status */
        .payment-status {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .payment-status.success {
          background-color: rgba(0, 128, 0, 0.1);
          color: green;
        }
        
        .payment-status.error {
          background-color: rgba(220, 20, 60, 0.1);
          color: #dc143c;
        }
        
        .status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        
        .status-icon.success {
          background-color: green;
          color: white;
        }
        
        .status-icon.error {
          background-color: #dc143c;
          color: white;
        }
        
        .status-message {
          font-weight: 500;
        }
        
        /* Card Icon */
        .card-icon {
          color: #dc143c;
        }
        
        /* Loading Spinner */
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Debug Info */
        .debug-info {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.85rem;
          white-space: pre-wrap;
          overflow-x: auto;
        }
        
        .debug-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .debug-button {
          padding: 0.5rem 1rem;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
        }
        
        .debug-button:hover {
          background-color: #e0e0e0;
        }
        
        /* Success Animation */
        .success-animation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .success-animation {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .success-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: #4CAF50;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: white;
          box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
        }
        
        .success-message {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        .success-submessage {
          font-size: 1rem;
          color: #666;
          text-align: center;
        }
        
        .checkmark {
          width: 60px;
          height: 60px;
        }
        
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: white;
          fill: none;
          animation: checkmark 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke-width: 3;
          stroke: white;
          fill: none;
          animation: checkmark 0.3s 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .pdf-notification {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #4CAF50;
        }
      `}</style>

      {/* Header */}
      <header className="payment-header">
        <div className="header-top">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={18} />
            Back to Room Details
          </button>

          <h1 className="page-title">Room Booking Checkout</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="payment-content">
        {/* Booking Summary */}
        <div className="booking-summary">
          <h2 className="summary-title">Booking Summary</h2>

          <div className="room-details">
            <img
              src={getRoomImageUrl(roomData) || "/placeholder.svg"}
              alt={`${roomData.roomType} Room`}
              className="room-image"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/luxury-hotel-room.png"
              }}
            />
            <div className="room-info">
              <h3 className="room-name">{roomData.roomType} Room</h3>
              <div className="room-price">
                ${roomData.price.toFixed(2)}
                <span>/night</span>
              </div>
              <div className="room-meta">
                <div className="meta-item">
                  <Bed size={16} className="meta-icon" />
                  {roomData.bedType}
                </div>
                <div className="meta-item">
                  <Home size={16} className="meta-icon" />
                  Room #{roomData.roomNumber}
                </div>
                <div className="meta-item">
                  <User size={16} className="meta-icon" />
                  {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
                </div>
              </div>
            </div>
          </div>

          <div className="booking-dates">
            <div className="date-row">
              <div className="date-label">
                <Calendar size={16} className="meta-icon" />
                Check-in Date
              </div>
              <div className="date-value">{new Date(checkInDate).toLocaleDateString()}</div>
            </div>
            <div className="date-row">
              <div className="date-label">
                <Calendar size={16} className="meta-icon" />
                Check-out Date
              </div>
              <div className="date-value">{new Date(checkOutDate).toLocaleDateString()}</div>
            </div>
            <div className="date-row">
              <div className="date-label">Duration</div>
              <div className="date-value">
                {bookingDays} {bookingDays === 1 ? "Night" : "Nights"}
              </div>
            </div>
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Room Rate</span>
              <span>
                ${roomData.price.toFixed(2)} × {bookingDays} nights
              </span>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${(roomData.price * bookingDays).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${(roomData.price * bookingDays * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Debug Info */}
          <div className="debug-info">
            <strong>Debug Info:</strong>
            <div>{debugInfo}</div>
            <div className="debug-actions">
              <button className="debug-button" onClick={createTestUser}>
                Create Test User
              </button>
              <button
                className="debug-button"
                onClick={() => {
                  const userStr = localStorage.getItem("user")
                  setDebugInfo(`User in localStorage: ${userStr || "None"}`)
                }}
              >
                Check User
              </button>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="payment-form-container">
          <h2 className="payment-form-title">
            <CreditCard size={20} className="card-icon" />
            Payment Details
          </h2>

          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cardName" className="form-label">
                Cardholder Name
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                className={`form-input ${errors.cardName ? "error" : ""}`}
                placeholder="Name on card"
                value={paymentDetails.cardName}
                onChange={handleInputChange}
              />
              {errors.cardName && <div className="error-message">{errors.cardName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber" className="form-label">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                className={`form-input ${errors.cardNumber ? "error" : ""}`}
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => {
                  const formattedValue = formatCardNumber(e.target.value)
                  setPaymentDetails({
                    ...paymentDetails,
                    cardNumber: formattedValue,
                  })
                  if (errors.cardNumber) {
                    setErrors({
                      ...errors,
                      cardNumber: null,
                    })
                  }
                }}
                maxLength={19}
              />
              {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <div className="expiry-inputs">
                  <select
                    name="expiryMonth"
                    className={`form-input ${errors.expiryMonth ? "error" : ""}`}
                    value={paymentDetails.expiryMonth}
                    onChange={handleInputChange}
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month.toString().padStart(2, "0")}>
                        {month.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <select
                    name="expiryYear"
                    className={`form-input ${errors.expiryYear ? "error" : ""}`}
                    value={paymentDetails.expiryYear}
                    onChange={handleInputChange}
                  >
                    <option value="">Year</option>
                    {generateYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                {(errors.expiryMonth || errors.expiryYear) && (
                  <div className="error-message">{errors.expiryMonth || errors.expiryYear}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cvv" className="form-label">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  className={`form-input ${errors.cvv ? "error" : ""}`}
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  maxLength={4}
                />
                {errors.cvv && <div className="error-message">{errors.cvv}</div>}
              </div>
            </div>

            {/* Only show the Pay button when card details are filled */}
            {paymentDetails.cardName &&
            paymentDetails.cardNumber &&
            paymentDetails.expiryMonth &&
            paymentDetails.expiryYear &&
            paymentDetails.cvv ? (
              <button type="submit" className="submit-button" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>Pay ${calculateTotal().toFixed(2)}</>
                )}
              </button>
            ) : null}

            {paymentStatus === "success" && (
              <>
                <div className="payment-status success">
                  <div className="status-icon success">
                    <Check size={18} />
                  </div>
                  <div className="status-message">Payment successful! Redirecting you shortly...</div>
                </div>
                <div className="pdf-notification">
                  <FileText size={16} />
                  Receipt has been downloaded as PDF
                </div>
              </>
            )}

            {paymentStatus === "error" && (
              <div className="payment-status error">
                <div className="status-icon error">
                  <AlertCircle size={18} />
                </div>
                <div className="status-message">
                  Payment failed. Please try again or use a different payment method.
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            className="success-animation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="success-animation"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                className="success-icon"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </motion.div>
              <motion.h2
                className="success-message"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Booking Confirmed!
              </motion.h2>
              <motion.p
                className="success-submessage"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Your room has been successfully booked.
              </motion.p>
              <motion.p
                className="success-submessage"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <FileText size={16} style={{ marginRight: "5px", verticalAlign: "middle" }} />
                Downloading your receipt...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RoomPayment
