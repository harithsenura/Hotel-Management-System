"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { getUser } from "../../services/userService"
import { Package, ChevronRight, Clock } from "lucide-react"

const OrderedGifts = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = getUser()
        if (!user) {
          setLoading(false)
          return
        }

        setLoading(true)
        // Fetch orders for the current user
        const response = await axios.get(`http://localhost:5001/gift-orders/user/${user._id}`)
        setOrders(response.data.data || [])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load your orders. Please try again.")
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?key=bd0ue"
    if (imagePath.startsWith("http")) return imagePath
    return `http://localhost:5001${imagePath}`
  }

  // Get status text
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

  // Get status color
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
      default:
        return "#6b7280" // Gray
    }
  }

  if (loading) {
    return (
      <div className="ordered-gifts-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ordered-gifts-error">
        <p>{error}</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="ordered-gifts-empty">
        <Package size={48} />
        <h3>No Orders Yet</h3>
        <p>You haven't placed any gift orders yet.</p>
      </div>
    )
  }

  return (
    <div className="ordered-gifts-container">
      <h2 className="ordered-gifts-title">Your Gift Orders</h2>
      <div className="ordered-gifts-list">
        {orders.map((order) => (
          <div key={order._id} className="ordered-gift-card">
            <div className="gift-card-header">
              <div className="order-id">Order #{order._id.slice(-6)}</div>
              <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                {getStatusText(order.status)}
              </div>
            </div>
            <div className="gift-card-content">
              <div className="gift-items">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="gift-item">
                    <img
                      src={getImageUrl(item.gift.image) || "/placeholder.svg"}
                      alt={item.gift.name}
                      className="gift-image"
                    />
                    <div className="gift-details">
                      <div className="gift-name">{item.gift.name}</div>
                      <div className="gift-price">${item.gift.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && <div className="more-items">+{order.items.length - 2} more items</div>}
              </div>
              <div className="gift-card-footer">
                <div className="order-date">
                  <Clock size={14} />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <Link to={`/gifts/status/${order._id}`} className="view-details-btn">
                  View Details <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .ordered-gifts-container {
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 2rem;
        }
        
        .ordered-gifts-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #333;
        }
        
        .ordered-gifts-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .ordered-gift-card {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .ordered-gift-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .gift-card-header {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .order-id {
          font-weight: 600;
          color: #333;
        }
        
        .order-status {
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }
        
        .gift-card-content {
          padding: 1rem;
        }
        
        .gift-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .gift-item {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        
        .gift-image {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
        }
        
        .gift-details {
          flex-grow: 1;
        }
        
        .gift-name {
          font-weight: 500;
          color: #333;
          font-size: 0.9rem;
        }
        
        .gift-price {
          color: #dc143c;
          font-weight: 600;
          font-size: 0.85rem;
        }
        
        .more-items {
          font-size: 0.85rem;
          color: #666;
          text-align: center;
          padding: 0.5rem;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
        
        .gift-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #f0f0f0;
        }
        
        .order-date {
          font-size: 0.8rem;
          color: #666;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .view-details-btn {
          font-size: 0.85rem;
          color: #dc143c;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .view-details-btn:hover {
          color: #b30000;
        }
        
        .ordered-gifts-loading,
        .ordered-gifts-empty,
        .ordered-gifts-error {
          padding: 2rem;
          text-align: center;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .ordered-gifts-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #666;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(220, 20, 60, 0.2);
          border-radius: 50%;
          border-top-color: #dc143c;
          animation: spin 1s ease-in-out infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default OrderedGifts
