"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Package, Clock, MapPin, CreditCard, CheckCircle, AlertCircle } from "lucide-react"

const OrderDetails = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // Get order type from query params
  const queryParams = new URLSearchParams(location.search)
  const orderType = queryParams.get("type") || "gift" // Default to gift if not specified

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`Fetching order details for ID: ${orderId}, type: ${orderType}, retry: ${retryCount}`)

        // Determine which API endpoint to use based on order type
        const endpoint =
          orderType === "food"
            ? `http://localhost:5001/orders/${orderId}`
            : `http://localhost:5001/gift-orders/${orderId}`

        console.log(`Using endpoint: ${endpoint}`)

        // Add cache-busting parameter
        const timestamp = new Date().getTime()
        const response = await axios.get(`${endpoint}?t=${timestamp}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        console.log("API Response:", response.data)

        if (response.data && response.data.data) {
          setOrder(response.data.data)
          console.log("Order data set:", response.data.data)
        } else {
          console.error("Invalid response format:", response.data)
          setError("Order not found or invalid response format")
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError(`Failed to load order details. ${err.message || "Please try again."}`)
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId, orderType, retryCount])

  const handleBackClick = () => {
    navigate("/orders")
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (dateString) => {
    if (!dateString) return ""
    const options = { hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleTimeString(undefined, options)
  }

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "$0.00"
    return `$${Number.parseFloat(amount).toFixed(2)}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b" // Amber
      case "processing":
        return "#3b82f6" // Blue
      case "shipped":
        return "#8b5cf6" // Purple
      case "delivered":
        return "#10b981" // Green
      case "cancelled":
        return "#ef4444" // Red
      default:
        return "#6b7280" // Gray
    }
  }

  const getStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 1
      case "processing":
        return 2
      case "shipped":
        return 3
      case "delivered":
        return 4
      case "cancelled":
        return 0
      default:
        return 1
    }
  }

  const getOrderTypeLabel = (type) => {
    return type === "food" ? "Food Order" : "Gift Order"
  }

  if (loading) {
    return (
      <div className="order-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="order-details-error">
        <AlertCircle size={48} />
        <h3>Oops! Something went wrong</h3>
        <p>Failed to load order details. Please try again.</p>
        <button className="retry-button" onClick={handleRetry}>
          Try Again
        </button>
        <button className="back-button" onClick={handleBackClick} style={{ marginTop: "10px" }}>
          Back to Orders
        </button>
      </div>
    )
  }

  return (
    <div className="order-details-container">
      <style jsx>{`
        .order-details-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
        }
        
        .order-details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .back-button, .retry-button {
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
        
        .retry-button {
          background-color: #dc143c;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
        }
        
        .retry-button:hover {
          background-color: #b30000;
        }
        
        .order-details-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }
        
        .order-type-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          background-color: #dc143c;
          margin-left: 0.5rem;
        }
        
        .order-details-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        
        .order-main {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .order-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .order-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .order-card-header {
          padding: 1rem;
          background-color: #f8f9fa;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .order-card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .order-card-content {
          padding: 1rem;
        }
        
        .order-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .order-info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .info-icon {
          color: #dc143c;
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        
        .info-content {
          flex-grow: 1;
        }
        
        .info-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.25rem;
        }
        
        .info-value {
          font-weight: 500;
          color: #333;
        }
        
        .order-status-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .status-header {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .status-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin: 0;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }
        
        .status-content {
          padding: 1.5rem 1rem;
        }
        
        .status-timeline {
          position: relative;
          padding-left: 30px;
        }
        
        .status-timeline::before {
          content: '';
          position: absolute;
          top: 0;
          left: 15px;
          width: 2px;
          height: 100%;
          background-color: #e0e0e0;
          transform: translateX(-50%);
        }
        
        .timeline-step {
          position: relative;
          padding-bottom: 1.5rem;
        }
        
        .timeline-step:last-child {
          padding-bottom: 0;
        }
        
        .step-marker {
          position: absolute;
          top: 0;
          left: -15px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: white;
          border: 2px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        
        .step-marker.active {
          border-color: #10b981;
          background-color: #10b981;
          color: white;
        }
        
        .step-marker.cancelled {
          border-color: #ef4444;
          background-color: #ef4444;
          color: white;
        }
        
        .step-content {
          padding-left: 1.5rem;
          padding-top: 0.25rem;
        }
        
        .step-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }
        
        .step-description {
          font-size: 0.9rem;
          color: #666;
        }
        
        .order-items-list {
          padding: 1rem;
        }
        
        .order-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .order-item:last-child {
          border-bottom: none;
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
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }
        
        .item-meta {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
        
        .item-price {
          font-weight: 600;
          color: #dc143c;
        }
        
        .order-summary {
          padding: 1rem;
          background-color: #f8f9fa;
          border-top: 1px solid #f0f0f0;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .summary-row.total {
          font-size: 1.1rem;
          font-weight: 700;
          color: #333;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e0e0e0;
        }
        
        .order-details-loading,
        .order-details-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          background-color: #fff5f5;
          border-radius: 12px;
          margin: 2rem auto;
          max-width: 600px;
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
        
        @media (max-width: 768px) {
          .order-details-container {
            padding: 1rem;
          }
          
          .order-details-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .order-details-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="order-details-header">
        <button className="back-button" onClick={handleBackClick}>
          <ArrowLeft size={18} />
          Back to Orders
        </button>
        <h1 className="order-details-title">
          Order #{orderId.slice(-6)}
          <span className="order-type-badge">{getOrderTypeLabel(order.orderType)}</span>
        </h1>
      </div>

      <div className="order-details-content">
        <div className="order-main">
          <div className="order-status-card">
            <div className="status-header">
              <h2 className="status-title">Order Status</h2>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Processing"}
              </div>
            </div>
            <div className="status-content">
              <div className="status-timeline">
                {order.status !== "cancelled" ? (
                  <>
                    <div className="timeline-step">
                      <div className={`step-marker ${getStatusStep(order.status) >= 1 ? "active" : ""}`}>
                        {getStatusStep(order.status) >= 1 ? <CheckCircle size={16} /> : "1"}
                      </div>
                      <div className="step-content">
                        <div className="step-title">Order Received</div>
                        <div className="step-description">Your order has been received and is being processed.</div>
                      </div>
                    </div>
                    <div className="timeline-step">
                      <div className={`step-marker ${getStatusStep(order.status) >= 2 ? "active" : ""}`}>
                        {getStatusStep(order.status) >= 2 ? <CheckCircle size={16} /> : "2"}
                      </div>
                      <div className="step-content">
                        <div className="step-title">Preparing</div>
                        <div className="step-description">
                          {order.orderType === "food"
                            ? "Your food is being prepared by our chefs."
                            : "Your gift is being prepared for shipping."}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-step">
                      <div className={`step-marker ${getStatusStep(order.status) >= 3 ? "active" : ""}`}>
                        {getStatusStep(order.status) >= 3 ? <CheckCircle size={16} /> : "3"}
                      </div>
                      <div className="step-content">
                        <div className="step-title">{order.orderType === "food" ? "Ready for Pickup" : "Shipped"}</div>
                        <div className="step-description">
                          {order.orderType === "food"
                            ? "Your food is ready and on its way to your table."
                            : "Your gift has been shipped and is on its way."}
                        </div>
                      </div>
                    </div>
                    <div className="timeline-step">
                      <div className={`step-marker ${getStatusStep(order.status) >= 4 ? "active" : ""}`}>
                        {getStatusStep(order.status) >= 4 ? <CheckCircle size={16} /> : "4"}
                      </div>
                      <div className="step-content">
                        <div className="step-title">Delivered</div>
                        <div className="step-description">
                          {order.orderType === "food"
                            ? "Your food has been delivered to your table. Enjoy!"
                            : "Your gift has been delivered to the recipient. Thank you!"}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="timeline-step">
                    <div className="step-marker cancelled">
                      <AlertCircle size={16} />
                    </div>
                    <div className="step-content">
                      <div className="step-title">Order Cancelled</div>
                      <div className="step-description">
                        This order has been cancelled. Please contact customer service for more information.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="order-items-list">
            <h3>Order Items</h3>
            {order.items &&
              Array.isArray(order.items) &&
              order.items.map((item, index) => {
                // Handle both nested and flat gift structure
                const giftItem = item.gift || item
                const giftName = giftItem.name || (typeof giftItem === "string" ? "Gift Item" : "Unknown Gift")
                const giftPrice = giftItem.price || 0
                const giftImage = giftItem.image || null

                return (
                  <div key={index} className="order-item">
                    <img
                      src={giftImage ? `http://localhost:5001${giftImage}` : "/placeholder.svg?key=gift"}
                      alt={giftName}
                      className="item-image"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?key=error"
                      }}
                    />
                    <div className="item-details">
                      <div className="item-name">{giftName}</div>
                      <div className="item-meta">
                        Quantity: {item.quantity || 1}
                        {item.giftType === "group" && <span> | Group Gift ({item.groupSize || 2} people)</span>}
                      </div>
                      <div className="item-price">{formatCurrency(giftPrice)}</div>
                    </div>
                  </div>
                )
              })}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(order.totalAmount ? order.totalAmount * 0.9 : 0)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>{formatCurrency(order.totalAmount ? order.totalAmount * 0.1 : 0)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="order-sidebar">
          <div className="order-card">
            <div className="order-card-header">
              <h3 className="order-card-title">
                <Clock size={18} />
                Order Information
              </h3>
            </div>
            <div className="order-card-content">
              <div className="order-info">
                <div className="order-info-item">
                  <Clock className="info-icon" size={18} />
                  <div className="info-content">
                    <div className="info-label">Order Date</div>
                    <div className="info-value">
                      {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="order-info-item">
                  <Package className="info-icon" size={18} />
                  <div className="info-content">
                    <div className="info-label">Order ID</div>
                    <div className="info-value">#{order._id}</div>
                  </div>
                </div>
                <div className="order-info-item">
                  <CreditCard className="info-icon" size={18} />
                  <div className="info-content">
                    <div className="info-label">Payment Method</div>
                    <div className="info-value">
                      {order.paymentMethod === "credit_card"
                        ? `Credit Card (${order.paymentDetails?.cardLast4 ? "****" + order.paymentDetails.cardLast4 : "Card"})`
                        : order.paymentMethod || "Credit Card"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="order-card">
              <div className="order-card-header">
                <h3 className="order-card-title">
                  <MapPin size={18} />
                  Delivery Address
                </h3>
              </div>
              <div className="order-card-content">
                <div className="order-info">
                  <div className="order-info-item">
                    <MapPin className="info-icon" size={18} />
                    <div className="info-content">
                      <div className="info-value">
                        {typeof order.deliveryAddress === "string"
                          ? order.deliveryAddress
                          : `${order.deliveryAddress.street || ""} 
                             ${order.deliveryAddress.city || ""} 
                             ${order.deliveryAddress.state || ""} 
                             ${order.deliveryAddress.zipCode || ""} 
                             ${order.deliveryAddress.country || ""}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {order.tableNo && (
            <div className="order-card">
              <div className="order-card-header">
                <h3 className="order-card-title">
                  <MapPin size={18} />
                  Delivery Information
                </h3>
              </div>
              <div className="order-card-content">
                <div className="order-info">
                  <div className="order-info-item">
                    <div className="info-content">
                      <div className="info-label">Table Number</div>
                      <div className="info-value">{order.tableNo || "N/A"}</div>
                    </div>
                  </div>
                  <div className="order-info-item">
                    <div className="info-content">
                      <div className="info-label">Customer Name</div>
                      <div className="info-value">{order.customerName || "N/A"}</div>
                    </div>
                  </div>
                  {order.contactNumber && (
                    <div className="order-info-item">
                      <div className="info-content">
                        <div className="info-label">Contact Number</div>
                        <div className="info-value">{order.contactNumber}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
