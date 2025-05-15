"use client"

import { useState, useEffect } from "react"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaSearch,
  FaSave,
  FaTimes,
  FaRedo,
  FaGift,
  FaShoppingBag,
  FaInfoCircle,
  FaSync,
  FaTicketAlt,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify" // Make sure you have react-toastify installed

const GiftsAdmin = () => {
  const navigate = useNavigate()
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentGift, setCurrentGift] = useState(null)
  const [resetting, setResetting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Perfumes",
    image: null,
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [categories, setCategories] = useState([
    "Perfumes",
    "Skin Care",
    "Home Decorations",
    "Kitchen Equipments",
    "Soft Toys",
    "Watches",
    "Jewelery",
    "Makeup Items",
  ])
  const [orders, setOrders] = useState([])
  const [showOrders, setShowOrders] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState(null)
  const [showDebug, setShowDebug] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // Add this for forcing re-render
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [giftToDelete, setGiftToDelete] = useState(null)

  // New state for vouchers
  const [vouchers, setVouchers] = useState([])
  const [showVouchers, setShowVouchers] = useState(false)
  const [voucherLoading, setVoucherLoading] = useState(false)
  const [showVoucherForm, setShowVoucherForm] = useState(false)
  const [editVoucherMode, setEditVoucherMode] = useState(false)
  const [currentVoucher, setCurrentVoucher] = useState(null)
  const [voucherFormData, setVoucherFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Wellness",
    image: null,
    validityPeriod: "12 months",
    type: "Experience",
  })
  const [voucherCategories, setVoucherCategories] = useState([
    "Wellness",
    "Dining",
    "Adventure",
    "Shopping",
    "Travel",
    "Beauty",
    "Entertainment",
    "Sports",
    "Education",
  ])
  const [voucherTypes, setVoucherTypes] = useState(["Experience", "Gift Card", "Product", "Service"])
  const [voucherToDelete, setVoucherToDelete] = useState(null)

  // Fetch all gifts on component mount
  useEffect(() => {
    fetchGifts()
    fetchVouchers()
    fetchOrders()
  }, [refreshKey]) // Add refreshKey as a dependency

  const fetchGifts = async () => {
    try {
      setLoading(true)
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await axios.get(`http://localhost:5001/gifts?t=${timestamp}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      console.log("Gifts API response:", response.data)
      setGifts(response.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching gifts:", error)
      setLoading(false)
      toast.error("Failed to fetch gifts. Please try again.")
    }
  }

  const fetchVouchers = async () => {
    try {
      setVoucherLoading(true)
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await axios.get(`http://localhost:5001/vouchers?t=${timestamp}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      console.log("Vouchers API response:", response.data)
      setVouchers(response.data.data || [])
      setVoucherLoading(false)
    } catch (error) {
      console.error("Error fetching vouchers:", error)
      setVoucherLoading(false)
      toast.error("Failed to fetch vouchers. Please try again.")
      // Set empty array as fallback
      setVouchers([])
    }
  }

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      setOrdersError(null)

      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await axios.get(`http://localhost:5001/gift-orders?t=${timestamp}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      console.log("Orders API response:", response.data)

      if (response.data && response.data.data) {
        // Make sure we're setting the orders state with the correct data
        const ordersData = response.data.data
        setOrders(ordersData)
        console.log("Orders set in state:", ordersData.length)
      } else {
        console.error("Invalid response format:", response.data)
        setOrdersError("Invalid response format from server")
        setOrders([]) // Set empty array to prevent undefined errors
      }

      setOrdersLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrdersError(error.message || "Failed to fetch orders")
      setOrdersLoading(false)
      setOrders([]) // Set empty array to prevent undefined errors
    }
  }

  useEffect(() => {
    fetchGifts()
    fetchVouchers()
    fetchOrders()

    // Set up a refresh interval for orders (every 30 seconds)
    const orderRefreshInterval = setInterval(() => {
      if (showOrders) {
        fetchOrders()
      }
    }, 30000)

    // Clean up the interval on component unmount
    return () => clearInterval(orderRefreshInterval)
  }, [showOrders])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredGifts = gifts.filter(
    (gift) =>
      gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gift.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gift.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleVoucherInputChange = (e) => {
    const { name, value } = e.target
    setVoucherFormData({
      ...voucherFormData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
      })

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVoucherImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVoucherFormData({
        ...voucherFormData,
        image: file,
      })

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddNew = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "Perfumes",
      image: null,
    })
    setPreviewImage(null)
    setEditMode(false)
    setShowForm(true)
  }

  const handleAddNewVoucher = () => {
    setVoucherFormData({
      name: "",
      price: "",
      description: "",
      category: "Wellness",
      image: null,
      validityPeriod: "12 months",
      type: "Experience",
    })
    setPreviewImage(null)
    setEditVoucherMode(false)
    setShowVoucherForm(true)
  }

  const handleEdit = (gift) => {
    setCurrentGift(gift)
    setFormData({
      name: gift.name,
      price: gift.price,
      description: gift.description,
      category: gift.category,
      image: null,
      sold: gift.sold || false,
    })
    setPreviewImage(gift.image ? `http://localhost:5001${gift.image}` : null)
    setEditMode(true)
    setShowForm(true)
  }

  const handleEditVoucher = (voucher) => {
    setCurrentVoucher(voucher)
    setVoucherFormData({
      name: voucher.name,
      price: voucher.price,
      description: voucher.description,
      category: voucher.category,
      image: null,
      validityPeriod: voucher.validityPeriod || "12 months",
      type: voucher.type || "Experience",
    })
    setPreviewImage(voucher.image ? `http://localhost:5001${voucher.image}` : null)
    setEditVoucherMode(true)
    setShowVoucherForm(true)
  }

  // FIXED DELETE FUNCTION
  const handleDelete = async (id) => {
    setGiftToDelete(id)
    setShowDeleteConfirm(true)
  }

  const handleDeleteVoucher = async (id) => {
    setVoucherToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      setDebugInfo(null)

      if (giftToDelete) {
        const id = giftToDelete
        console.log("Deleting gift with ID:", id)

        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()
        const url = `http://localhost:5001/gifts/${id}?t=${timestamp}`

        console.log("DELETE request URL:", url)

        // Use fetch API instead of axios for more direct control
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Delete response:", data)

        // Set debug info
        setDebugInfo({
          action: "Delete Gift",
          id: id,
          url: url,
          response: data,
          status: response.status,
          timestamp: new Date().toISOString(),
        })

        // Remove the deleted gift from the state
        setGifts((prevGifts) => prevGifts.filter((gift) => gift._id !== id))

        toast.success("Gift deleted successfully")
      } else if (voucherToDelete) {
        const id = voucherToDelete
        console.log("Deleting voucher with ID:", id)

        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()
        const url = `http://localhost:5001/vouchers/${id}?t=${timestamp}`

        console.log("DELETE request URL:", url)

        // Use fetch API instead of axios for more direct control
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Delete response:", data)

        // Set debug info
        setDebugInfo({
          action: "Delete Voucher",
          id: id,
          url: url,
          response: data,
          status: response.status,
          timestamp: new Date().toISOString(),
        })

        // Remove the deleted voucher from the state
        setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher._id !== id))

        toast.success("Voucher deleted successfully")
      }

      setDeleteLoading(false)
      setShowDeleteConfirm(false)
      setGiftToDelete(null)
      setVoucherToDelete(null)
    } catch (error) {
      console.error("Error deleting item:", error)

      // Set debug info for error
      setDebugInfo({
        action: giftToDelete ? "Delete Gift Error" : "Delete Voucher Error",
        id: giftToDelete || voucherToDelete,
        error: error.message,
        timestamp: new Date().toISOString(),
      })

      toast.error(`Failed to delete: ${error.message}`)
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
      setGiftToDelete(null)
      setVoucherToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setGiftToDelete(null)
    setVoucherToDelete(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)

      if (formData.sold !== undefined) {
        formDataToSend.append("sold", formData.sold)
      }

      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      let response

      if (editMode && currentGift) {
        response = await axios.put(`http://localhost:5001/gifts/${currentGift._id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        toast.success("Gift updated successfully")
      } else {
        response = await axios.post("http://localhost:5001/gifts", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        toast.success("Gift added successfully")
      }

      console.log("Save response:", response.data)

      // Set debug info
      setDebugInfo({
        action: editMode ? "Update Gift" : "Add Gift",
        id: currentGift?._id,
        response: response.data,
        status: response.status,
        timestamp: new Date().toISOString(),
      })

      setShowForm(false)

      // Force refresh the gifts list
      setRefreshKey((oldKey) => oldKey + 1)
    } catch (error) {
      console.error("Error saving gift:", error)

      // Set debug info for error
      setDebugInfo({
        action: editMode ? "Update Gift Error" : "Add Gift Error",
        id: currentGift?._id,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })

      toast.error("Failed to save gift. Please try again.")
    }
  }

  const handleVoucherSubmit = async (e) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", voucherFormData.name)
      formDataToSend.append("price", voucherFormData.price)
      formDataToSend.append("description", voucherFormData.description)
      formDataToSend.append("category", voucherFormData.category)
      formDataToSend.append("validityPeriod", voucherFormData.validityPeriod)
      formDataToSend.append("type", voucherFormData.type)

      if (voucherFormData.image) {
        formDataToSend.append("image", voucherFormData.image)
      }

      let response

      if (editVoucherMode && currentVoucher) {
        response = await axios.put(`http://localhost:5001/vouchers/${currentVoucher._id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        toast.success("Voucher updated successfully")
      } else {
        response = await axios.post("http://localhost:5001/vouchers", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        toast.success("Voucher added successfully")
      }

      console.log("Save voucher response:", response.data)

      // Set debug info
      setDebugInfo({
        action: editVoucherMode ? "Update Voucher" : "Add Voucher",
        id: currentVoucher?._id,
        response: response.data,
        status: response.status,
        timestamp: new Date().toISOString(),
      })

      setShowVoucherForm(false)

      // Force refresh the vouchers list
      setRefreshKey((oldKey) => oldKey + 1)
    } catch (error) {
      console.error("Error saving voucher:", error)

      // Set debug info for error
      setDebugInfo({
        action: editVoucherMode ? "Update Voucher Error" : "Add Voucher Error",
        id: currentVoucher?._id,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        timestamp: new Date().toISOString(),
      })

      toast.error("Failed to save voucher. Please try again.")
    }
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  const handleVoucherCancel = () => {
    setShowVoucherForm(false)
  }

  // Function to handle resetting all sold items
  const handleResetSoldItems = async () => {
    if (
      window.confirm("Are you sure you want to reset all sold items? This will make all sold gifts available again.")
    ) {
      try {
        setResetting(true)

        // Make API call to reset all sold items
        const response = await axios.post("http://localhost:5001/gifts/reset-sold")

        if (response.data.success) {
          // Show success message
          toast.success(response.data.message || "All sold items have been successfully reset!")
          // Refresh the gifts list
          setRefreshKey((oldKey) => oldKey + 1)
        } else {
          // Show error message if the API returns success: false
          toast.error(response.data.message || "Failed to reset sold items. Please try again.")
        }

        setResetting(false)
      } catch (error) {
        console.error("Error resetting sold items:", error)
        toast.error(error.response?.data?.message || "Failed to reset sold items. Please try again.")
        setResetting(false)
      }
    }
  }

  // Function to manually refresh gifts
  const handleManualRefresh = () => {
    toast.info("Refreshing data...")
    setRefreshKey((oldKey) => oldKey + 1)
  }

  // Function to handle updating order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/gift-orders/${orderId}/status`, {
        status: newStatus,
      })
      toast.success(`Order status updated to ${newStatus}`)
      fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status. Please try again.")
    }
  }

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/empty-cardboard-box.png"
    if (imagePath.startsWith("http")) return imagePath
    return `http://localhost:5001${imagePath}`
  }

  const toggleOrders = () => {
    const newShowOrders = !showOrders
    setShowOrders(newShowOrders)
    setShowVouchers(false)
    if (newShowOrders) {
      fetchOrders()
    }
  }

  const toggleVouchers = () => {
    const newShowVouchers = !showVouchers
    setShowVouchers(newShowVouchers)
    setShowOrders(false)
    if (newShowVouchers) {
      fetchVouchers()
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleRetryFetchOrders = () => {
    fetchOrders()
  }

  return (
    <div className="gifts-admin-container">
      <div className="admin-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="admin-title">Gift Management</h1>
        <div className="header-actions">
          <button className="refresh-button" onClick={handleManualRefresh}>
            <FaSync /> Refresh
          </button>
          <button className="debug-button" onClick={() => setShowDebug(!showDebug)}>
            <FaInfoCircle /> {showDebug ? "Hide Debug" : "Show Debug"}
          </button>
        </div>
      </div>

      {/* Debug Info Panel */}
      {showDebug && (
        <div className="debug-panel">
          <h3>Debug Information</h3>
          {debugInfo ? (
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          ) : (
            <p>No debug information available. Perform an action to see details.</p>
          )}
          <div className="debug-actions">
            <button onClick={() => console.log("Current gifts:", gifts)}>Log Gifts to Console</button>
            <button onClick={() => console.log("Current vouchers:", vouchers)}>Log Vouchers to Console</button>
            <button onClick={() => setRefreshKey((oldKey) => oldKey + 1)}>Force Refresh</button>
          </div>
        </div>
      )}

      <div className="admin-actions">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={showOrders ? "Search orders..." : showVouchers ? "Search vouchers..." : "Search gifts..."}
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="action-buttons">
          <button
            className={`view-toggle-button ${!showVouchers && !showOrders ? "active" : ""}`}
            onClick={() => {
              setShowVouchers(false)
              setShowOrders(false)
            }}
          >
            <FaGift /> Gifts
          </button>
          <button className={`view-toggle-button ${showVouchers ? "active" : ""}`} onClick={toggleVouchers}>
            <FaTicketAlt /> Vouchers
          </button>
          <button className={`view-toggle-button ${showOrders ? "active" : ""}`} onClick={toggleOrders}>
            <FaShoppingBag /> Orders
          </button>
          {!showOrders && !showVouchers && (
            <>
              <button className="reset-button" onClick={handleResetSoldItems} disabled={resetting}>
                <FaRedo /> {resetting ? "Resetting..." : "Reset Sold Items"}
              </button>
              <button className="add-button" onClick={handleAddNew}>
                <FaPlus /> Add New Gift
              </button>
            </>
          )}
          {showVouchers && (
            <button className="add-button" onClick={handleAddNewVoucher}>
              <FaPlus /> Add New Voucher
            </button>
          )}
        </div>
      </div>

      {/* Gifts Section */}
      {!showOrders && !showVouchers && (
        <>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading gifts...</p>
            </div>
          ) : (
            <div className="gifts-grid">
              {filteredGifts.length > 0 ? (
                filteredGifts.map((gift) => (
                  <div key={gift._id} className={`gift-card ${gift.sold ? "sold-gift" : ""}`}>
                    <div className="gift-image-container">
                      <img
                        src={getImageUrl(gift.image) || "/placeholder.svg"}
                        alt={gift.name}
                        className="gift-image"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/empty-cardboard-box.png"
                        }}
                      />
                      <div className="gift-category">{gift.category}</div>
                      {gift.sold && <div className="sold-badge">SOLD</div>}
                    </div>
                    <div className="gift-content">
                      <h3 className="gift-title">{gift.name}</h3>
                      <div className="gift-price">${gift.price.toFixed(2)}</div>
                      <p className="gift-description">{gift.description}</p>
                      <div className="gift-actions">
                        <button className="edit-button" onClick={() => handleEdit(gift)}>
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(gift._id)}
                          disabled={deleteLoading}
                        >
                          <FaTrash /> {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                      {/* Display gift ID for debugging */}
                      {showDebug && (
                        <div className="gift-debug">
                          <small>ID: {gift._id}</small>
                          <br />
                          <small>Sold: {gift.sold ? "Yes" : "No"}</small>
                          <br />
                          <small>Last Updated: {new Date(gift.updatedAt).toLocaleString()}</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-gifts">
                  <img src="/empty-cardboard-box.png" alt="No gifts found" className="no-gifts-image" />
                  <h3>No gifts found</h3>
                  <p>Add some gifts to get started or try a different search term.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Vouchers Section */}
      {showVouchers && (
        <>
          {voucherLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading vouchers...</p>
            </div>
          ) : (
            <div className="voucher-grid">
              {filteredVouchers.length > 0 ? (
                filteredVouchers.map((voucher) => (
                  <div key={voucher._id} className="voucher-card">
                    <div className="voucher-image-container">
                      <img
                        src={getImageUrl(voucher.image) || "/placeholder.svg"}
                        alt={voucher.name}
                        className="voucher-image"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/empty-cardboard-box.png"
                        }}
                      />
                      <div className="voucher-type">{voucher.type}</div>
                    </div>
                    <div className="voucher-content">
                      <div className="voucher-badge">
                        <FaTag size={12} />
                        {voucher.category}
                      </div>
                      <h3 className="voucher-title">{voucher.name}</h3>
                      <div className="voucher-price">${voucher.price.toFixed(2)}</div>
                      <div className="voucher-validity">
                        <FaCalendarAlt size={14} />
                        <span>Valid for: {voucher.validityPeriod}</span>
                      </div>
                      <p className="voucher-description">{voucher.description}</p>
                      <div className="voucher-actions">
                        <button className="edit-button" onClick={() => handleEditVoucher(voucher)}>
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteVoucher(voucher._id)}
                          disabled={deleteLoading}
                        >
                          <FaTrash /> {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                      {/* Display voucher ID for debugging */}
                      {showDebug && (
                        <div className="voucher-debug">
                          <small>ID: {voucher._id}</small>
                          <br />
                          <small>Type: {voucher.type}</small>
                          <br />
                          <small>Last Updated: {new Date(voucher.updatedAt).toLocaleString()}</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-vouchers">
                  <img src="/empty-cardboard-box.png" alt="No vouchers found" className="no-vouchers-image" />
                  <h3>No vouchers found</h3>
                  <p>Add some vouchers to get started or try a different search term.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Orders Section */}
      {showOrders && (
        <div className="orders-grid">
          <h2 className="section-title">Recent Orders</h2>

          {ordersError && (
            <div className="error-container">
              <p className="error-message">{ordersError}</p>
              <button className="retry-button" onClick={handleRetryFetchOrders}>
                Try Again
              </button>
            </div>
          )}

          {ordersLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id ? order._id.slice(-6) : "N/A"}</td>
                      <td>{order.user?.name || "Guest"}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.items?.length || 0} items</td>
                      <td>${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</td>
                      <td>
                        <span className={`status-badge status-${order.status || "pending"}`}>
                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
                        </span>
                      </td>
                      <td>
                        <div className="order-actions">
                          <button
                            className="view-order-button"
                            onClick={() => window.open(`/gifts/status/${order._id}`, "_blank")}
                          >
                            View
                          </button>
                          <div className="status-dropdown">
                            <select
                              value={order.status || "pending"}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-orders">
              <h3>No orders found</h3>
              <p>When customers place orders, they will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* Gift Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="gift-form-container">
            <div className="form-header">
              <h2>{editMode ? "Edit Gift" : "Add New Gift"}</h2>
              <button className="close-button" onClick={handleCancel}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="gift-form">
              <div className="form-group">
                <label htmlFor="name">Gift Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Gift Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="form-input file-input"
                  required={!editMode}
                />
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage || "/placeholder.svg"} alt="Preview" className="preview-img" />
                  </div>
                )}
              </div>

              {editMode && (
                <div className="form-group">
                  <label htmlFor="sold">Availability Status</label>
                  <select
                    id="sold"
                    name="sold"
                    value={formData.sold ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sold: e.target.value === "true",
                      })
                    }
                    className="form-input"
                  >
                    <option value="false">Available</option>
                    <option value="true">Sold</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="save-button">
                  <FaSave /> {editMode ? "Update Gift" : "Save Gift"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voucher Form Modal */}
      {showVoucherForm && (
        <div className="modal-overlay">
          <div className="gift-form-container">
            <div className="form-header">
              <h2>{editVoucherMode ? "Edit Voucher" : "Add New Voucher"}</h2>
              <button className="close-button" onClick={handleVoucherCancel}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleVoucherSubmit} className="gift-form">
              <div className="form-group">
                <label htmlFor="name">Voucher Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={voucherFormData.name}
                  onChange={handleVoucherInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={voucherFormData.price}
                  onChange={handleVoucherInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={voucherFormData.category}
                  onChange={handleVoucherInputChange}
                  required
                  className="form-input"
                >
                  {voucherCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="type">Voucher Type</label>
                <select
                  id="type"
                  name="type"
                  value={voucherFormData.type}
                  onChange={handleVoucherInputChange}
                  required
                  className="form-input"
                >
                  {voucherTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="validityPeriod">Validity Period</label>
                <input
                  type="text"
                  id="validityPeriod"
                  name="validityPeriod"
                  value={voucherFormData.validityPeriod}
                  onChange={handleVoucherInputChange}
                  required
                  className="form-input"
                  placeholder="e.g. 12 months, 6 months, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={voucherFormData.description}
                  onChange={handleVoucherInputChange}
                  required
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Voucher Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleVoucherImageChange}
                  accept="image/*"
                  className="form-input file-input"
                  required={!editVoucherMode}
                />
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage || "/placeholder.svg"} alt="Preview" className="preview-img" />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleVoucherCancel}>
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="save-button">
                  <FaSave /> {editVoucherMode ? "Update Voucher" : "Save Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <div className="confirm-header">
              <h3>Confirm Deletion</h3>
              <button className="close-button" onClick={cancelDelete}>
                <FaTimes />
              </button>
            </div>
            <div className="confirm-content">
              <div className="warning-icon">
                <FaTrash size={40} />
              </div>
              <p>Are you sure you want to delete this {giftToDelete ? "gift" : "voucher"}?</p>
              <p className="confirm-subtitle">This action cannot be undone.</p>
            </div>
            <div className="confirm-actions">
              <button className="cancel-button" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-confirm-button" onClick={confirmDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .gifts-admin-container {
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
          padding: 2rem;
          color: #333;
        }
        
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .header-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .back-button, .debug-button, .refresh-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #0ea5e9;
          font-weight: 500;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .back-button:hover, .debug-button:hover, .refresh-button:hover {
          background-color: rgba(14, 165, 233, 0.1);
        }
        
        .debug-button {
          color: #6366f1;
        }
        
        .refresh-button {
          color: #10b981;
        }
        
        .debug-panel {
          background-color: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
        }
        
        .debug-panel h3 {
          margin-top: 0;
          color: #0284c7;
        }
        
        .debug-panel pre {
          margin: 0;
          font-size: 0.85rem;
          background-color: #f8fafc;
          padding: 0.5rem;
          border-radius: 4px;
          overflow-x: auto;
        }
        
        .debug-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .debug-actions button {
          background-color: #e0f2fe;
          color: #0284c7;
          border: none;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .debug-actions button:hover {
          background-color: #bae6fd;
        }
        
        .gift-debug, .voucher-debug {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
          background-color: #f8fafc;
          padding: 0.5rem;
          border-radius: 4px;
        }
        
        .admin-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }
        
        .admin-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
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
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }
        
        .action-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .add-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #10b981;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .add-button:hover {
          background-color: #059669;
          transform: translateY(-2px);
        }
        
        .reset-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #6366f1;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .reset-button:hover {
          background-color: #4f46e5;
          transform: translateY(-2px);
        }
        
        .reset-button:disabled {
          background-color: #a5a6f6;
          cursor: not-allowed;
          transform: none;
        }
        
        .gifts-grid, .voucher-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .gift-card, .voucher-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .gift-card:hover, .voucher-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .sold-gift {
          opacity: 0.8;
          position: relative;
        }
        
        .sold-gift::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.05);
          pointer-events: none;
        }
        
        .gift-image-container, .voucher-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .gift-image, .voucher-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .gift-card:hover .gift-image, .voucher-card:hover .voucher-image {
          transform: scale(1.05);
        }
        
        .gift-category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background-color: rgba(14, 165, 233, 0.9);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          z-index: 1;
        }
        
        .voucher-type {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background-color: rgba(99, 102, 241, 0.9);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          z-index: 1;
        }
        
        .sold-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          background-color: rgba(239, 68, 68, 0.9);
          color: white;
          padding: 0.5rem 2rem;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 2px;
          z-index: 2;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .gift-content, .voucher-content {
          padding: 1.5rem;
        }
        
        .gift-title, .voucher-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .gift-price, .voucher-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: #10b981;
          margin-bottom: 1rem;
        }
        
        .gift-description, .voucher-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .gift-actions, .voucher-actions {
          display: flex;
          gap: 1rem;
        }
        
        .edit-button, .delete-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .edit-button {
          background-color: #e0f2fe;
          color: #0ea5e9;
        }
        
        .edit-button:hover {
          background-color: #0ea5e9;
          color: white;
        }
        
        .delete-button {
          background-color: #fee2e2;
          color: #ef4444;
        }
        
        .delete-button:hover {
          background-color: #ef4444;
          color: white;
        }
        
        .delete-button:disabled {
          background-color: #fecaca;
          color: #ef4444;
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .no-gifts, .no-vouchers {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .no-gifts-image, .no-vouchers-image {
          max-width: 200px;
          margin-bottom: 1.5rem;
        }
        
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
          border: 4px solid rgba(14, 165, 233, 0.2);
          border-radius: 50%;
          border-top-color: #0ea5e9;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1.5rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Error Container */
        .error-container {
          background-color: #fee2e2;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .error-message {
          color: #b91c1c;
          font-weight: 500;
        }
        
        .retry-button {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .retry-button:hover {
          background-color: #b91c1c;
        }
        
        /* Modal and Form Styles */
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
        
        .gift-form-container {
          background-color: white;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .form-header {
          padding: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .form-header h2 {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
          color: #333;
        }
        
        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .close-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #333;
        }
        
        .gift-form {
          padding: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          background-color: #fff;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }
        
        .file-input {
          padding: 0.5rem;
        }
        
        .image-preview {
          margin-top: 1rem;
          border-radius: 8px;
          overflow: hidden;
          max-width: 200px;
        }
        
        .preview-img {
          width: 100%;
          height: auto;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .cancel-button, .save-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .cancel-button {
          background-color: #f3f4f6;
          color: #4b5563;
        }
        
        .cancel-button:hover {
          background-color: #e5e7eb;
        }
        
        .save-button {
          background-color: #10b981;
          color: white;
        }
        
        .save-button:hover {
          background-color: #059669;
        }
        
        /* Orders Table Styles */
        .view-toggle-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #0ea5e9;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-toggle-button:hover {
          background-color: #0284c7;
          transform: translateY(-2px);
        }
        
        .view-toggle-button.active {
          background-color: #0c4a6e;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        .orders-grid {
          margin-top: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .orders-table-container {
          overflow-x: auto;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .orders-table th,
        .orders-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #f0f0f0;
        }

        .orders-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }

        .status-pending {
          background-color: #f59e0b;
        }

        .status-processing {
          background-color: #3b82f6;
        }

        .status-shipped {
          background-color: #8b5cf6;
        }

        .status-delivered {
          background-color: #10b981;
        }
        
        .status-cancelled {
          background-color: #ef4444;
        }

        .order-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .view-order-button {
          background-color: #6366f1;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-order-button:hover {
          background-color: #4f46e5;
        }
        
        .status-dropdown {
          min-width: 120px;
        }
        
        .status-select {
          width: 100%;
          padding: 0.5rem;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          background-color: #fff;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }
        
        .status-select:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.1);
        }

        .no-orders {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        /* Voucher Specific Styles */
        .voucher-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 500;
          background-color: #f0f9ff;
          color: #0284c7;
          margin-bottom: 1rem;
        }
        
        .voucher-validity {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .gifts-admin-container {
            padding: 1rem;
          }
          
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .admin-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .search-container {
            max-width: none;
          }
          
          .gifts-grid, .voucher-grid {
            grid-template-columns: 1fr;
          }
          
          .order-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }

        /* Delete Confirmation Dialog */
        .confirm-dialog {
          background-color: white;
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .confirm-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .confirm-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          color: #ef4444;
        }

        .confirm-content {
          padding: 2rem 1.5rem;
          text-align: center;
        }

        .warning-icon {
          color: #ef4444;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .confirm-subtitle {
          color: #6b7280;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .confirm-actions {
          display: flex;
          border-top: 1px solid #f0f0f0;
        }

        .confirm-actions button {
          flex: 1;
          padding: 1rem;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-button {
          background-color: #f9fafb;
          color: #4b5563;
        }

        .cancel-button:hover {
          background-color: #f3f4f6;
        }

        .delete-confirm-button {
          background-color: #ef4444;
          color: white;
        }

        .delete-confirm-button:hover {
          background-color: #dc2626;
        }

        .delete-confirm-button:disabled {
          background-color: #fca5a5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default GiftsAdmin
