"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CreditCard, Check, AlertCircle, FileText } from "lucide-react"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { getUser } from "../../services/userService"
import axios from "axios"

const GiftPayment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [cart, setCart] = useState([])
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  })
  const [groupContributors, setGroupContributors] = useState({})
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // 'success', 'error', or null
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [currentUser, setCurrentUser] = useState(null)
  const [debugInfo, setDebugInfo] = useState("")

  // Add these validation functions
  const validateCardName = (name) => {
    if (!name || name.trim().length < 2) {
      return "Cardholder name is required"
    }
    return null
  }

  const validateCardNumber = (number) => {
    const cardNumberRegex = /^[\d\s]{13,19}$/
    if (!number || !cardNumberRegex.test(number)) {
      return "Valid card number is required (13-19 digits)"
    }
    return null
  }

  const validateExpiryMonth = (month) => {
    if (!month) {
      return "Expiry month is required"
    }
    return null
  }

  const validateExpiryYear = (year) => {
    if (!year) {
      return "Expiry year is required"
    }
    return null
  }

  const validateCVV = (cvv) => {
    const cvvRegex = /^[0-9]{3,4}$/
    if (!cvv || !cvvRegex.test(cvv)) {
      return "Valid CVV is required (3-4 digits)"
    }
    return null
  }

  // Add this function to validate all fields
  const validateForm = () => {
    const newErrors = {
      cardName: validateCardName(paymentDetails.cardName),
      cardNumber: validateCardNumber(paymentDetails.cardNumber),
      expiryMonth: validateExpiryMonth(paymentDetails.expiryMonth),
      expiryYear: validateExpiryYear(paymentDetails.expiryYear),
      cvv: validateCVV(paymentDetails.cvv),
    }

    setErrors(newErrors)

    // Form is valid if there are no error messages
    return !Object.values(newErrors).some((error) => error !== null)
  }

  // Get cart data from location state or localStorage
  useEffect(() => {
    if (location.state && location.state.cart) {
      setCart(location.state.cart)
    } else {
      // Try to get from localStorage as fallback
      const savedCart = localStorage.getItem("giftCart")
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (err) {
          console.error("Error parsing cart from localStorage:", err)
          setCart([])
        }
      } else {
        // If no cart data, redirect back to gift selection
        navigate("/gifts/showevents")
      }
    }

    // Generate a random order ID
    const randomOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000)
    setOrderId(randomOrderId)
  }, [location.state, navigate])

  // Add this with the other useEffect hooks
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

  const handleContributorChange = (giftId, index, value) => {
    setGroupContributors((prev) => {
      const updatedContributors = { ...prev }
      if (!updatedContributors[giftId]) {
        updatedContributors[giftId] = []
      }
      updatedContributors[giftId][index] = value
      return updatedContributors
    })
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

  const createOrder = async () => {
    try {
      // Check if currentUser exists, if not create a test user
      let userForOrder = currentUser
      if (!userForOrder) {
        console.warn("No user found when creating order, creating test user")
        userForOrder = createTestUser()
      }

      console.log("Current user:", userForOrder)

      // Make sure we have a user ID
      if (!userForOrder._id && !userForOrder.id) {
        console.error("User object exists but has no ID")
        alert("User ID not found. Creating a temporary user ID.")
        userForOrder._id = "temp_user_" + Math.floor(Math.random() * 1000000)
      }

      // Format contributors for each group gift
      const itemsWithContributors = cart.map((item) => {
        if (item.giftType === "group") {
          const contributors = [paymentDetails.cardName || "You"]
          const otherContributors = groupContributors[item.gift._id] || []

          // Add other contributors that have names
          otherContributors.forEach((name) => {
            if (name && name.trim()) {
              contributors.push(name.trim())
            }
          })

          return {
            ...item,
            gift: item.gift._id,
            contributors,
          }
        }

        return {
          ...item,
          gift: item.gift._id,
        }
      })

      // Create order in database
      const orderData = {
        user: userForOrder._id || userForOrder.id, // Ensure user ID is included
        orderType: "gift",
        items: itemsWithContributors,
        totalAmount: calculateTotal() * 1.1, // Including tax
        paymentMethod: "credit_card",
        paymentDetails: {
          cardLast4: paymentDetails.cardNumber.slice(-4) || "1234",
          cardBrand: "Visa", // Simplified for demo
        },
        deliveryAddress: userForOrder.address || "Kandy, Sri Lanka",
      }

      // Log the order data to verify user ID is included
      console.log("Creating order with data:", orderData)
      console.log("User ID in order data:", orderData.user)
      setDebugInfo((prev) => prev + "\nSending order with user ID: " + orderData.user)

      // Store order ID
      const response = await axios.post("http://localhost:5001/gift-orders", orderData)
      console.log("Order creation response:", response.data)
      setDebugInfo((prev) => prev + "\nOrder created successfully: " + JSON.stringify(response.data))

      if (response.data && response.data.data) {
        setOrderId(response.data.data._id || orderId)

        // Mark gifts as sold - handle errors gracefully
        for (const item of cart) {
          try {
            await axios.put(`http://localhost:5001/gifts/${item.gift._id}`, {
              sold: true,
            })
          } catch (err) {
            console.error("Error marking gift as sold:", err)
            // Continue with the order even if marking as sold fails
          }
        }

        // Store the order in localStorage for backup
        try {
          // Store the order ID in localStorage to ensure we can find it later
          const orderedGifts = localStorage.getItem("orderedGifts")
            ? JSON.parse(localStorage.getItem("orderedGifts"))
            : []

          orderedGifts.push(response.data.data._id)
          localStorage.setItem("orderedGifts", JSON.stringify(orderedGifts))

          // Also store the user's orders
          const userOrders = localStorage.getItem("userOrders") ? JSON.parse(localStorage.getItem("userOrders")) : {}

          if (orderData.user) {
            if (!userOrders[orderData.user]) {
              userOrders[orderData.user] = []
            }

            userOrders[orderData.user].push(response.data.data._id)
            localStorage.setItem("userOrders", JSON.stringify(userOrders))

            console.log("Order stored in localStorage:", {
              orderId: response.data.data._id,
              userId: orderData.user,
            })
          }
        } catch (storageError) {
          console.error("Error storing order in localStorage:", storageError)
        }

        return response.data.data
      }

      return null
    } catch (error) {
      console.error("Error creating order:", error)
      setDebugInfo((prev) => prev + "\nError creating order: " + error.message)
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
    doc.text("PAYMENT RECEIPT", centerX, 25, { align: "center" })

    // Order details
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    doc.text(`Order ID: ${orderId}`, 15, 50)
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

    // Order summary
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Order Summary", 15, 115)

    // Table for items
    const tableColumn = ["Item", "Type", "Quantity", "Price", "Total"]
    const tableRows = []

    cart.forEach((item) => {
      const giftType = item.giftType === "individual" ? "Individual Gift" : `Group Gift (${item.groupSize})`
      const itemTotal = item.gift.price * item.quantity

      tableRows.push([
        item.gift.name,
        giftType,
        item.quantity,
        `LKR ${item.gift.price.toFixed(2)}`,
        `LKR ${itemTotal.toFixed(2)}`,
      ])
    })

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 120,
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

    // Payment summary
    const subtotal = calculateTotal()
    const tax = subtotal * 0.1
    const total = subtotal + tax

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Subtotal: LKR ${subtotal.toFixed(2)}`, pageWidth - 60, finalY)
    doc.text(`Tax (10%): LKR ${tax.toFixed(2)}`, pageWidth - 60, finalY + 8)
    doc.text(`Shipping: Free`, pageWidth - 60, finalY + 16)

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(`Total: LKR ${total.toFixed(2)}`, pageWidth - 60, finalY + 28)

    // Group contributors section (if any)
    let groupY = finalY + 40
    let hasGroupGifts = false

    cart.forEach((item) => {
      if (item.giftType === "group") {
        hasGroupGifts = true

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text(`Group Gift: ${item.gift.name} - Contributors`, 15, groupY)
        groupY += 8

        doc.setFont("helvetica", "normal")
        doc.text(`1. ${paymentDetails.cardName || "You"} (Primary)`, 20, groupY)
        groupY += 8

        // Add other contributors
        const contributors = groupContributors[item.gift._id] || []
        for (let i = 0; i < item.groupSize - 1; i++) {
          const name = contributors[i] || `Contributor ${i + 2}`
          doc.text(`${i + 2}. ${name}`, 20, groupY)
          groupY += 8
        }

        groupY += 5 // Add some space between gift groups
      }
    })

    // Footer
    let footerY = hasGroupGifts ? groupY + 10 : finalY + 40

    // Add a new page if footer would go off the page
    if (footerY > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage()
      footerY = 20
    }

    doc.setFillColor(220, 20, 60)
    doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 20, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Thank you for your purchase!", centerX, doc.internal.pageSize.getHeight() - 10, { align: "center" })

    // Save the PDF
    doc.save(`Receipt-${orderId}.pdf`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate the form
    if (!validateForm()) {
      return // Stop submission if validation fails
    }

    setIsProcessing(true)

    // Show processing for a moment
    setTimeout(async () => {
      setIsProcessing(false)
      setShowSuccessAnimation(true)

      // After animation completes, show success message and generate PDF
      setTimeout(async () => {
        setPaymentStatus("success")

        // Create order in database
        const order = await createOrder()
        console.log("Order created successfully:", order)

        // Generate and download PDF
        generatePDF()

        // Clear cart from localStorage
        localStorage.removeItem("giftCart")

        // After 3 seconds, redirect to order status page
        setTimeout(() => {
          if (order) {
            navigate(`/gifts/status/${order._id}`)
          } else {
            navigate("/gifts/showevents")
          }
        }, 3000)
      }, 1500)
    }, 1500)
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.gift.price * item.quantity, 0)
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
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/colorful-gift-box.png"
    if (imagePath.startsWith("http")) return imagePath
    return `http://localhost:5001${imagePath}`
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
        
        /* Order Summary */
        .order-summary {
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
        
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .cart-item {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .cart-item-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
        }
        
        .cart-item-details {
          flex-grow: 1;
        }
        
        .cart-item-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #333;
        }
        
        .cart-item-price {
          font-size: 0.9rem;
          font-weight: 600;
          color: #dc143c;
          margin-bottom: 0.25rem;
        }
        
        .cart-item-meta {
          font-size: 0.85rem;
          color: #666;
        }
        
        .summary-totals {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f0f0;
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

        .gift-type-badge {
          font-weight: 600;
          color: #dc143c;
        }

        .group-contributors {
          margin-top: 1rem;
          padding-top: 0.5rem;
          border-top: 1px dashed #e0e0e0;
        }

        .contributors-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #dc143c;
        }

        .contributors-description {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0.75rem;
          font-style: italic;
        }

        .contributors-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contributor-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .contributor-number {
          font-size: 0.85rem;
          font-weight: 600;
          color: #666;
          width: 20px;
        }

        .contributor-name {
          font-size: 0.9rem;
          color: #333;
        }

        .contributor-input {
          flex-grow: 1;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          font-size: 0.9rem;
        }

        .contributor-input:focus {
          outline: none;
          border-color: #dc143c;
          box-shadow: 0 0 0 2px rgba(220, 20, 60, 0.1);
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

        /* Add these new styles */
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .clear-input {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: #999;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .clear-input:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #666;
        }

        .form-input {
          width: 100%;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-input:focus {
          transform: scale(1.01);
        }

        /* Animated timer styles */
        .timer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1rem 0;
          animation: fadeIn 0.5s ease-out;
        }

        .timer-circle {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 0.5rem;
        }

        .timer-background {
          fill: none;
          stroke: #f0f0f0;
          stroke-width: 8;
        }

        .timer-progress {
          fill: none;
          stroke: #4CAF50;
          stroke-width: 8;
          stroke-linecap: round;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 0.5s ease;
        }

        .timer-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1.2rem;
          font-weight: 600;
          font-family: monospace;
          color: #333;
        }

        .timer-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Header */}
      <header className="payment-header">
        <div className="header-top">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <h1 className="page-title">Checkout</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="payment-content">
        {/* Order Summary */}
        <div className="order-summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img
                  src={getImageUrl(item.gift.image) || "/placeholder.svg"}
                  alt={item.gift.name}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/empty-cardboard-box.png"
                  }}
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.gift.name}</h3>
                  <div className="cart-item-price">LKR {item.gift.price.toFixed(2)}</div>
                  <div className="cart-item-meta">
                    Quantity: {item.quantity} |
                    <span className="gift-type-badge">
                      {item.giftType === "individual" ? " Individual Gift" : " Group Gift"}
                    </span>
                  </div>

                  {item.giftType === "group" && (
                    <div className="group-contributors">
                      <h4 className="contributors-title">Add Group Contributors ({item.groupSize})</h4>
                      <p className="contributors-description">
                        Please add the names of people contributing to this group gift
                      </p>
                      <div className="contributors-list">
                        <div className="contributor-item">
                          <span className="contributor-number">1.</span>
                          <span className="contributor-name">{currentUser ? currentUser.name : "You"} (Primary)</span>
                        </div>

                        {Array.from({ length: item.groupSize - 1 }, (_, i) => (
                          <div key={i} className="contributor-item">
                            <span className="contributor-number">{i + 2}.</span>
                            <input
                              type="text"
                              className="contributor-input"
                              placeholder={`Contributor ${i + 2} name`}
                              value={(groupContributors[item.gift._id] || [])[i] || ""}
                              onChange={(e) => handleContributorChange(item.gift._id, i, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>LKR {calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>LKR {(calculateTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>LKR {(calculateTotal() * 1.1).toFixed(2)}</span>
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
              <div className="input-wrapper">
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  className={`form-input ${errors.cardName ? "error" : ""}`}
                  placeholder="Name on card"
                  value={paymentDetails.cardName}
                  onChange={handleInputChange}
                />
                {paymentDetails.cardName && (
                  <button
                    type="button"
                    className="clear-input"
                    onClick={() => {
                      setPaymentDetails({ ...paymentDetails, cardName: "" })
                      setErrors({ ...errors, cardName: null })
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              {errors.cardName && <div className="error-message">{errors.cardName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber" className="form-label">
                Card Number
              </label>
              <div className="input-wrapper">
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
                {paymentDetails.cardNumber && (
                  <button
                    type="button"
                    className="clear-input"
                    onClick={() => {
                      setPaymentDetails({ ...paymentDetails, cardNumber: "" })
                      setErrors({ ...errors, cardNumber: null })
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
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
                <div className="input-wrapper">
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
                  {paymentDetails.cvv && (
                    <button
                      type="button"
                      className="clear-input"
                      onClick={() => {
                        setPaymentDetails({ ...paymentDetails, cvv: "" })
                        setErrors({ ...errors, cvv: null })
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
                {errors.cvv && <div className="error-message">{errors.cvv}</div>}
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={
                isProcessing ||
                !paymentDetails.cardName ||
                !paymentDetails.cardNumber ||
                !paymentDetails.expiryMonth ||
                !paymentDetails.expiryYear ||
                !paymentDetails.cvv
              }
            >
              {isProcessing ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>Pay LKR {(calculateTotal() * 1.1).toFixed(2)}</>
              )}
            </button>

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
                Payment Successful!
              </motion.h2>
              <motion.p
                className="success-submessage"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Your gift order has been confirmed.
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

export default GiftPayment
