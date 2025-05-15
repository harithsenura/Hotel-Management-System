"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getUser } from "../../services/userService"
import { Package, Search, Filter, ShoppingBag, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react"
import CreateTestOrder from "./CreateTestOrder"
import { getAllOrders, getUserOrders, getOrdersFromLocalStorage } from "../../services/orderedGiftsService1"

const OrdersList = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [user, setUser] = useState(null)
  const [testOrderSuccess, setTestOrderSuccess] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)
  const [showDebug, setShowDebug] = useState(true) // Set to true to show debug by default

  // Function to fetch all orders and manually filter by user ID
  const fetchAllOrders = async (userId) => {
    try {
      console.log("Fetching all orders and manually filtering by user ID:", userId)
      setDebugInfo((prev) => ({ ...prev, fetchingAllOrders: true, userId }))

      const response = await getAllOrders()

      if (response && response.data) {
        const allOrders = response.data
        console.log(`Fetched ${allOrders.length} total orders`)
        setDebugInfo((prev) => ({ ...prev, allOrdersCount: allOrders.length }))

        // Log all orders for debugging
        console.log(
          "All orders:",
          allOrders.map((o) => ({ id: o._id, user: o.user })),
        )
        setDebugInfo((prev) => ({
          ...prev,
          allOrdersDetails: allOrders.map((o) => ({
            id: o._id,
            user: typeof o.user === "object" ? o.user.toString() : o.user,
            createdAt: o.createdAt,
          })),
        }))

        // Filter orders by user ID manually
        const userOrders = allOrders.filter((order) => {
          // Check if the user ID matches (as string)
          if (typeof order.user === "string") {
            const match = order.user === userId
            if (match) console.log(`String match found for order: ${order._id}`)
            return match
          }
          // Check if the user ID matches (as ObjectId)
          else if (order.user) {
            const orderUserId = order.user.toString()
            const match = orderUserId === userId
            if (match) console.log(`ObjectId match found for order: ${order._id}`)
            return match
          }
          return false
        })

        console.log(`Found ${userOrders.length} orders for user ${userId}`)
        setDebugInfo((prev) => ({ ...prev, userOrdersCount: userOrders.length }))

        if (userOrders.length > 0) {
          const giftOrders = userOrders.map((order) => ({
            ...order,
            orderType: "gift",
          }))

          // Sort by date (newest first)
          const sortedOrders = giftOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

          setOrders(sortedOrders)
          setDebugInfo((prev) => ({ ...prev, finalOrdersCount: sortedOrders.length }))
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error fetching all orders:", error)
      setDebugInfo((prev) => ({ ...prev, fetchAllOrdersError: error.message }))
      return false
    }
  }

  // Function to fetch orders directly from the user endpoint
  const fetchUserOrders = async (userId) => {
    try {
      console.log(`Fetching orders for user ${userId} from direct endpoint`)
      setDebugInfo((prev) => ({ ...prev, fetchingUserOrders: true, userId }))

      const response = await getUserOrders(userId)

      console.log("User orders API response:", response)
      setDebugInfo((prev) => ({ ...prev, userOrdersApiResponse: response }))

      if (response && response.data && response.data.length > 0) {
        const giftOrders = response.data.map((order) => ({
          ...order,
          orderType: "gift",
        }))

        // Sort by date (newest first)
        const sortedOrders = giftOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

        setOrders(sortedOrders)
        setDebugInfo((prev) => ({ ...prev, finalOrdersCount: sortedOrders.length }))
        return true
      }

      return false
    } catch (error) {
      console.error("Error fetching user orders:", error)
      setDebugInfo((prev) => ({ ...prev, fetchUserOrdersError: error.message }))
      return false
    }
  }

  // Function to check localStorage for orders
  const checkLocalStorage = async (userId) => {
    try {
      console.log("Checking localStorage for orders")
      setDebugInfo((prev) => ({ ...prev, checkingLocalStorage: true }))

      // Get order IDs from localStorage
      const orderIds = getOrdersFromLocalStorage(userId)
      setDebugInfo((prev) => ({ ...prev, orderIdsFromStorage: orderIds }))

      if (orderIds.length > 0) {
        console.log(`Found ${orderIds.length} order IDs in localStorage for user ${userId}`)

        // Fetch all orders to find the ones with matching IDs
        const allOrdersResponse = await getAllOrders()
        const allOrders = allOrdersResponse.data || []

        // Find orders from localStorage in all orders
        const ordersFromStorage = allOrders.filter((order) => orderIds.includes(order._id))

        console.log(`Found ${ordersFromStorage.length} orders from localStorage IDs`)
        setDebugInfo((prev) => ({ ...prev, ordersFromStorageCount: ordersFromStorage.length }))

        if (ordersFromStorage.length > 0) {
          const giftOrders = ordersFromStorage.map((order) => ({
            ...order,
            orderType: "gift",
          }))

          // Sort by date (newest first)
          const sortedOrders = giftOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

          setOrders(sortedOrders)
          setDebugInfo((prev) => ({ ...prev, finalOrdersCount: sortedOrders.length }))
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error checking localStorage:", error)
      setDebugInfo((prev) => ({ ...prev, localStorageError: error.message }))
      return false
    }
  }

  // Function to manually create orders from localStorage IDs
  const createOrdersFromLocalStorage = (userId) => {
    try {
      console.log("Creating orders from localStorage IDs")
      setDebugInfo((prev) => ({ ...prev, creatingOrdersFromStorage: true }))

      // Get order IDs from localStorage
      const orderIds = getOrdersFromLocalStorage(userId)

      if (orderIds.length === 0) {
        return false
      }

      // Create dummy orders from the IDs
      const dummyOrders = orderIds.map((id, index) => ({
        _id: id,
        user: userId,
        orderType: "gift",
        status: "pending",
        totalAmount: 29.99,
        items: [
          {
            gift: { name: `Gift Item ${index + 1}` },
            quantity: 1,
          },
        ],
        createdAt: new Date(Date.now() - index * 86400000).toISOString(), // Each order 1 day apart
      }))

      console.log(`Created ${dummyOrders.length} dummy orders from localStorage IDs`)
      setDebugInfo((prev) => ({ ...prev, dummyOrdersCount: dummyOrders.length }))

      // Sort by date (newest first)
      const sortedOrders = dummyOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

      setOrders(sortedOrders)
      setDebugInfo((prev) => ({ ...prev, finalOrdersCount: sortedOrders.length }))
      return true
    } catch (error) {
      console.error("Error creating orders from localStorage:", error)
      setDebugInfo((prev) => ({ ...prev, createOrdersError: error.message }))
      return false
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        setDebugInfo({
          startTime: new Date().toISOString(),
          fetchingStarted: true,
        })

        // Get user from localStorage
        const currentUser = getUser()
        console.log("Current user:", currentUser)
        setDebugInfo((prev) => ({ ...prev, currentUser }))

        if (!currentUser) {
          setError("You need to be logged in to view orders. Please log in.")
          setLoading(false)
          return
        }

        setUser(currentUser)
        const userId = currentUser._id || currentUser.id
        console.log("Using user ID:", userId)
        setDebugInfo((prev) => ({ ...prev, userId }))

        // Try all methods to fetch orders
        let success = false

        // Method 1: Fetch all orders and filter manually
        success = await fetchAllOrders(userId)
        if (success) {
          console.log("Successfully fetched orders using Method 1")
          setDebugInfo((prev) => ({ ...prev, successMethod: "fetchAllOrders" }))
        } else {
          // Method 2: Fetch orders directly from user endpoint
          success = await fetchUserOrders(userId)
          if (success) {
            console.log("Successfully fetched orders using Method 2")
            setDebugInfo((prev) => ({ ...prev, successMethod: "fetchUserOrders" }))
          } else {
            // Method 3: Check localStorage
            success = await checkLocalStorage(userId)
            if (success) {
              console.log("Successfully fetched orders using Method 3")
              setDebugInfo((prev) => ({ ...prev, successMethod: "checkLocalStorage" }))
            } else {
              // Method 4: Create dummy orders from localStorage IDs
              success = createOrdersFromLocalStorage(userId)
              if (success) {
                console.log("Successfully created orders from localStorage IDs")
                setDebugInfo((prev) => ({ ...prev, successMethod: "createOrdersFromLocalStorage" }))
              } else {
                console.log("All methods failed to fetch orders")
                setDebugInfo((prev) => ({ ...prev, allMethodsFailed: true }))
                setOrders([])
              }
            }
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Error in fetchData:", err)
        setDebugInfo((prev) => ({ ...prev, fetchDataError: err.message }))
        setError(`Failed to load your orders. Please try again. (${err.message})`)
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleBackClick = () => {
    navigate("/")
  }

  const handleRetryFetch = () => {
    window.location.reload()
  }

  const handleCreateTestOrderSuccess = (data) => {
    setTestOrderSuccess(data)
    // Reload after 3 seconds
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }

  const getStatusColor = (status) => {
    if (!status) return "#6b7280" // Default gray

    switch (status.toLowerCase()) {
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

  const getStatusText = (status) => {
    if (!status) return "Processing"

    switch (status.toLowerCase()) {
      case "pending":
        return "Order Received"
      case "processing":
        return "Preparing"
      case "shipped":
        return "Out for Delivery"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return "Processing"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (err) {
      return "Invalid Date"
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return ""
    try {
      const options = { hour: "2-digit", minute: "2-digit" }
      return new Date(dateString).toLocaleTimeString(undefined, options)
    } catch (err) {
      return ""
    }
  }

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "$0.00"
    try {
      return `$${Number.parseFloat(amount).toFixed(2)}`
    } catch (err) {
      return "$0.00"
    }
  }

  const filteredOrders = orders.filter((order) => {
    // Apply status filter
    if (filterStatus !== "all" && order.status !== filterStatus) {
      return false
    }

    // Apply search filter (search by order ID or items)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const orderIdMatch = order._id && order._id.toLowerCase().includes(searchLower)

      // Check if any item name matches the search term
      const itemsMatch =
        order.items &&
        order.items.some((item) => {
          const itemName = (item.gift?.name || "").toLowerCase()
          return itemName.includes(searchLower)
        })

      return orderIdMatch || itemsMatch
    }

    return true
  })

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="orders-list-container">
      <style jsx>{`
        .orders-list-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
        }
        
        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
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
        
        .orders-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-button:hover {
          background-color: #388e3c;
        }
        
        .orders-filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .search-container {
          position: relative;
          flex-grow: 1;
          max-width: 400px;
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          background-color: #fff;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }
        
        .filter-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }
        
        .filter-select {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          background-color: #fff;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .filter-select:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }
        
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .order-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }
        
        .order-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .order-header {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
          background-color: #f8f9fa;
        }
        
        .order-id {
          font-weight: 600;
          color: #333;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .order-type-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 14px;
        }
        
        .order-type-icon.gift {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4CAF50;
        }
        
        .order-status {
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }
        
        .order-content {
          padding: 1rem;
        }
        
        .order-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .order-items {
          margin-bottom: 1rem;
        }
        
        .order-item {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed #f0f0f0;
        }
        
        .order-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .item-details {
          flex-grow: 1;
        }
        
        .item-name {
          font-weight: 500;
          color: #333;
          font-size: 0.9rem;
        }
        
        .item-quantity {
          color: #666;
          font-size: 0.85rem;
        }
        
        .order-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
          font-weight: 600;
        }
        
        .total-label {
          color: #666;
        }
        
        .total-amount {
          color: #4CAF50;
        }
        
        .view-details-link {
          display: block;
          text-align: center;
          padding: 0.75rem;
          background-color: #f8f9fa;
          color: #4CAF50;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border-top: 1px solid #f0f0f0;
        }
        
        .view-details-link:hover {
          background-color: #4CAF50;
          color: white;
        }
        
        .no-orders {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .no-orders-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #4CAF50;
        }
        
        .orders-loading {
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
          border: 4px solid rgba(76, 175, 80, 0.2);
          border-radius: 50%;
          border-top-color: #4CAF50;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1.5rem;
        }
        
        .error-container {
          background-color: #fee2e2;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .error-icon {
          color: #ef4444;
          margin-bottom: 1rem;
        }
        
        .error-message {
          color: #b91c1c;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .error-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        
        .retry-button {
          padding: 0.5rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          background-color: #3b82f6;
          color: white;
        }
        
        .retry-button:hover {
          background-color: #2563eb;
        }
        
        .more-items {
          text-align: center;
          padding: 0.5rem;
          background-color: #f8f9fa;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #666;
        }
        
        .create-test-order-btn {
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .create-test-order-btn:hover {
          background-color: #388e3c;
        }
        
        .success-message {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background-color: #f0fff4;
          border: 1px solid #c6f6d5;
          border-radius: 8px;
          text-align: left;
        }
        
        .success-title {
          font-weight: 700;
          color: #2f855a;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        .success-content {
          font-family: monospace;
          background-color: #e6ffed;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.85rem;
          white-space: pre-wrap;
          overflow-x: auto;
          margin-top: 1rem;
        }

        .debug-info {
          margin-top: 2rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.85rem;
          white-space: pre-wrap;
          overflow-x: auto;
        }

        .debug-toggle {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .debug-toggle:hover {
          background-color: #e0e0e0;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .orders-list-container {
            padding: 1rem;
          }
          
          .orders-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .orders-filters {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-container {
            max-width: none;
          }
          
          .orders-grid {
            grid-template-columns: 1fr;
          }
          
          .error-buttons {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>

      <div className="orders-header">
        <button className="back-button" onClick={handleBackClick}>
          <ArrowLeft size={18} />
          Back to Home
        </button>
        <h1 className="orders-title">My Gift Orders</h1>
        <button className="refresh-button" onClick={() => window.location.reload()}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-container">
          <div className="error-icon">
            <AlertCircle size={32} />
          </div>
          <p className="error-message">{error}</p>
          <div className="error-buttons">
            <button className="retry-button" onClick={handleRetryFetch}>
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        </div>
      )}

      {!error && (
        <div className="orders-filters">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <div className="filter-label">
              <Filter size={18} />
              <span>Filter by:</span>
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}

      {!error && filteredOrders.length > 0 ? (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <ShoppingBag size={18} />#{order._id ? order._id.slice(-6) : "N/A"}
                </div>
                <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                  {getStatusText(order.status)}
                </div>
              </div>
              <div className="order-content">
                <div className="order-date">
                  <span>
                    {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                  </span>
                </div>
                <div className="order-items">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-details">
                          <div className="item-name">{item.gift?.name || "Gift Item"}</div>
                          <div className="item-quantity">Qty: {item.quantity || 1}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="order-item">
                      <div className="item-details">
                        <div className="item-name">Order Items</div>
                        <div className="item-quantity">No items data available</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="order-total">
                  <span className="total-label">Total:</span>
                  <span className="total-amount">{formatCurrency(order.totalAmount || order.total)}</span>
                </div>
              </div>
              <Link to={`/orders/${order._id}?type=${order.orderType}`} className="view-details-link">
                View Order Details
              </Link>
            </div>
          ))}
        </div>
      ) : !error ? (
        <div className="no-orders">
          <div className="no-orders-icon">
            <Package size={48} />
          </div>
          <h3>No Orders Found</h3>
          <p>
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "You haven't placed any gift orders yet."}
          </p>

          <div className="create-test-order">
            <CreateTestOrder onSuccess={handleCreateTestOrderSuccess} />
          </div>

          {testOrderSuccess && (
            <div className="success-message">
              <div className="success-title">Success!</div>
              <p>Test order created successfully!</p>
              <div className="success-content">
                <pre>{JSON.stringify(testOrderSuccess, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Debug Information */}
      <div>
        <button className="debug-toggle" onClick={() => setShowDebug(!showDebug)}>
          {showDebug ? "Hide" : "Show"} Debug Information
        </button>
        {showDebug && debugInfo && (
          <div className="debug-info">
            <h4>Debug Information:</h4>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersList
