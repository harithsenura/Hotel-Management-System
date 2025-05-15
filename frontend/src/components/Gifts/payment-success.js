"use client"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, Gift, ArrowLeft, Download, Share2 } from "lucide-react"

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId, eventDetails, selectedGifts } = location.state || {}

  // Calculate total
  const totalAmount = selectedGifts?.reduce((total, gift) => total + gift.price * gift.quantity, 0) || 0

  // If no order data, redirect to home
  if (!orderId) {
    navigate("/")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-green-50 p-8 text-center border-b">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
          <p className="text-green-600 text-lg">Thank you for your gift purchase</p>
        </div>

        {/* Order Details */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Event:</span>
                <span className="font-medium">{eventDetails?.name || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Gift List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Gift className="mr-2 text-purple-500" size={20} />
              Purchased Gifts
            </h2>

            <div className="space-y-4">
              {selectedGifts?.map((gift) => (
                <div key={gift._id} className="flex items-center border-b pb-4">
                  <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                    <img
                      src={gift.imageUrl || "/placeholder.svg?height=48&width=48&query=gift"}
                      alt={gift.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{gift.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${gift.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Qty: {gift.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-6 py-3 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Return to Home
            </button>

            <button className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <Download size={18} className="mr-2" />
              Download Receipt
            </button>

            <button className="flex items-center px-6 py-3 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
              <Share2 size={18} className="mr-2" />
              Share
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentSuccess
