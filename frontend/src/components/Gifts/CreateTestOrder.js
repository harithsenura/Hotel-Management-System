"use client"

import { useState } from "react"
import axios from "axios"
import { getUser } from "../../services/userService"
import { ShoppingBag } from "lucide-react"

const CreateTestOrder = ({ onSuccess }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)

  const createTestOrder = async () => {
    try {
      setIsCreating(true)
      setError(null)

      // Get current user
      const currentUser = getUser()

      if (!currentUser || !currentUser._id) {
        setError("You must be logged in to create a test order")
        setIsCreating(false)
        return
      }

      // Create a test order
      const orderData = {
        user: currentUser._id, // Make sure user ID is included
        orderType: "gift",
        items: [
          {
            gift: "65f1a5b9e9a72e001c3a1234", // This is a placeholder ID
            quantity: 1,
            giftType: "individual",
          },
        ],
        totalAmount: 29.99,
        paymentMethod: "credit_card",
        paymentDetails: {
          cardLast4: "4242",
          cardBrand: "Visa",
        },
        deliveryAddress: currentUser.address || "Kandy, Sri Lanka",
        status: "pending",
      }

      console.log("Creating test order with user ID:", currentUser._id)
      const response = await axios.post("http://localhost:5001/gift-orders", orderData)

      // Store the order in localStorage
      try {
        // Store the order ID in localStorage
        const orderedGifts = localStorage.getItem("orderedGifts")
          ? JSON.parse(localStorage.getItem("orderedGifts"))
          : []

        orderedGifts.push(response.data.data._id)
        localStorage.setItem("orderedGifts", JSON.stringify(orderedGifts))

        // Also store the user's orders
        const userOrders = localStorage.getItem("userOrders") ? JSON.parse(localStorage.getItem("userOrders")) : {}

        if (!userOrders[currentUser._id]) {
          userOrders[currentUser._id] = []
        }

        userOrders[currentUser._id].push(response.data.data._id)
        localStorage.setItem("userOrders", JSON.stringify(userOrders))

        console.log("Test order stored in localStorage:", {
          orderId: response.data.data._id,
          userId: currentUser._id,
        })
      } catch (storageError) {
        console.error("Error storing test order in localStorage:", storageError)
      }

      setIsCreating(false)
      if (onSuccess) {
        onSuccess(response.data.data)
      }
    } catch (err) {
      console.error("Error creating test order:", err)
      setError(err.response?.data?.error || err.message || "Failed to create test order")
      setIsCreating(false)
    }
  }

  return (
    <div>
      <button
        onClick={createTestOrder}
        disabled={isCreating}
        className="create-test-order-btn"
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: isCreating ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          opacity: isCreating ? 0.7 : 1,
        }}
      >
        <ShoppingBag size={18} />
        {isCreating ? "Creating..." : "Create Test Order"}
      </button>
      {error && (
        <div
          style={{
            marginTop: "0.75rem",
            color: "#dc143c",
            backgroundColor: "rgba(220, 20, 60, 0.1)",
            padding: "0.75rem",
            borderRadius: "4px",
            fontSize: "0.9rem",
          }}
        >
          Error: {error}
        </div>
      )}
    </div>
  )
}

export default CreateTestOrder
