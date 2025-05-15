"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUser, logout } from "../../services/userService"
import axios from "axios"
import {
  User,
  Package,
  ShoppingBag,
  CreditCard,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Edit,
  Calendar,
  MapPin,
  Phone,
  Bell,
  Search,
  FileText,
  Download,
  Eye,
  DollarSign,
  ShoppingCart,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import jsPDF from "jspdf"

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [foodOrders, setFoodOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [foodOrdersLoading, setFoodOrdersLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedFoodOrder, setSelectedFoodOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  // Get user from localStorage
  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      navigate("/login")
      return
    }
    setUser(currentUser)
    setIsLoading(false)
  }, [navigate])

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id) return

      try {
        setOrdersLoading(true)
        const response = await axios.get(`/api/orders/user/${user._id}`)
        setOrders(response.data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setOrdersLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  // Fetch food orders (bills)
  useEffect(() => {
    const fetchFoodOrders = async () => {
      if (!user || !user._id) return

      try {
        setFoodOrdersLoading(true)
        // Assuming we have an endpoint to get bills by user ID or phone number
        // If not, we can filter from all bills based on user info
        const response = await axios.get(`/api/bills/get-bills`)

        // Filter bills that match the current user's name or phone number
        const userBills = response.data.filter(
          (bill) => bill.customerName === user.name || bill.customerNumber === user.phone,
        )

        setFoodOrders(userBills)
      } catch (error) {
        console.error("Error fetching food orders:", error)
      } finally {
        setFoodOrdersLoading(false)
      }
    }

    if (user) {
      fetchFoodOrders()
    }
  }, [user])

  // Handle scroll events for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Get user's first initial for avatar
  const getUserInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase()
    }
    return "U"
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Generate and download PDF invoice for food order
  const generateFoodOrderPDF = (order) => {
    if (!order) return

    const doc = new jsPDF()
    const currentDate = new Date()

    // Format the current date and time
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`

    // Add page border
    const margin = 10
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin)

    // Header section
    doc.setFontSize(18)
    doc.setTextColor(40)

    // Title split into three lines with the word "Red" in red color
    doc.setFont("helvetica", "bold")
    doc.text("Cinnamon", 105, 20, { align: "center" })
    doc.setTextColor("#800000")
    doc.text("Red", 105, 30, { align: "center" })
    doc.setTextColor(40)
    doc.text("Colombo", 105, 40, { align: "center" })

    // Add a little space between the title and the date
    doc.setFontSize(12)
    doc.text(`Date: ${formattedDate}`, 20, 55)

    // Bill ID
    doc.text(`Bill ID: ${order._id}`, 20, 65)

    // Divider line
    doc.line(20, 70, 190, 70)

    // Customer Details Section
    doc.setFontSize(14)
    doc.text("Customer Details", 20, 80)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Customer Name: ${order.customerName}`, 20, 90)
    doc.text(`Contact Number: ${order.customerNumber}`, 20, 100)

    // Invoice Details Section
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Invoice Summary", 20, 115)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.text(`Sub Total: LKR ${order.subTotal}`, 20, 125)
    doc.text(`Tax: LKR ${order.tax}`, 20, 135)
    doc.text(`Total Amount: LKR ${order.totalAmount}`, 20, 145)

    // Cart Items Section
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Cart Items", 20, 160)

    // Table for Cart Items
    let yPosition = 170

    // Column Headers
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Item", 20, yPosition)
    doc.text("Quantity", 100, yPosition)
    doc.text("Price (LKR)", 150, yPosition)
    yPosition += 10

    // Draw a line under the headers
    doc.line(20, yPosition, 190, yPosition)
    yPosition += 5

    // Add Cart Items
    order.cartItems.forEach((item) => {
      // Calculate prices
      const totalPrice = item.price > 0 ? item.price * item.quantity : 0
      const totalBPrice = item.Bprice > 0 ? item.Bprice * item.quantity : 0
      const totalSPrice = item.Sprice > 0 ? item.Sprice * item.quantity : 0

      // Create a formatted price string
      let priceDetails = `LKR ${totalPrice}`
      if (totalBPrice > 0) {
        priceDetails += `, LKR ${totalBPrice}`
      }
      if (totalSPrice > 0) {
        priceDetails += `, LKR ${totalSPrice}`
      }

      // Add item details
      doc.setFont("helvetica", "normal")
      doc.text(item.name, 20, yPosition)
      doc.text(String(item.quantity), 100, yPosition)
      doc.text(priceDetails, 150, yPosition)

      // Move down for the next item
      yPosition += 10
    })

    // Add footer with thank you message
    doc.setFontSize(10)
    doc.setFont("helvetica", "italic")
    doc.text("Thank you for shopping with us!", 105, pageHeight - margin, { align: "center" })

    // Save the PDF
    doc.save(`food_invoice_${order.customerName}.pdf`)
  }

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedFoodOrder(order)
    setShowOrderModal(true)
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p className="loading-text">Loading Profile</p>
      </div>
    )
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <div className="profile-container">
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
          background-color: #f8fafc;
        }
        
        /* Loading Screen */
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        
        .spinner {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(99, 102, 241, 0.2);
          border-radius: 50%;
          border-top-color: #6366f1;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 20px;
        }
        
        .loading-text {
          font-size: 24px;
          font-weight: 600;
          color: #6366f1;
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

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 16px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          transition: all 0.3s ease;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .logo {
          height: 40px;
          transition: all 0.3s ease;
        }
        
        .nav-links {
          display: flex;
          gap: 30px;
        }
        
        .nav-link {
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #6366f1;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover {
          color: #1e293b;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-icon-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-icon-btn:hover {
          background-color: #f1f5f9;
          color: #1e293b;
        }
        
        /* Profile Container */
        .profile-container {
          padding-top: 80px;
          min-height: 100vh;
          background-color: #f8fafc;
        }
        
        .profile-header {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          padding: 60px 40px 30px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .profile-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
          animation: rotate 30s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .profile-header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 30px;
          position: relative;
          z-index: 1;
        }
        
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: white;
          color: #6366f1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 700;
          font-size: 48px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border: 4px solid rgba(255, 255, 255, 0.8);
          animation: float 6s ease-in-out infinite;
        }
        
        .profile-info {
          flex: 1;
          animation: slideInRight 0.8s ease-out;
        }
        
        .profile-name {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .profile-email {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 15px;
        }
        
        .profile-meta {
          display: flex;
          gap: 20px;
          font-size: 0.9rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .edit-profile-btn {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(5px);
        }
        
        .edit-profile-btn:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        
        /* Profile Navigation */
        .profile-nav {
          background-color: white;
          padding: 0 40px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 70px;
          z-index: 100;
        }
        
        .profile-nav-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
        }
        
        .profile-nav-content::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }
        
        .profile-nav-item {
          padding: 20px 25px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          position: relative;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }
        
        .profile-nav-item:hover {
          color: #1e293b;
        }
        
        .profile-nav-item.active {
          color: #6366f1;
        }
        
        .profile-nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #6366f1;
        }
        
        /* Profile Content */
        .profile-content {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 40px;
          animation: fadeIn 0.5s ease;
        }
        
        .profile-section {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          padding: 30px;
          margin-bottom: 30px;
          transition: all 0.3s ease;
        }

        .profile-section:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transform: translateY(-5px);
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 25px;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .section-title-icon {
          color: #6366f1;
        }
        
        /* Profile Details */
        .profile-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .detail-item:hover {
          transform: translateX(5px);
        }
        
        .detail-label {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 5px;
        }
        
        .detail-value {
          font-size: 1.1rem;
          font-weight: 500;
          color: #1e293b;
        }
        
        /* Orders Section */
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .order-card {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: all 0.3s ease;
          border-left: 4px solid #6366f1;
        }
        
        .order-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        }
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .order-id {
          font-weight: 600;
          color: #1e293b;
        }
        
        .order-date {
          font-size: 0.9rem;
          color: #64748b;
        }
        
        .order-status {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-pending {
          background-color: #fef9c3;
          color: #ca8a04;
        }
        
        .status-delivered {
          background-color: #dcfce7;
          color: #16a34a;
        }
        
        .status-processing {
          background-color: #dbeafe;
          color: #2563eb;
        }
        
        .order-items {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .order-item {
          background-color: white;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.9rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .order-item:hover {
          transform: scale(1.05);
        }
        
        .order-total {
          font-weight: 600;
          color: #1e293b;
          align-self: flex-end;
        }
        
        .order-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .order-btn {
          padding: 8px 15px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .view-btn {
          background-color: #6366f1;
          color: white;
        }
        
        .view-btn:hover {
          background-color: #4f46e5;
          transform: translateY(-2px);
        }

        .download-btn {
          background-color: #10b981;
          color: white;
        }
        
        .download-btn:hover {
          background-color: #059669;
          transform: translateY(-2px);
        }
        
        .no-orders {
          text-align: center;
          padding: 40px 20px;
          color: #64748b;
        }
        
        .orders-loading {
          display: flex;
          justify-content: center;
          padding: 40px 0;
        }

        /* Food Order Modal */
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

        .order-modal {
          background-color: white;
          border-radius: 16px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .order-modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-modal-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #1e293b;
        }

        .close-modal {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background-color: #f1f5f9;
        }

        .close-modal:hover {
          background-color: #e2e8f0;
          color: #1e293b;
        }

        .order-modal-content {
          padding: 1.5rem;
          overflow-y: auto;
          flex-grow: 1;
        }

        .order-detail-section {
          margin-bottom: 1.5rem;
        }

        .order-detail-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .order-detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .order-detail-label {
          font-weight: 500;
          color: #64748b;
        }

        .order-detail-value {
          font-weight: 600;
          color: #1e293b;
        }

        .order-items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .order-items-table th {
          text-align: left;
          padding: 0.75rem;
          background-color: #f8fafc;
          color: #64748b;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .order-items-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
        }

        .order-modal-footer {
          padding: 1.5rem;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .order-modal-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .download-invoice-btn {
          background-color: #10b981;
          color: white;
        }

        .download-invoice-btn:hover {
          background-color: #059669;
          transform: translateY(-2px);
        }

        .close-btn {
          background-color: #f1f5f9;
          color: #64748b;
        }

        .close-btn:hover {
          background-color: #e2e8f0;
          color: #1e293b;
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
          .profile-details {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .profile-header-content {
            flex-direction: column;
            text-align: center;
          }
          
          .profile-meta {
            justify-content: center;
          }
          
          .edit-profile-btn {
            margin: 15px auto 0;
          }
          
          .profile-nav-item {
            padding: 15px;
          }
          
          .profile-content {
            padding: 0 20px;
          }

          .order-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .order-btn {
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .navbar {
            padding: 15px 20px;
          }
          
          .profile-header {
            padding: 50px 20px 25px;
          }
          
          .profile-avatar {
            width: 100px;
            height: 100px;
            font-size: 40px;
          }
          
          .profile-name {
            font-size: 1.8rem;
          }
          
          .profile-meta {
            flex-direction: column;
            gap: 10px;
            align-items: center;
          }
          
          .profile-section {
            padding: 20px;
          }
          
          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <img
          src={"/placeholder.svg?height=40&width=120&query=modern hotel logo"}
          alt="Hotel Logo"
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        <div className="nav-links">
          <a href="/" className="nav-link">
            Home
          </a>
          <a href="/#novelty" className="nav-link">
            Gift Selection
          </a>
          <a href="/#food" className="nav-link">
            Food
          </a>
          <a href="/#features" className="nav-link">
            Features
          </a>
          <a href="/#contact" className="nav-link">
            Contact
          </a>
        </div>

        <div className="nav-actions">
          <button className="nav-icon-btn">
            <Search size={18} />
          </button>
          <button className="nav-icon-btn">
            <Bell size={18} />
          </button>
          <div
            className="user-avatar"
            onClick={handleLogout}
            style={{
              cursor: "pointer",
              width: 40,
              height: 40,
              backgroundColor: "#6366f1",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              fontWeight: 600,
              transition: "all 0.3s ease",
            }}
          >
            {getUserInitial()}
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <motion.div
        className="profile-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-header-content">
          <motion.div
            className="profile-avatar"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {getUserInitial()}
          </motion.div>
          <div className="profile-info">
            <motion.h1
              className="profile-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {user.name}
            </motion.h1>
            <motion.p
              className="profile-email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {user.email}
            </motion.p>
            <motion.div
              className="profile-meta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="meta-item">
                <Calendar size={16} />
                <span>Joined {user.createdAt ? formatDate(user.createdAt) : "Recently"}</span>
              </div>
              {user.phone && (
                <div className="meta-item">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.address && (
                <div className="meta-item">
                  <MapPin size={16} />
                  <span>{user.address}</span>
                </div>
              )}
            </motion.div>
            <motion.button
              className="edit-profile-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit size={16} />
              Edit Profile
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Profile Navigation */}
      <div className="profile-nav">
        <div className="profile-nav-content">
          <motion.div
            className={`profile-nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <User size={18} />
            Profile
          </motion.div>
          <motion.div
            className={`profile-nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <Package size={18} />
            My Orders
          </motion.div>
          <motion.div
            className={`profile-nav-item ${activeTab === "food" ? "active" : ""}`}
            onClick={() => setActiveTab("food")}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <ShoppingBag size={18} />
            Food Orders
          </motion.div>
          <motion.div
            className={`profile-nav-item ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <CreditCard size={18} />
            Payment Methods
          </motion.div>
          <motion.div
            className={`profile-nav-item ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <Heart size={18} />
            Favorites
          </motion.div>
          <motion.div
            className={`profile-nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <Settings size={18} />
            Settings
          </motion.div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div key="profile" initial="hidden" animate="visible" exit="exit" variants={tabVariants}>
              <motion.div
                className="profile-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="section-title">
                  <User className="section-title-icon" size={22} />
                  Personal Information
                </h2>
                <div className="profile-details">
                  <motion.div
                    className="detail-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{user.name}</span>
                  </motion.div>
                  <motion.div
                    className="detail-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{user.email}</span>
                  </motion.div>
                  <motion.div
                    className="detail-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{user.phone || "Not provided"}</span>
                  </motion.div>
                  <motion.div
                    className="detail-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{user.address || "Not provided"}</span>
                  </motion.div>
                  <motion.div
                    className="detail-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">{user.createdAt ? formatDate(user.createdAt) : "Recently"}</span>
                  </motion.div>
                  <motion.div
                    className="detail-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <span className="detail-label">Account Type</span>
                    <span className="detail-value">{user.role || "Customer"}</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="profile-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="section-title">
                  <Package className="section-title-icon" size={22} />
                  Recent Orders
                </h2>
                {ordersLoading ? (
                  <div className="orders-loading">
                    <div className="spinner" style={{ width: 40, height: 40 }}></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="orders-list">
                    {orders.slice(0, 3).map((order, index) => (
                      <motion.div
                        className="order-card"
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="order-header">
                          <span className="order-id">Order #{order._id.slice(-6)}</span>
                          <span className="order-date">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="order-status status-delivered">{order.status || "Delivered"}</div>
                        <div className="order-total">Total: ${order.total?.toFixed(2) || "0.00"}</div>
                        <div className="order-actions">
                          <motion.button
                            className="order-btn view-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Details
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                    {orders.length > 3 && (
                      <motion.div
                        style={{ textAlign: "center", marginTop: 15 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <motion.button
                          className="view-btn order-btn"
                          onClick={() => setActiveTab("orders")}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View All Orders <ChevronRight size={16} />
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="no-orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p>You haven't placed any orders yet.</p>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="profile-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="section-title">
                  <ShoppingBag className="section-title-icon" size={22} />
                  Recent Food Orders
                </h2>
                {foodOrdersLoading ? (
                  <div className="orders-loading">
                    <div className="spinner" style={{ width: 40, height: 40 }}></div>
                  </div>
                ) : foodOrders.length > 0 ? (
                  <div className="orders-list">
                    {foodOrders.slice(0, 3).map((order, index) => (
                      <motion.div
                        className="order-card"
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="order-header">
                          <span className="order-id">Bill #{order._id.slice(-6)}</span>
                          <span className="order-date">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="order-status status-delivered">Completed</div>
                        <div className="order-total">Total: LKR {order.totalAmount?.toFixed(2) || "0.00"}</div>
                        <div className="order-actions">
                          <motion.button
                            className="order-btn view-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => viewOrderDetails(order)}
                          >
                            <Eye size={16} />
                            View Details
                          </motion.button>
                          <motion.button
                            className="order-btn download-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => generateFoodOrderPDF(order)}
                          >
                            <Download size={16} />
                            Download Invoice
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                    {foodOrders.length > 3 && (
                      <motion.div
                        style={{ textAlign: "center", marginTop: 15 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <motion.button
                          className="view-btn order-btn"
                          onClick={() => setActiveTab("food")}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View All Food Orders <ChevronRight size={16} />
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="no-orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p>You haven't placed any food orders yet.</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div key="orders" initial="hidden" animate="visible" exit="exit" variants={tabVariants}>
              <div className="profile-section">
                <h2 className="section-title">
                  <Package className="section-title-icon" size={22} />
                  My Orders
                </h2>
                {ordersLoading ? (
                  <div className="orders-loading">
                    <div className="spinner" style={{ width: 40, height: 40 }}></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="orders-list">
                    {orders.map((order, index) => (
                      <motion.div
                        className="order-card"
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="order-header">
                          <span className="order-id">Order #{order._id.slice(-6)}</span>
                          <span className="order-date">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="order-status status-delivered">{order.status || "Delivered"}</div>
                        <div className="order-items">
                          {order.items?.map((item, index) => (
                            <motion.div className="order-item" key={index} whileHover={{ scale: 1.05 }}>
                              {item.name} x {item.quantity}
                            </motion.div>
                          )) || <div className="order-item">Order details not available</div>}
                        </div>
                        <div className="order-total">Total: ${order.total?.toFixed(2) || "0.00"}</div>
                        <div className="order-actions">
                          <motion.button
                            className="order-btn view-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye size={16} />
                            View Details
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "food" && (
            <motion.div key="food" initial="hidden" animate="visible" exit="exit" variants={tabVariants}>
              <div className="profile-section">
                <h2 className="section-title">
                  <ShoppingBag className="section-title-icon" size={22} />
                  Food Orders
                </h2>
                {foodOrdersLoading ? (
                  <div className="orders-loading">
                    <div className="spinner" style={{ width: 40, height: 40 }}></div>
                  </div>
                ) : foodOrders.length > 0 ? (
                  <div className="orders-list">
                    {foodOrders.map((order, index) => (
                      <motion.div
                        className="order-card"
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="order-header">
                          <span className="order-id">Bill #{order._id.slice(-6)}</span>
                          <span className="order-date">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="order-status status-delivered">Completed</div>
                        <div className="order-items">
                          {order.cartItems?.map((item, index) => (
                            <motion.div className="order-item" key={index} whileHover={{ scale: 1.05 }}>
                              {item.name} x {item.quantity}
                            </motion.div>
                          )) || <div className="order-item">Order details not available</div>}
                        </div>
                        <div className="order-total">Total: LKR {order.totalAmount?.toFixed(2) || "0.00"}</div>
                        <div className="order-actions">
                          <motion.button
                            className="order-btn view-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => viewOrderDetails(order)}
                          >
                            <Eye size={16} />
                            View Details
                          </motion.button>
                          <motion.button
                            className="order-btn download-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => generateFoodOrderPDF(order)}
                          >
                            <Download size={16} />
                            Download Invoice
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="no-orders">
                    <p>You haven't placed any food orders yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div key="payments" initial="hidden" animate="visible" exit="exit" variants={tabVariants}>
              <div className="profile-section">
                <h2 className="section-title">
                  <CreditCard className="section-title-icon" size={22} />
                  Payment Methods
                </h2>
                <div className="no-orders">
                  <p>No payment methods added yet.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div key="favorites" initial="hidden" animate="visible" exit="exit" variants={tabVariants}>
              <div className="profile-section">
                <h2 className="section-title">
                  <Heart className="section-title-icon" size={22} />
                  Favorites
                </h2>
                <div className="no-orders">
                  <p>You haven't added any favorites yet.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div key="settings" initial="hidden" animate="visible" exit="exit" variants={tabVariants}>
              <div className="profile-section">
                <h2 className="section-title">
                  <Settings className="section-title-icon" size={22} />
                  Account Settings
                </h2>
                <div className="profile-details">
                  <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                    <motion.button
                      className="order-btn view-btn"
                      style={{ marginTop: 10 }}
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Food Order Modal */}
      <AnimatePresence>
        {showOrderModal && selectedFoodOrder && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div
              className="order-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="order-modal-header">
                <h2 className="order-modal-title">
                  <FileText size={20} />
                  Food Order Details
                </h2>
                <button className="close-modal" onClick={() => setShowOrderModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="order-modal-content">
                <div className="order-detail-section">
                  <h3 className="order-detail-title">
                    <User size={18} />
                    Customer Information
                  </h3>
                  <div className="order-detail-row">
                    <span className="order-detail-label">Name:</span>
                    <span className="order-detail-value">{selectedFoodOrder.customerName}</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="order-detail-label">Phone Number:</span>
                    <span className="order-detail-value">{selectedFoodOrder.customerNumber}</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="order-detail-label">Order Date:</span>
                    <span className="order-detail-value">{formatDate(selectedFoodOrder.createdAt)}</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="order-detail-label">Payment Method:</span>
                    <span className="order-detail-value">{selectedFoodOrder.paymentMode || "Cash"}</span>
                  </div>
                </div>

                <div className="order-detail-section">
                  <h3 className="order-detail-title">
                    <ShoppingCart size={18} />
                    Order Items
                  </h3>
                  <table className="order-items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFoodOrder.cartItems.map((item, index) => {
                        // Calculate prices
                        const totalPrice = item.price > 0 ? item.price * item.quantity : 0
                        const totalBPrice = item.Bprice > 0 ? item.Bprice * item.quantity : 0
                        const totalSPrice = item.Sprice > 0 ? item.Sprice * item.quantity : 0

                        return (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>
                              {totalPrice > 0 && <div>LKR {totalPrice.toFixed(2)}</div>}
                              {totalBPrice > 0 && <div>Bottle: LKR {totalBPrice.toFixed(2)}</div>}
                              {totalSPrice > 0 && <div>Shot: LKR {totalSPrice.toFixed(2)}</div>}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="order-detail-section">
                  <h3 className="order-detail-title">
                    <DollarSign size={18} />
                    Order Summary
                  </h3>
                  <div className="order-detail-row">
                    <span className="order-detail-label">Subtotal:</span>
                    <span className="order-detail-value">LKR {selectedFoodOrder.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="order-detail-row">
                    <span className="order-detail-label">Tax:</span>
                    <span className="order-detail-value">LKR {selectedFoodOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="order-detail-row" style={{ fontWeight: "bold" }}>
                    <span className="order-detail-label">Total Amount:</span>
                    <span className="order-detail-value" style={{ color: "#10b981" }}>
                      LKR {selectedFoodOrder.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-modal-footer">
                <motion.button
                  className="order-modal-btn close-btn"
                  onClick={() => setShowOrderModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} />
                  Close
                </motion.button>
                <motion.button
                  className="order-modal-btn download-invoice-btn"
                  onClick={() => generateFoodOrderPDF(selectedFoodOrder)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={16} />
                  Download Invoice
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile
