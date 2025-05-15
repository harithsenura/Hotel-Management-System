"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, FileText, Gift } from "lucide-react"
import axios from "axios"
import confetti from "canvas-confetti"
import { getUser } from "../../services/userService"

const GiftStatus = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        console.log(`Fetching gift order with ID: ${orderId}`)

        // Use the gift-orders endpoint instead of orders
        const timestamp = new Date().getTime() // Add timestamp to prevent caching
        const response = await axios.get(`http://localhost:5001/gift-orders/${orderId}?t=${timestamp}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        console.log("API Response:", response.data)

        if (response.data && response.data.success && response.data.data) {
          setOrder(response.data.data)
          setError(null)

          // If order is newly created, trigger confetti
          if (response.data.data.status === "pending") {
            triggerConfetti()
          }
        } else {
          console.error("Invalid API response format:", response.data)
          setError("Invalid response from server. Please try again.")
        }
      } catch (err) {
        console.error("Error fetching gift order:", err)
        console.error("Error details:", err.response?.data || err.message)
        setError("Failed to load order details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    const user = getUser()
    setCurrentUser(user)

    if (orderId) {
      fetchOrder()
    } else {
      setError("No order ID provided")
      setLoading(false)
    }
  }, [orderId, retryCount]) // Add retryCount to dependencies to allow refreshing

  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        }),
      )
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        }),
      )
    }, 250)
  }

  const handleBackClick = () => {
    navigate("/gifts/showevents")
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const downloadReceipt = () => {
    // This would typically call the same PDF generation function from gift-payment.js
    // For now, we'll just navigate to a dummy receipt
    window.open(`/receipt/${orderId}`, "_blank")
  }

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?key=bd0ue"
    if (imagePath.startsWith("http")) return imagePath
    return `http://localhost:5001${imagePath}`
  }

  // Get status step number (0-3)
  const getStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 0
      case "processing":
        return 1
      case "shipped":
        return 2
      case "delivered":
        return 3
      default:
        return 0
    }
  }

  // Get human-readable status
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Order Received"
      case "processing":
        return "Preparing Gift"
      case "shipped":
        return "Out for Delivery"
      case "delivered":
        return "Delivered"
      default:
        return "Processing"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="status-icon" />
      case "processing":
        return <Package className="status-icon" />
      case "shipped":
        return <Truck className="status-icon" />
      case "delivered":
        return <CheckCircle className="status-icon" />
      default:
        return <Clock className="status-icon" />
    }
  }

  // Safely access nested properties
  const safelyAccessGift = (item) => {
    if (!item) return { name: "Unknown Gift", price: 0, image: null }

    // If gift is a string (ID), create a placeholder object
    if (typeof item.gift === "string") {
      return { name: `Gift #${item.gift.substring(0, 8)}`, price: 0, image: null }
    }

    // If gift is an object, return it or a default object
    return item.gift || { name: "Unknown Gift", price: 0, image: null }
  }

  // Safely format the delivery address
  const formatDeliveryAddress = (address) => {
    if (!address) return "No delivery address provided"

    // If address is a string, return it directly
    if (typeof address === "string") {
      return address
    }

    // If address is an object with properties, format it
    if (typeof address === "object") {
      const { street, city, state, zipCode, country } = address
      const parts = []

      if (street) parts.push(street)
      if (city) parts.push(city)
      if (state) parts.push(state)
      if (zipCode) parts.push(zipCode)
      if (country) parts.push(country)

      return parts.join(", ") || "Address details not available"
    }

    return "Invalid address format"
  }

  return (
    <div className="gift-status-container">
      <style jsx>{`
        /* Global Styles */
        .gift-status-container {
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
          color: #333;
          position: relative;
        }
        
        /* Header Styles */
        .status-header {
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
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .gift-icon {
          color: #dc143c;
        }
        
        /* Main Content */
        .status-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        @media (max-width: 768px) {
          .status-content {
            padding: 1rem;
          }
        }
        
        /* Order Info */
        .order-info {
          background-color: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .order-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #333;
          margin: 0;
        }
        
        .order-id {
          font-size: 0.9rem;
          color: #666;
        }
        
        .order-date {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }
        
        .receipt-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #f0f0f0;
          border: none;
          color: #333;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .receipt-button:hover {
          background-color: #e0e0e0;
        }
        
        /* Status Timeline */
        .status-timeline {
          margin-top: 2rem;
          position: relative;
          padding-bottom: 1rem;
        }
        
        .timeline-track {
          position: absolute;
          top: 2.5rem;
          left: 2.5rem;
          width: calc(100% - 5rem);
          height: 4px;
          background-color: #e0e0e0;
          z-index: 1;
        }
        
        .timeline-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background-color: #4CAF50;
          transition: width 1s ease-in-out;
          z-index: 2;
        }
        
        .timeline-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 3;
        }
        
        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 5rem;
        }
        
        .step-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background-color: white;
          border: 2px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 4;
          transition: all 0.3s ease;
        }
        
        .step-icon.active {
          border-color: #4CAF50;
          background-color: #4CAF50;
          color: white;
          transform: scale(1.1);
        }
        
        .step-icon.completed {
          border-color: #4CAF50;
          background-color: #4CAF50;
          color: white;
        }
        
        .step-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #666;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .step-label.active {
          color: #4CAF50;
          font-weight: 600;
        }
        
        .status-icon {
          width: 1.5rem;
          height: 1.5rem;
        }
        
        /* Order Items */
        .order-items {
          margin-top: 2rem;
        }
        
        .items-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .item-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .order-item {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .item-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
        }
        
        .item-details {
          flex-grow: 1;
        }
        
        .item-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #333;
        }
        
        .item-price {
          font-size: 0.9rem;
          font-weight: 600;
          color: #dc143c;
          margin-bottom: 0.25rem;
        }
        
        .item-meta {
          font-size: 0.85rem;
          color: #666;
        }
        
        .gift-type-badge {
          font-weight: 600;
          color: #dc143c;
        }
        
        /* Group Contributors */
        .group-contributors {
          margin-top: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px dashed #e0e0e0;
        }
        
        .contributors-title {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #666;
        }
        
        .contributors-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .contributor-chip {
          background-color: #f0f0f0;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          color: #333;
        }
        
        .primary-contributor {
          background-color: #e8f5e9;
          color: #2e7d32;
          font-weight: 500;
        }
        
        /* Loading State */
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
        
        /* Error State */
        .error-container {
          background-color: #fee2e2;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          color: #dc143c;
        }
        
        .error-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .error-message {
          margin-bottom: 1.5rem;
        }
        
        .retry-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #dc143c;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .retry-button:hover {
          background-color: #b30000;
        }
        
        /* Delivery Address */
        .delivery-address {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f0f0;
        }
        
        .address-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .address-content {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.6;
        }
        
        /* Status Updates */
        .status-updates {
          margin-top: 2rem;
          background-color: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .updates-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #333;
        }
        
        .update-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .update-item {
          display: flex;
          gap: 1rem;
        }
        
        .update-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background-color: #e8f5e9;
          color: #2e7d32;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .update-content {
          flex-grow: 1;
        }
        
        .update-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #333;
        }
        
        .update-time {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
        
        .update-description {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.6;
        }
        
        /* Debug Info */
        .debug-info {
          margin-top: 2rem;
          padding: 1rem;
          background-color: #f0f0f0;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.8rem;
          white-space: pre-wrap;
          word-break: break-all;
          display: none;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .status-header {
            padding: 1rem;
          }
          
          .timeline-track, .timeline-progress {
            left: 0;
            width: 100%;
          }
          
          .timeline-steps {
            justify-content: space-around;
          }
          
          .timeline-step {
            width: auto;
          }
          
          .step-label {
            font-size: 0.7rem;
          }
        }
      `}</style>

      {/* Header */}
      <header className="status-header">
        <div className="header-top">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={18} />
            Back to Events
          </button>

          <h1 className="page-title">
            <Gift size={24} className="gift-icon" />
            Gift Order Status
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="status-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your order details...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        ) : order ? (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Order Info */}
              <div className="order-info">
                <div className="order-header">
                  <div>
                    <h2 className="order-title">Order Details</h2>
                    <div className="order-id">Order ID: {order._id}</div>
                    <div className="order-date">
                      Ordered on:{" "}
                      {new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <button className="receipt-button" onClick={downloadReceipt}>
                    <FileText size={16} />
                    View Receipt
                  </button>
                </div>

                {/* Status Timeline */}
                <div className="status-timeline">
                  <div className="timeline-track">
                    <motion.div
                      className="timeline-progress"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(getStatusStep(order.status || "pending") / 3) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </div>
                  <div className="timeline-steps">
                    {["pending", "processing", "shipped", "delivered"].map((status, index) => {
                      const isActive = (order.status || "pending") === status
                      const isCompleted = getStatusStep(order.status || "pending") > index

                      return (
                        <div key={status} className="timeline-step">
                          <motion.div
                            className={`step-icon ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: isActive ? 1.1 : 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                          >
                            {getStatusIcon(status)}
                          </motion.div>
                          <motion.div
                            className={`step-label ${isActive ? "active" : ""}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          >
                            {getStatusText(status)}
                          </motion.div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  <h3 className="items-title">Items in Your Order</h3>
                  <div className="item-list">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, index) => {
                        const gift = safelyAccessGift(item)

                        return (
                          <motion.div
                            key={index}
                            className="order-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                          >
                            <img
                              src={getImageUrl(gift.image) || "/placeholder.svg"}
                              alt={gift.name}
                              className="item-image"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/empty-cardboard-box.png"
                              }}
                            />
                            <div className="item-details">
                              <h4 className="item-name">{gift.name}</h4>
                              <div className="item-price">${(gift.price || 0).toFixed(2)}</div>
                              <div className="item-meta">
                                Quantity: {item.quantity || 1} |
                                <span className="gift-type-badge">
                                  {item.giftType === "individual" ? " Individual Gift" : " Group Gift"}
                                </span>
                              </div>

                              {item.giftType === "group" && item.contributors && item.contributors.length > 0 && (
                                <div className="group-contributors">
                                  <div className="contributors-title">Group Contributors:</div>
                                  <div className="contributors-list">
                                    {item.contributors.map((contributor, i) => (
                                      <div
                                        key={i}
                                        className={`contributor-chip ${i === 0 ? "primary-contributor" : ""}`}
                                      >
                                        {contributor}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })
                    ) : (
                      <p>No items found in this order.</p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="delivery-address">
                    <h3 className="address-title">Delivery Address</h3>
                    <div className="address-content">{formatDeliveryAddress(order.deliveryAddress)}</div>
                  </div>
                )}
              </div>

              {/* Status Updates */}
              <div className="status-updates">
                <h2 className="updates-title">Status Updates</h2>
                <div className="update-list">
                  {order.statusUpdates && order.statusUpdates.length > 0 ? (
                    order.statusUpdates.map((update, index) => (
                      <motion.div
                        key={index}
                        className="update-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      >
                        <div className="update-icon">{getStatusIcon(update.status)}</div>
                        <div className="update-content">
                          <h4 className="update-title">{getStatusText(update.status)}</h4>
                          <div className="update-time">
                            {new Date(update.timestamp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <p className="update-description">{update.message}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div>
                      <p>No status updates available yet.</p>
                      <motion.div
                        className="update-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="update-icon">{getStatusIcon(order.status || "pending")}</div>
                        <div className="update-content">
                          <h4 className="update-title">{getStatusText(order.status || "pending")}</h4>
                          <div className="update-time">
                            {new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <p className="update-description">Your order has been received and is being processed.</p>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>

              {/* Debug Info - Hidden by default */}
              <div className="debug-info">
                <h3>Debug Information</h3>
                <p>Order ID: {orderId}</p>
                <p>Order Data: {JSON.stringify(order, null, 2)}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="error-container">
            <h2 className="error-title">Order Not Found</h2>
            <p className="error-message">We couldn't find the order you're looking for.</p>
            <button className="retry-button" onClick={handleBackClick}>
              Back to Events
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default GiftStatus
