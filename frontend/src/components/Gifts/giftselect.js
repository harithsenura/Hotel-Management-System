"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  ArrowLeft,
  ShoppingBag,
  Users,
  User,
  Plus,
  Minus,
  Search,
  Filter,
  X,
  Heart,
  Share,
  ShoppingCart,
  AlertCircle,
  Gift,
  Ticket,
} from "lucide-react"
import { getUser } from "../../services/userService"
import { isGiftOrdered } from "../../services/orderedGiftsService"
import { addOrderedGift } from "../../services/orderedGiftsService"

const GiftSelect = () => {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [giftType, setGiftType] = useState(null) // "individual" or "group"
  const [groupSize, setGroupSize] = useState(2)
  const [showGiftStore, setShowGiftStore] = useState(false)
  const [gifts, setGifts] = useState([])
  const [filteredGifts, setFilteredGifts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [orderedGifts, setOrderedGifts] = useState({})
  // New state for vouchers
  const [vouchers, setVouchers] = useState([])
  const [filteredVouchers, setFilteredVouchers] = useState([])
  const [showVouchers, setShowVouchers] = useState(false)
  // Remove this line:
  // const [groupContributors, setGroupContributors] = useState({})

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/events/${eventId}`)
        setEvent(res.data.data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching event:", err)
        setIsLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  // Fetch gifts from backend
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/gifts")
        if (res.data.success && res.data.data) {
          setGifts(res.data.data)
          setFilteredGifts(res.data.data)
        } else {
          // Fallback to sample data if API fails
          setGifts(getSampleGifts())
          setFilteredGifts(getSampleGifts())
        }
      } catch (err) {
        console.error("Error fetching gifts:", err)
        // Fallback to sample data if API fails
        setGifts(getSampleGifts())
        setFilteredGifts(getSampleGifts())
      }
    }

    fetchGifts()
  }, [])

  // Fetch vouchers from backend
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get("http://localhost:5001/vouchers")
        if (res.data.success && res.data.data) {
          setVouchers(res.data.data)
          setFilteredVouchers(res.data.data)
        } else {
          // Fallback to sample data if API fails
          setVouchers(getSampleVouchers())
          setFilteredVouchers(getSampleVouchers())
        }
      } catch (err) {
        console.error("Error fetching vouchers:", err)
        // Fallback to sample data if API fails
        setVouchers(getSampleVouchers())
        setFilteredVouchers(getSampleVouchers())
      }
    }

    fetchVouchers()
  }, [])

  // Add this with the other useEffect hooks
  useEffect(() => {
    const user = getUser()
    setCurrentUser(user)
  }, [])

  // Check which gifts have already been ordered
  useEffect(() => {
    const checkOrderedGifts = () => {
      const orderedStatus = {}
      gifts.forEach((gift) => {
        orderedStatus[gift._id] = isGiftOrdered(gift._id.toString())
      })
      setOrderedGifts(orderedStatus)
    }

    checkOrderedGifts()
  }, [gifts])

  // Sample gift data as fallback
  const getSampleGifts = () => {
    return [
      {
        _id: 1,
        name: "Premium Wine Set",
        price: 120,
        image: "https://m.media-amazon.com/images/I/71oqCFLv9zL._AC_UF894,1000_QL80_.jpg",
        category: "Beverages",
        description: "A luxurious wine set featuring a selection of premium wines paired with gourmet chocolates.",
      },
      {
        _id: 2,
        name: "Luxury Chocolate Box",
        price: 65,
        image: "https://www.harrods.com/BWStaticContent/50000/b_50491_p_ft.jpg",
        category: "Food",
        description: "Handcrafted chocolates from the finest cocoa beans, presented in an elegant gift box.",
      },
      {
        _id: 3,
        name: "Crystal Vase",
        price: 180,
        image:
          "https://www.waterford.com/-/media/products/2023/04/25/09/55/resource_waterford_40035944-vase-40cm-lismore-diamond.ashx",
        category: "Home Decor",
        description: "A stunning crystal vase that adds elegance to any home decor.",
      },
      {
        _id: 4,
        name: "Silver Photo Frame",
        price: 95,
        image:
          "https://www.riotstores.co.uk/cdn/shop/products/Salisbury-Pewter-Oxford-Photo-Frame-5x7-1_1200x1200.jpg?v=1678723537",
        category: "Home Decor",
        description: "A beautifully crafted silver photo frame to preserve precious memories.",
      },
      {
        _id: 5,
        name: "Spa Gift Basket",
        price: 150,
        image:
          "https://cdn.shopify.com/s/files/1/0072/1432/products/spa-gift-basket-premium-1_1024x1024.jpg?v=1677011165",
        category: "Wellness",
        description: "A complete spa experience with premium bath products, candles, and more.",
      },
      {
        _id: 6,
        name: "Gourmet Coffee Set",
        price: 85,
        image: "https://www.giftbasketsoverseas.com/images/products/20210209022218_F2021_GourmetCoffeeBreak.jpg",
        category: "Beverages",
        description: "A selection of premium coffee beans from around the world with a stylish coffee maker.",
      },
      {
        _id: 7,
        name: "Scented Candle Collection",
        price: 70,
        image: "https://cdn.shopify.com/s/files/1/0582/4693/5824/files/Candle_Collection_2_1200x1200.jpg?v=1689254658",
        category: "Home Decor",
        description: "A collection of luxury scented candles to create the perfect ambiance.",
      },
      {
        _id: 8,
        name: "Personalized Champagne",
        price: 110,
        image:
          "https://cdn.shopify.com/s/files/1/0248/9493/files/personalised-champagne-bottle-wedding-gift_grande.jpg?v=1582732186",
        category: "Beverages",
        description: "A bottle of premium champagne with a personalized label for the special occasion.",
      },
    ]
  }

  // Sample voucher data as fallback
  const getSampleVouchers = () => {
    return [
      {
        _id: "v1",
        name: "Luxury Spa Day",
        price: 150,
        image:
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "Wellness",
        description: "A full day of pampering at a luxury spa with massage, facial, and more.",
        validityPeriod: "12 months",
        type: "Experience",
      },
      {
        _id: "v2",
        name: "Fine Dining Experience",
        price: 200,
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "Dining",
        description: "A gourmet dining experience for two at a Michelin-starred restaurant.",
        validityPeriod: "6 months",
        type: "Experience",
      },
      {
        _id: "v3",
        name: "Adventure Package",
        price: 250,
        image:
          "https://images.unsplash.com/photo-1533130061792-64b345e4a833?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "Adventure",
        description: "Choose from skydiving, bungee jumping, or white water rafting for an adrenaline rush.",
        validityPeriod: "12 months",
        type: "Experience",
      },
      {
        _id: "v4",
        name: "Shopping Spree",
        price: 300,
        image:
          "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "Shopping",
        description: "A gift card for a luxury shopping experience at premium designer stores.",
        validityPeriod: "24 months",
        type: "Gift Card",
      },
      {
        _id: "v5",
        name: "Weekend Getaway",
        price: 500,
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "Travel",
        description: "A romantic weekend stay at a 5-star hotel with breakfast and spa access.",
        validityPeriod: "12 months",
        type: "Experience",
      },
      {
        _id: "v6",
        name: "Wine Tasting Tour",
        price: 180,
        image:
          "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "Beverages",
        description: "A guided tour of premium vineyards with wine tasting and gourmet lunch.",
        validityPeriod: "6 months",
        type: "Experience",
      },
      {
        _id: "v7",
        name: "Luxury Beauty Hamper",
        price: 120,
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "Beauty",
        description: "A collection of premium beauty products from top luxury brands.",
        validityPeriod: "N/A",
        type: "Product",
      },
      {
        _id: "v8",
        name: "Concert Tickets",
        price: 220,
        image:
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "Entertainment",
        description: "VIP tickets to a concert of choice with backstage access.",
        validityPeriod: "12 months",
        type: "Experience",
      },
    ]
  }

  // Filter gifts based on search and category
  useEffect(() => {
    let filtered = gifts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (gift) =>
          gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gift.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gift.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((gift) => gift.category === selectedCategory)
    }

    // Filter by price range
    if (selectedPriceRange !== "all") {
      const [min, max] = selectedPriceRange.split("-").map(Number)
      if (max) {
        filtered = filtered.filter((gift) => gift.price >= min && gift.price <= max)
      } else {
        filtered = filtered.filter((gift) => gift.price >= min)
      }
    }

    setFilteredGifts(filtered)
  }, [searchQuery, selectedCategory, selectedPriceRange, gifts])

  // Filter vouchers based on search and category
  useEffect(() => {
    let filtered = vouchers

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (voucher) =>
          voucher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voucher.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voucher.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((voucher) => voucher.category === selectedCategory)
    }

    // Filter by price range
    if (selectedPriceRange !== "all") {
      const [min, max] = selectedPriceRange.split("-").map(Number)
      if (max) {
        filtered = filtered.filter((voucher) => voucher.price >= min && voucher.price <= max)
      } else {
        filtered = filtered.filter((voucher) => voucher.price >= min)
      }
    }

    setFilteredVouchers(filtered)
  }, [searchQuery, selectedCategory, selectedPriceRange, vouchers])

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleGiftTypeSelect = (type) => {
    setGiftType(type)
  }

  const handleGroupSizeChange = (change) => {
    const newSize = groupSize + change
    if (newSize >= 2 && newSize <= 10) {
      setGroupSize(newSize)
    }
  }

  const handleContinue = () => {
    setShowGiftStore(true)
  }

  const handleAddToCart = (gift) => {
    // Check if the gift is already ordered
    if (orderedGifts[gift._id]) {
      alert(`${gift.name} has already been ordered and cannot be ordered again.`)
      return
    }

    // Existing code remains the same
    const existingItem = cart.find((item) => item.gift._id === gift._id)

    if (existingItem) {
      // If it exists, increase quantity
      const updatedCart = cart.map((item) =>
        item.gift._id === gift._id ? { ...item, quantity: item.quantity + 1 } : item,
      )
      setCart(updatedCart)
    } else {
      // If it doesn't exist, add it with quantity 1
      setCart([...cart, { gift, quantity: 1, giftType, groupSize: giftType === "group" ? groupSize : 1 }])
    }

    // Show a success message
    alert(`${gift.name} has been added to your cart!`)
  }

  const handleAddVoucherToCart = (voucher) => {
    // Check if the voucher is already in cart
    const existingItem = cart.find((item) => item.gift?._id === voucher._id)

    if (existingItem) {
      // If it exists, increase quantity
      const updatedCart = cart.map((item) =>
        item.gift._id === voucher._id ? { ...item, quantity: item.quantity + 1 } : item,
      )
      setCart(updatedCart)
    } else {
      // If it doesn't exist, add it with quantity 1
      setCart([
        ...cart,
        {
          gift: voucher,
          quantity: 1,
          giftType,
          groupSize: giftType === "group" ? groupSize : 1,
          isVoucher: true,
        },
      ])
    }

    // Show a success message
    alert(`${voucher.name} voucher has been added to your cart!`)
  }

  const handleRemoveFromCart = (giftId) => {
    const updatedCart = cart.filter((item) => item.gift._id !== giftId)
    setCart(updatedCart)
  }

  const handleUpdateQuantity = (giftId, change) => {
    const updatedCart = cart.map((item) => {
      if (item.gift._id === giftId) {
        const newQuantity = item.quantity + change
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    })
    setCart(updatedCart)
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.gift.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    // Save cart to localStorage as a backup
    localStorage.setItem("giftCart", JSON.stringify(cart))

    // Mark all gifts in cart as ordered
    cart.forEach((item) => {
      if (!item.isVoucher) {
        addOrderedGift(item.gift._id)
      }
    })

    // Navigate to payment page with cart data
    navigate("/gifts/payment", { state: { cart } })
  }

  // Get unique categories for filtering
  const categories = [
    "all",
    ...new Set([...gifts.map((gift) => gift.category), ...vouchers.map((voucher) => voucher.category)]),
  ]

  // Price ranges for filtering
  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under LKR 50", value: "0-50" },
    { label: "LKR 50 - LKR 100", value: "50-100" },
    { label: "LKR 100 - LKR 200", value: "100-200" },
    { label: "Over LKR 200", value: "200-" },
  ]

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?key=bd0ue"
    if (imagePath.startsWith("http")) return imagePath
    return `http://localhost:5001${imagePath}`
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    )
  }

  return (
    <div className="gift-select-container">
      <style jsx>{`
        /* Global Styles */
        .gift-select-container {
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
          color: #333;
        }
        
        /* Header Styles */
        .gift-header {
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
        
        .cart-button {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #f5f5f5;
          border: none;
          color: #333;
          padding: 0.75rem 1.25rem;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cart-button:hover {
          background-color: #eeeeee;
        }
        
        .cart-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #dc143c;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .event-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        
        .event-name {
          font-weight: 600;
          color: #dc143c;
        }
        
        /* Gift Type Selection */
        .gift-type-section {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #333;
        }
        
        .gift-type-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .gift-type-card {
          background-color: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .gift-type-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .gift-type-card.selected {
          border-color: #dc143c;
          background-color: rgba(220, 20, 60, 0.05);
        }
        
        .gift-type-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .gift-type-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(220, 20, 60, 0.1);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #dc143c;
        }
        
        .gift-type-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
        }
        
        .gift-type-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .group-size-control {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .group-size-label {
          font-weight: 500;
          color: #333;
        }
        
        .group-size-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .size-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #f5f5f5;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #333;
        }
        
        .size-button:hover {
          background-color: #eeeeee;
        }
        
        .size-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .group-size-value {
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }
        
        .continue-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: #dc143c;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 2rem;
        }
        
        .continue-button:hover {
          background-color: #b30000;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(220, 20, 60, 0.4);
        }
        
        .continue-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        /* Gift Store */
        .gift-store-section {
          padding: 2rem;
        }
        
        .store-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .search-filter-container {
          display: flex;
          gap: 1rem;
          align-items: center;
          max-width: 600px;
          width: 100%;
        }
        
        .search-bar {
          position: relative;
          flex-grow: 1;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 50px;
          border: 1px solid #e0e0e0;
          background-color: #f5f5f5;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #dc143c;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }
        
        .filter-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          color: #333;
          padding: 0.75rem 1.25rem;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-button:hover {
          background-color: #eeeeee;
        }
        
        .filter-button.active {
          background-color: #dc143c;
          color: white;
          border-color: #dc143c;
        }
        
        /* Filters Panel */
        .filters-panel {
          background-color: white;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .filters-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
        }
        
        .close-filters {
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
        
        .close-filters:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #333;
        }
        
        .filter-groups {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
        }
        
        .filter-group {
          flex: 1;
          min-width: 200px;
        }
        
        .filter-group-title {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #666;
        }
        
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .filter-option {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
        }
        
        .filter-option:hover {
          background-color: #eeeeee;
        }
        
        .filter-option.selected {
          background-color: #dc143c;
          color: white;
          border-color: #dc143c;
        }
        
        /* Gift Grid */
        .gifts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .gift-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .gift-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .gift-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .gift-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .gift-card:hover .gift-image {
          transform: scale(1.05);
        }
        
        .gift-category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background-color: rgba(220, 20, 60, 0.9);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .gift-actions {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
        }
        
        .gift-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          border: none;
          color: #666;
        }
        
        .gift-action-btn:hover {
          transform: scale(1.1);
          color: #dc143c;
        }
        
        .gift-content {
          padding: 1.5rem;
        }
        
        .gift-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .gift-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: #dc143c;
          margin-bottom: 1rem;
        }
        
        .gift-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .add-to-cart-btn {
          display: flex;
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
          width: 100%;
          justify-content: center;
        }
        
        .add-to-cart-btn:hover {
          background-color: #b30000;
        }

        .already-ordered-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #888888;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: not-allowed;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
        }

        .gift-card.ordered {
          position: relative;
          opacity: 0.8;
        }

        .ordered-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 5;
          pointer-events: none;
        }

        .ordered-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #888888;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          z-index: 6;
        }
        
        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .empty-state-image {
          max-width: 250px;
          margin-bottom: 1.5rem;
        }
        
        .empty-state-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .empty-state-text {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        /* Cart Modal */
        .cart-modal-overlay {
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
        
        .cart-modal {
          background-color: white;
          border-radius: 12px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }
        
        .cart-modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .cart-modal-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .close-modal {
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
        
        .close-modal:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #333;
        }
        
        .cart-modal-content {
          padding: 1.5rem;
          overflow-y: auto;
          flex-grow: 1;
        }
        
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .cart-item {
          display: flex;
          gap: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .cart-item-image {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          object-fit: cover;
        }
        
        .cart-item-details {
          flex-grow: 1;
        }
        
        .cart-item-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .cart-item-price {
          font-size: 1rem;
          font-weight: 600;
          color: #dc143c;
          margin-bottom: 0.5rem;
        }
        
        .cart-item-type {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
        
        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .quantity-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .quantity-button {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #f5f5f5;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #333;
        }
        
        .quantity-button:hover {
          background-color: #eeeeee;
        }
        
        .quantity-value {
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }
        
        .remove-button {
          background: none;
          border: none;
          color: #dc143c;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .remove-button:hover {
          background-color: rgba(220, 20, 60, 0.1);
        }
        
        .cart-empty {
          text-align: center;
          padding: 2rem;
        }
        
        .cart-empty-image {
          max-width: 200px;
          margin-bottom: 1.5rem;
        }
        
        .cart-empty-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .cart-empty-text {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .cart-modal-footer {
          padding: 1.5rem;
          border-top: 1px solid #f0f0f0;
          background-color: #f8f9fa;
        }
        
        .cart-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .cart-total-label {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }
        
        .cart-total-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #dc143c;
        }
        
        .checkout-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: #dc143c;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
        }
        
        .checkout-button:hover {
          background-color: #b30000;
        }

        /* Group Contributors */
        .group-info {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .group-size-info {
          display: block;
          font-weight: 500;
        }

        .group-note {
          display: block;
          font-size: 0.8rem;
          color: #888;
          font-style: italic;
          margin-top: 0.25rem;
        }
        
        /* Loading Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
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
        
        /* Responsive Design */
        @media (max-width: 992px) {
          .gifts-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }
        
        @media (max-width: 768px) {
          .gift-header {
            padding: 1rem;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
          
          .gift-type-section, .gift-store-section {
            padding: 1rem;
          }
          
          .gifts-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 1rem;
          }
          
          .cart-item {
            flex-direction: column;
            gap: 1rem;
          }
          
          .cart-item-image {
            width: 100%;
            height: 150px;
          }
        }
        
        @media (max-width: 576px) {
          .header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .cart-button {
            align-self: flex-end;
          }
          
          .store-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .search-filter-container {
            width: 100%;
          }
          
          .gifts-grid {
            grid-template-columns: 1fr;
          }
          
          .filter-groups {
            flex-direction: column;
            gap: 1rem;
          }
        }

        /* Voucher Styles */
        .gift-type-selector {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .gift-type-tab {
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #f5f5f5;
          color: #666;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 2px solid transparent;
        }

        .gift-type-tab:hover {
          background-color: #eeeeee;
        }

        .gift-type-tab.active {
          background-color: rgba(220, 20, 60, 0.1);
          color: #dc143c;
          border-color: #dc143c;
        }

        .voucher-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
        }

        .voucher-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .voucher-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .voucher-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .voucher-card:hover .voucher-image {
          transform: scale(1.05);
        }

        .voucher-content {
          padding: 1.5rem;
        }

        .voucher-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .voucher-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: #dc143c;
          margin-bottom: 0.5rem;
        }

        .voucher-validity {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        .voucher-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .voucher-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

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
      `}</style>

      {/* Header */}
      <header className="gift-header">
        <div className="header-top">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="page-title">Gift Selection</h1>

          <button className="cart-button" onClick={() => setShowCart(true)}>
            <ShoppingCart size={18} />
            Cart
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
        </div>

        {event && (
          <div className="event-info">
            <span className="event-name">{event.Event}</span>
            <span>•</span>
            <span>{new Date(event.Date).toLocaleDateString()}</span>
            <span>•</span>
            <span>{event.Venue}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {!showGiftStore ? (
          <section className="gift-type-section">
            <h2 className="section-title">How would you like to give a gift?</h2>

            <div className="gift-type-options">
              <div
                className={`gift-type-card ${giftType === "individual" ? "selected" : ""}`}
                onClick={() => handleGiftTypeSelect("individual")}
              >
                <div className="gift-type-header">
                  <div className="gift-type-icon">
                    <User size={20} />
                  </div>
                  <h3 className="gift-type-title">Individual Gift</h3>
                </div>
                <p className="gift-type-description">
                  Give a gift individually. Choose from our selection of premium gifts for the special occasion.
                </p>
              </div>

              <div
                className={`gift-type-card ${giftType === "group" ? "selected" : ""}`}
                onClick={() => handleGiftTypeSelect("group")}
              >
                <div className="gift-type-header">
                  <div className="gift-type-icon">
                    <Users size={20} />
                  </div>
                  <h3 className="gift-type-title">Group Gift</h3>
                </div>
                <p className="gift-type-description">
                  Contribute to a group gift with friends or family. Pool resources for a more substantial present.
                </p>

                {giftType === "group" && (
                  <div className="group-size-control">
                    <span className="group-size-label">Number of contributors:</span>
                    <div className="group-size-buttons">
                      <button
                        className="size-button"
                        onClick={() => handleGroupSizeChange(-1)}
                        disabled={groupSize <= 2}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="group-size-value">{groupSize}</span>
                      <button
                        className="size-button"
                        onClick={() => handleGroupSizeChange(1)}
                        disabled={groupSize >= 10}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="continue-button" onClick={handleContinue} disabled={!giftType}>
              Continue to Gift Selection
            </button>
          </section>
        ) : (
          <section className="gift-store-section">
            <div className="store-header">
              <h2 className="section-title">Select a Gift {giftType === "group" ? `(Group of ${groupSize})` : ""}</h2>

              <div className="search-filter-container">
                <div className="search-bar">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search gifts..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  className={`filter-button ${showFilters ? "active" : ""}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} />
                  Filters
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="filters-panel"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="filters-header">
                    <h2 className="filters-title">Filter Gifts</h2>
                    <button className="close-filters" onClick={() => setShowFilters(false)}>
                      <X size={20} />
                    </button>
                  </div>

                  <div className="filter-groups">
                    <div className="filter-group">
                      <h3 className="filter-group-title">Category</h3>
                      <div className="filter-options">
                        {categories.map((category) => (
                          <div
                            key={category}
                            className={`filter-option ${selectedCategory === category ? "selected" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category === "all" ? "All Categories" : category}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="filter-group">
                      <h3 className="filter-group-title">Price Range</h3>
                      <div className="filter-options">
                        {priceRanges.map((range) => (
                          <div
                            key={range.value}
                            className={`filter-option ${selectedPriceRange === range.value ? "selected" : ""}`}
                            onClick={() => setSelectedPriceRange(range.value)}
                          >
                            {range.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gift Type Selector Tabs */}
            <div className="gift-type-selector">
              <div className={`gift-type-tab ${!showVouchers ? "active" : ""}`} onClick={() => setShowVouchers(false)}>
                <Gift size={18} />
                Physical Gifts
              </div>
              <div className={`gift-type-tab ${showVouchers ? "active" : ""}`} onClick={() => setShowVouchers(true)}>
                <Ticket size={18} />
                Vouchers
              </div>
            </div>

            {/* Physical Gifts Section */}
            {!showVouchers && (
              <>
                {filteredGifts.length > 0 ? (
                  <div className="gifts-grid">
                    {filteredGifts.map((gift) => (
                      <motion.div
                        key={gift._id}
                        className={`gift-card ${orderedGifts[gift._id] ? "ordered" : ""}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {orderedGifts[gift._id] && <div className="ordered-badge">Already Ordered</div>}
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
                          <div className="gift-actions">
                            <button className="gift-action-btn">
                              <Heart size={18} />
                            </button>
                            <button className="gift-action-btn">
                              <Share size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="gift-content">
                          <h2 className="gift-title">{gift.name}</h2>
                          <div className="gift-price">LKR {gift.price.toFixed(2)}</div>
                          <p className="gift-description">{gift.description}</p>
                          {orderedGifts[gift._id] ? (
                            <button className="already-ordered-btn" disabled>
                              <AlertCircle size={18} />
                              Already Ordered
                            </button>
                          ) : (
                            <button className="add-to-cart-btn" onClick={() => handleAddToCart(gift)}>
                              <ShoppingBag size={18} />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <img src="/empty-cardboard-box.png" alt="No gifts found" className="empty-state-image" />
                    <h2 className="empty-state-title">No gifts found</h2>
                    <p className="empty-state-text">We couldn't find any gifts matching your search criteria.</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("all")
                        setSelectedPriceRange("all")
                      }}
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </>
            )}

            {/* Vouchers Section */}
            {showVouchers && (
              <>
                {filteredVouchers.length > 0 ? (
                  <div className="voucher-grid">
                    {filteredVouchers.map((voucher) => (
                      <motion.div
                        key={voucher._id}
                        className="voucher-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
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
                          <div className="gift-actions">
                            <button className="gift-action-btn">
                              <Heart size={18} />
                            </button>
                            <button className="gift-action-btn">
                              <Share size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="voucher-content">
                          <div className="voucher-badge">
                            <Ticket size={14} />
                            {voucher.category}
                          </div>
                          <h2 className="voucher-title">{voucher.name}</h2>
                          <div className="voucher-price">LKR {voucher.price.toFixed(2)}</div>
                          <div className="voucher-validity">
                            <span>Valid for: {voucher.validityPeriod}</span>
                          </div>
                          <p className="voucher-description">{voucher.description}</p>
                          <button className="add-to-cart-btn" onClick={() => handleAddVoucherToCart(voucher)}>
                            <Ticket size={18} />
                            Add to Cart
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <img src="/empty-cardboard-box.png" alt="No vouchers found" className="empty-state-image" />
                    <h2 className="empty-state-title">No vouchers found</h2>
                    <p className="empty-state-text">We couldn't find any vouchers matching your search criteria.</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("all")
                        setSelectedPriceRange("all")
                      }}
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </section>
        )}
      </main>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            className="cart-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
          >
            <motion.div
              className="cart-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cart-modal-header">
                <h2 className="cart-modal-title">
                  <ShoppingCart size={20} />
                  Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
                </h2>
                <button className="close-modal" onClick={() => setShowCart(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="cart-modal-content">
                {cart.length > 0 ? (
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.gift._id} className="cart-item">
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
                          <div className="cart-item-type">
                            {item.isVoucher
                              ? "Voucher"
                              : item.giftType === "individual"
                                ? "Individual Gift"
                                : `Group Gift (${item.groupSize} contributors)`}
                          </div>
                          {item.giftType === "group" && !item.isVoucher && (
                            <div className="group-info">
                              <span className="group-size-info">Group of {item.groupSize} contributors</span>
                              <span className="group-note">You can add contributors at checkout</span>
                            </div>
                          )}
                          <div className="cart-item-actions">
                            <div className="quantity-control">
                              <button
                                className="quantity-button"
                                onClick={() => handleUpdateQuantity(item.gift._id, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="quantity-value">{item.quantity}</span>
                              <button
                                className="quantity-button"
                                onClick={() => handleUpdateQuantity(item.gift._id, 1)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button className="remove-button" onClick={() => handleRemoveFromCart(item.gift._id)}>
                              <X size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="cart-empty">
                    <img src="/empty-cardboard-box.png" alt="Empty Cart" className="cart-empty-image" />
                    <h3 className="cart-empty-title">Your cart is empty</h3>
                    <p className="cart-empty-text">Add some gifts to your cart to get started.</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        setShowCart(false)
                        setShowGiftStore(true)
                      }}
                    >
                      Browse Gifts
                    </button>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="cart-modal-footer">
                  <div className="cart-summary">
                    <span className="cart-total-label">Total:</span>
                    <span className="cart-total-value">LKR {calculateTotal().toFixed(2)}</span>
                  </div>
                  <button className="checkout-button" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GiftSelect
