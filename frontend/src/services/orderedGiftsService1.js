import axios from "axios"

// Get all orders
export const getAllOrders = async () => {
  try {
    console.log("Fetching all orders")
    const timestamp = new Date().getTime()
    const response = await axios.get(`http://localhost:5001/gift-orders?t=${timestamp}`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
    console.log(`Fetched ${response.data.count} orders`)
    return response.data
  } catch (error) {
    console.error("Error fetching all orders:", error)
    throw error
  }
}

// Get orders by user ID
export const getUserOrders = async (userId) => {
  try {
    console.log(`Fetching orders for user: ${userId}`)
    const timestamp = new Date().getTime()
    const response = await axios.get(`http://localhost:5001/gift-orders/user/${userId}?t=${timestamp}`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
    console.log(`Fetched ${response.data.count} orders for user ${userId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user orders:", error)
    throw error
  }
}

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`http://localhost:5001/gift-orders/${orderId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching order:", error)
    throw error
  }
}

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`http://localhost:5001/gift-orders/${orderId}/status`, { status })
    return response.data
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

// Create a new order
export const createOrder = async (orderData) => {
  try {
    // Add orderType to the orderData
    const giftOrderData = {
      ...orderData,
      orderType: "gift",
    }

    console.log("Creating order with data:", giftOrderData)

    // Change this line from:
    // const response = await axios.post("http://localhost:5001/orders", orderData)
    // To:
    const response = await axios.post("http://localhost:5001/gift-orders", giftOrderData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })

    console.log("Order creation response:", response.data)

    // Store the order in localStorage for backup
    try {
      // Store the order ID in localStorage to ensure we can find it later
      const orderedGifts = localStorage.getItem("orderedGifts") ? JSON.parse(localStorage.getItem("orderedGifts")) : []
      if (response.data && response.data.data && response.data.data._id) {
        orderedGifts.push(response.data.data._id)
        localStorage.setItem("orderedGifts", JSON.stringify(orderedGifts))
        console.log("Stored order ID in orderedGifts:", response.data.data._id)
      }

      // Also store the user's orders
      const userOrders = localStorage.getItem("userOrders") ? JSON.parse(localStorage.getItem("userOrders")) : {}
      if (giftOrderData.user) {
        if (!userOrders[giftOrderData.user]) {
          userOrders[giftOrderData.user] = []
        }
        if (response.data && response.data.data && response.data.data._id) {
          userOrders[giftOrderData.user].push(response.data.data._id)
          localStorage.setItem("userOrders", JSON.stringify(userOrders))
          console.log("Stored order ID in userOrders for user:", giftOrderData.user, response.data.data._id)
        }
      }
    } catch (storageError) {
      console.error("Error storing order in localStorage:", storageError)
    }

    return response.data.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`http://localhost:5001/gift-orders/${orderId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting order:", error)
    throw error
  }
}

// Add a function to check if a gift is already ordered
export const isGiftOrdered = (giftId) => {
  // This is a simple implementation - you might want to enhance this
  // to check against actual orders in the database
  const orderedGifts = localStorage.getItem("orderedGifts") ? JSON.parse(localStorage.getItem("orderedGifts")) : []

  return orderedGifts.includes(giftId)
}

// Add a function to mark a gift as ordered
export const addOrderedGift = (giftId) => {
  const orderedGifts = localStorage.getItem("orderedGifts") ? JSON.parse(localStorage.getItem("orderedGifts")) : []

  if (!orderedGifts.includes(giftId)) {
    orderedGifts.push(giftId)
    localStorage.setItem("orderedGifts", JSON.stringify(orderedGifts))
  }
}

// Get orders from localStorage
export const getOrdersFromLocalStorage = (userId) => {
  try {
    console.log("Getting orders from localStorage for user:", userId)
    const userOrders = localStorage.getItem("userOrders") ? JSON.parse(localStorage.getItem("userOrders")) : {}
    const orderIds = userOrders[userId] || []
    console.log(`Found ${orderIds.length} order IDs in localStorage for user ${userId}:`, orderIds)
    return orderIds
  } catch (error) {
    console.error("Error getting orders from localStorage:", error)
    return []
  }
}
