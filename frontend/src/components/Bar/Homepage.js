"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  X,
  ShoppingCart,
  ShoppingBag,
  Plus,
  Minus,
  Heart,
  Share,
  Check,
  ShoppingBasket,
  DollarSign,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react"

const Homepage = () => {
  const [itemsData, setItemsData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("foods")
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [serverUrl, setServerUrl] = useState("http://localhost:5001") // Set your server URL here
  const [showItemModal, setShowItemModal] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [itemQuantity, setItemQuantity] = useState(1)
  const modalRef = useRef(null)

  const categories = [
    {
      name: "foods",
      displayName: "Foods",
      imageUrl: "https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg",
    },
    {
      name: "alcoholicBeverages",
      displayName: "Alcoholic",
      imageUrl:
        "https://st2.depositphotos.com/1364311/10133/i/950/depositphotos_101337220-stock-photo-glass-of-scotch-whiskey-and.jpg",
    },
    {
      name: "beer",
      displayName: "Beer",
      imageUrl: "https://www.shutterstock.com/image-photo/mug-beer-on-white-background-260nw-162010502.jpg",
    },
    {
      name: "wine",
      displayName: "Wine",
      imageUrl: "https://img.freepik.com/premium-vector/realistic-red-wine-glass-white-background_322978-421.jpg",
    },
    {
      name: "nonAlcoholicBeverages",
      displayName: "Non-Alcoholic",
      imageUrl: "https://thumbs.dreamstime.com/b/glass-water-isolated-white-background-closeup-110854166.jpg",
    },
    {
      name: "cocktails",
      displayName: "Cocktails",
      imageUrl:
        "https://img.freepik.com/premium-vector/alcohol-cocktail-margarita-with-slice-lime-vintage-vector-hatching-color-hand-drawn-illustration-isolated-white-background_496122-204.jpg",
    },
    {
      name: "juice",
      displayName: "Juice",
      imageUrl: "https://as1.ftcdn.net/v2/jpg/01/09/44/36/1000_F_109443609_X5D0xbooQukFqgTusaRXWMR6X1j7BL9Z.jpg",
    },
    {
      name: "tobacco",
      displayName: "Tobacco",
      imageUrl:
        "https://img.freepik.com/premium-photo/close-up-cigarette-with-smoke-showing-white-background_185126-673.jpg",
    },
    {
      name: "snacks",
      displayName: "Snacks",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/026/564/651/non_2x/healthy-snacks-white-isolated-background-foodgraphy-ai-generated-photo.jpg",
    },
  ]

  const dispatch = useDispatch()

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" })
        const { data } = await axios.get("/api/items/get-item")
        console.log("Items fetched:", data)
        setItemsData(data)
        dispatch({ type: "HIDE_LOADING" })
      } catch (error) {
        console.log(error)
        dispatch({ type: "HIDE_LOADING" })
      }
    }
    getAllItems()
  }, [dispatch])

  // Helper function to parse price values
  const parsePrice = (price) => {
    if (price === undefined || price === null) return 0

    // If it's already a number, return it
    if (typeof price === "number") return price

    // If it's a string, try to parse it
    if (typeof price === "string") {
      // Remove any non-numeric characters except decimal point
      const cleanedPrice = price.replace(/[^0-9.]/g, "")
      const parsedPrice = Number.parseFloat(cleanedPrice)
      return isNaN(parsedPrice) ? 0 : parsedPrice
    }

    return 0
  }

  // Filter items based on search query and category
  const filteredItems = itemsData.filter(
    (item) =>
      item.category.toLowerCase() === selectedCategory.toLowerCase() &&
      (searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.price && item.price.toString().includes(searchQuery))),
  )

  // Function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image"

    // If it's already a full URL, return it
    if (imagePath.startsWith("http")) return imagePath

    // If it's a relative path, prepend the server URL
    return `${serverUrl}${imagePath}`
  }

  // Open item modal with selected item
  const openItemModal = (item) => {
    setSelectedItem(item)

    // Initialize selected ingredients with default ingredients
    if (item.ingredients && item.ingredients.length > 0) {
      const defaultSelected = item.ingredients.filter((ing) => ing.isDefault).map((ing) => ({ ...ing, selected: true }))

      const optionalIngredients = item.ingredients
        .filter((ing) => !ing.isDefault)
        .map((ing) => ({ ...ing, selected: false }))

      setSelectedIngredients([...defaultSelected, ...optionalIngredients])
    } else {
      setSelectedIngredients([])
    }

    setItemQuantity(1)
    setShowItemModal(true)
  }

  // Toggle ingredient selection
  const toggleIngredient = (index) => {
    const updatedIngredients = [...selectedIngredients]
    updatedIngredients[index].selected = !updatedIngredients[index].selected
    setSelectedIngredients(updatedIngredients)
  }

  // Calculate total price with selected ingredients
  const calculateItemTotal = () => {
    if (!selectedItem) return 0

    const basePrice = parsePrice(selectedItem.price)

    // Add price of selected ingredients
    const ingredientsPrice = selectedIngredients
      .filter((ing) => ing.selected)
      .reduce((total, ing) => total + parsePrice(ing.price), 0)

    return (basePrice + ingredientsPrice) * itemQuantity
  }

  // Add customized item to cart
  const handleAddCustomizedToCart = () => {
    if (!selectedItem) return

    const customItem = {
      ...selectedItem,
      selectedIngredients: selectedIngredients.filter((ing) => ing.selected),
      customPrice: calculateItemTotal() / itemQuantity,
    }

    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.item._id === selectedItem._id &&
        JSON.stringify(cartItem.item.selectedIngredients) === JSON.stringify(customItem.selectedIngredients),
    )

    if (existingItemIndex !== -1) {
      // If same item with same ingredients exists, update quantity
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += itemQuantity
      setCart(updatedCart)
    } else {
      // Otherwise add as new item
      setCart([...cart, { item: customItem, quantity: itemQuantity }])
    }

    setShowItemModal(false)

    // Show success animation
    const successMessage = document.createElement("div")
    successMessage.className = "success-animation"
    successMessage.innerHTML = `
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div class="success-text">${selectedItem.name} added to cart!</div>
    `
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.classList.add("fade-out")
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 500)
    }, 2000)
  }

  // Add to cart function (simple version, without customization)
  const handleAddToCart = (item) => {
    // If item has ingredients, open modal for customization
    if (item.ingredients && item.ingredients.length > 0) {
      openItemModal(item)
      return
    }

    // Otherwise add directly to cart
    const existingItem = cart.find((cartItem) => cartItem.item._id === item._id)

    if (existingItem) {
      // If it exists, increase quantity
      const updatedCart = cart.map((cartItem) =>
        cartItem.item._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
      )
      setCart(updatedCart)
    } else {
      // If it doesn't exist, add it with quantity 1
      setCart([...cart, { item, quantity: 1 }])
    }

    // Show success animation
    const successMessage = document.createElement("div")
    successMessage.className = "success-animation"
    successMessage.innerHTML = `
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div class="success-text">${item.name} added to cart!</div>
    `
    document.body.appendChild(successMessage)

    setTimeout(() => {
      successMessage.classList.add("fade-out")
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 500)
    }, 2000)
  }

  const handleRemoveFromCart = (itemId, selectedIngredients = null) => {
    if (selectedIngredients) {
      // Remove specific customized item
      const updatedCart = cart.filter(
        (cartItem) =>
          !(
            cartItem.item._id === itemId &&
            JSON.stringify(cartItem.item.selectedIngredients) === JSON.stringify(selectedIngredients)
          ),
      )
      setCart(updatedCart)
    } else {
      // Remove any version of the item
      const updatedCart = cart.filter((cartItem) => cartItem.item._id !== itemId)
      setCart(updatedCart)
    }
  }

  const handleUpdateQuantity = (itemId, change, selectedIngredients = null) => {
    const updatedCart = cart.map((cartItem) => {
      if (selectedIngredients) {
        // Update specific customized item
        if (
          cartItem.item._id === itemId &&
          JSON.stringify(cartItem.item.selectedIngredients) === JSON.stringify(selectedIngredients)
        ) {
          const newQuantity = cartItem.quantity + change
          return newQuantity > 0 ? { ...cartItem, quantity: newQuantity } : cartItem
        }
      } else {
        // Update any version of the item
        if (cartItem.item._id === itemId) {
          const newQuantity = cartItem.quantity + change
          return newQuantity > 0 ? { ...cartItem, quantity: newQuantity } : cartItem
        }
      }
      return cartItem
    })
    setCart(updatedCart)
  }

  const calculateTotal = () => {
    return cart.reduce((total, cartItem) => {
      let itemPrice

      if (cartItem.item.customPrice) {
        // Use custom price if available (for items with selected ingredients)
        itemPrice = cartItem.item.customPrice
      } else {
        // Otherwise use regular price
        itemPrice = parsePrice(cartItem.item.price)
      }

      return total + itemPrice * cartItem.quantity
    }, 0)
  }

  const handleCheckout = () => {
    // Save cart to localStorage as a backup
    localStorage.setItem("foodCart", JSON.stringify(cart))

    // Get current user information
    const currentUser = JSON.parse(localStorage.getItem("auth")) || {}

    // Calculate totals
    const subTotal = calculateTotal()
    const tax = subTotal * 0.05 // 5% tax
    const totalAmount = subTotal + tax

    // Create bill object
    const billData = {
      customerName: currentUser.name || "Guest User",
      customerNumber: currentUser.phone || "N/A",
      cartItems: cart.map((item) => ({
        ...item.item,
        quantity: item.quantity,
      })),
      subTotal: subTotal,
      tax: tax,
      totalAmount: totalAmount,
      paymentMode: "Cash", // Default payment mode
    }

    // Save bill to database
    axios
      .post("/api/bills/add-bills", billData)
      .then((response) => {
        console.log("Bill saved successfully")
        // Clear cart
        setCart([])
        // Navigate to payment page or show success message
        alert("Order placed successfully!")
      })
      .catch((error) => {
        console.error("Error saving bill:", error)
        alert("Error placing order. Please try again.")
      })
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowItemModal(false)
      }
    }

    if (showItemModal) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showItemModal])

  return (
    <div className="food-homepage">
      {/* Header */}
      <header className="food-header">
        <div className="header-top">
          <h1 className="page-title">Food & Beverage Menu</h1>

          <button className="cart-button" onClick={() => setShowCart(true)}>
            <ShoppingCart size={18} />
            Cart
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
        </div>
      </header>

      <div className="store-header">
        <h2 className="section-title">Select Your Favorites</h2>

        <div className="search-filter-container">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search menu..."
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
              <h2 className="filters-title">Filter Menu</h2>
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
                      key={category.name}
                      className={`filter-option ${selectedCategory === category.name ? "selected" : ""}`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.displayName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      <div className="items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => {
            const fullImageUrl = getFullImageUrl(item.image)
            const itemPrice = parsePrice(item.price)
            const bPrice = item.Bprice ? parsePrice(item.Bprice) : null
            const sPrice = item.Sprice ? parsePrice(item.Sprice) : null
            const hasIngredients = item.ingredients && item.ingredients.length > 0

            return (
              <motion.div
                key={item._id}
                className="item-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => hasIngredients && openItemModal(item)}
              >
                <div className="item-image-container">
                  <img
                    src={fullImageUrl || "/placeholder.svg"}
                    alt={item.name}
                    className="item-image"
                    onError={(e) => {
                      console.error("Image failed to load:", fullImageUrl)
                      e.target.onerror = null
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image"
                    }}
                  />
                  {hasIngredients && <div className="item-customize-badge">Customizable</div>}
                  <div className="item-actions">
                    <button className="item-action-btn">
                      <Heart size={18} />
                    </button>
                    <button className="item-action-btn">
                      <Share size={18} />
                    </button>
                  </div>
                </div>

                <div className="item-content">
                  <h2 className="item-title">{item.name}</h2>
                  <div className="item-price">${itemPrice.toFixed(2)}</div>
                  <div className="item-details">
                    {bPrice !== null && <div className="item-detail">Bottle: ${bPrice.toFixed(2)}</div>}
                    {sPrice !== null && <div className="item-detail">Shot: ${sPrice.toFixed(2)}</div>}
                    {hasIngredients && <div className="item-detail">{item.ingredients.length} ingredients</div>}
                  </div>
                  {item.description && <p className="item-description">{item.description}</p>}
                  <button
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(item)
                    }}
                  >
                    <ShoppingBag size={18} />
                    {hasIngredients ? "Customize & Add" : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            )
          })
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <img src="/empty-cardboard-box.png" alt="No items found" className="empty-state-image" />
            <h2 className="empty-state-title">No items found</h2>
            <p className="empty-state-text">We couldn't find any items matching your search criteria.</p>
            <button
              className="add-to-cart-btn"
              onClick={() => {
                setSearchQuery("")
              }}
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Item Customization Modal */}
      <AnimatePresence>
        {showItemModal && selectedItem && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="item-modal modern-modal"
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="item-modal-header">
                <h2>{selectedItem.name}</h2>
                <button className="close-modal" onClick={() => setShowItemModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="item-modal-content">
                <div className="item-modal-image-container">
                  <img
                    src={getFullImageUrl(selectedItem.image) || "/placeholder.svg"}
                    alt={selectedItem.name}
                    className="item-modal-image"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image"
                    }}
                  />
                  <div className="item-modal-image-overlay">
                    <div className="item-modal-badge">
                      <Award size={14} />
                      <span>Premium</span>
                    </div>
                    <div className="item-modal-badge">
                      <Clock size={14} />
                      <span>15-20 min</span>
                    </div>
                  </div>
                </div>

                <div className="item-modal-details">
                  <div className="item-modal-price-container">
                    <div className="item-modal-price">
                      <DollarSign size={16} />
                      <span>${parsePrice(selectedItem.price).toFixed(2)}</span>
                    </div>
                    {selectedItem.Bprice && (
                      <div className="item-modal-secondary-price">
                        <span>Bottle: ${parsePrice(selectedItem.Bprice).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {selectedItem.description && (
                    <div className="item-modal-description">
                      <p>{selectedItem.description}</p>
                    </div>
                  )}

                  <div className="item-modal-section">
                    <h3>
                      <ShoppingBasket size={14} />
                      <span>Customize Your Order</span>
                    </h3>
                    <p className="item-modal-section-desc">Select the ingredients you want in your order</p>

                    {selectedIngredients.length > 0 ? (
                      <div className="ingredients-list">
                        {selectedIngredients.map((ingredient, index) => (
                          <div
                            key={index}
                            className={`ingredient-item ${ingredient.selected ? "selected" : ""}`}
                            onClick={() => toggleIngredient(index)}
                          >
                            <div className="ingredient-checkbox">
                              {ingredient.selected && <Check size={12} color="#fff" />}
                            </div>
                            <div className="ingredient-details">
                              <span className="ingredient-name">{ingredient.name}</span>
                              {parsePrice(ingredient.price) > 0 && (
                                <span className="ingredient-price">+${parsePrice(ingredient.price).toFixed(2)}</span>
                              )}
                            </div>
                            <div className="ingredient-action">
                              <ChevronRight size={14} className="ingredient-arrow" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-ingredients">No customization options available</p>
                    )}
                  </div>

                  <div className="item-modal-quantity">
                    <div className="quantity-label">
                      <span>Quantity</span>
                    </div>
                    <div className="quantity-control">
                      <button
                        className="quantity-button"
                        onClick={() => itemQuantity > 1 && setItemQuantity(itemQuantity - 1)}
                        disabled={itemQuantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="quantity-value">{itemQuantity}</span>
                      <button className="quantity-button" onClick={() => setItemQuantity(itemQuantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="item-modal-total">
                    <span>Total Amount</span>
                    <span className="total-price">${calculateItemTotal().toFixed(2)}</span>
                  </div>

                  <button className="add-to-cart-btn" onClick={handleAddCustomizedToCart}>
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    {cart.map((cartItem, index) => {
                      const itemPrice = cartItem.item.customPrice || parsePrice(cartItem.item.price)
                      const hasCustomIngredients =
                        cartItem.item.selectedIngredients && cartItem.item.selectedIngredients.length > 0

                      return (
                        <div key={index} className="cart-item">
                          <img
                            src={getFullImageUrl(cartItem.item.image) || "/placeholder.svg"}
                            alt={cartItem.item.name}
                            className="cart-item-image"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "https://via.placeholder.com/100x100?text=No+Image"
                            }}
                          />
                          <div className="cart-item-details">
                            <h3 className="cart-item-title">{cartItem.item.name}</h3>
                            <div className="cart-item-price">${itemPrice.toFixed(2)}</div>

                            {hasCustomIngredients && (
                              <div className="cart-item-ingredients">
                                {cartItem.item.selectedIngredients.map((ing, idx) => (
                                  <span key={idx} className="cart-ingredient-tag">
                                    {ing.name}
                                    {parsePrice(ing.price) > 0 && ` (+$${parsePrice(ing.price).toFixed(2)})`}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="cart-item-actions">
                              <div className="quantity-control">
                                <button
                                  className="quantity-button"
                                  onClick={() =>
                                    handleUpdateQuantity(cartItem.item._id, -1, cartItem.item.selectedIngredients)
                                  }
                                  disabled={cartItem.quantity <= 1}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="quantity-value">{cartItem.quantity}</span>
                                <button
                                  className="quantity-button"
                                  onClick={() =>
                                    handleUpdateQuantity(cartItem.item._id, 1, cartItem.item.selectedIngredients)
                                  }
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button
                                className="remove-button"
                                onClick={() =>
                                  handleRemoveFromCart(cartItem.item._id, cartItem.item.selectedIngredients)
                                }
                              >
                                <X size={14} />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="cart-empty">
                    <img src="/empty-cardboard-box.png" alt="Empty Cart" className="cart-empty-image" />
                    <h3 className="cart-empty-title">Your cart is empty</h3>
                    <p className="cart-empty-text">Add some items to your cart to get started.</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        setShowCart(false)
                      }}
                    >
                      Browse Menu
                    </button>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="cart-modal-footer">
                  <div className="cart-summary">
                    <span className="cart-total-label">Total:</span>
                    <span className="cart-total-value">${calculateTotal().toFixed(2)}</span>
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

      <style jsx>{`
        /* Global Styles */
        .food-homepage {
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
          background-color: #f8f9fa;
          background-image: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
          min-height: 100vh;
          color: #333;
          padding: 1.5rem;
        }
        
        /* Header Styles */
        .food-header {
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 1.2rem 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border-radius: 16px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
        
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
        
        .store-header {
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 1.2rem 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0;
          color: #333;
          position: relative;
          display: inline-block;
        }

        .section-title:after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 40px;
          height: 3px;
          background-color: #dc143c;
          border-radius: 3px;
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
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }
        
        .search-input {
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background-color: rgba(255, 255, 255, 0.9);
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }
        
        .search-input:focus {
          outline: none;
          border-color: #dc143c;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(220, 20, 60, 0.1);
        }
        
        .filter-button {
          border-radius: 12px;
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
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
        
        /* Items Grid */
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.2rem;
          margin-top: 2rem;
        }
        
        .item-card {
          background-color: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .item-card:hover {
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        
        .item-image-container {
          position: relative;
          height: 160px;
          overflow: hidden;
        }
        
        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .item-card:hover .item-image {
          transform: scale(1.05);
        }
        
        .item-customize-badge {
          position: absolute;
          top: 0.8rem;
          right: 0.8rem;
          background-color: rgba(220, 20, 60, 0.9);
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 600;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .item-actions {
          position: absolute;
          bottom: 0.8rem;
          right: 0.8rem;
          display: flex;
          gap: 0.4rem;
          z-index: 2;
        }
        
        .item-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          border: none;
          color: #666;
        }
        
        .item-action-btn:hover {
          transform: scale(1.1);
          color: #dc143c;
          background-color: white;
        }
        
        .item-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        .item-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .item-price {
          font-size: 1rem;
          font-weight: 700;
          color: #dc143c;
          margin-bottom: 0.4rem;
        }
        
        .item-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.8rem;
        }
        
        .item-detail {
          font-size: 0.75rem;
          color: #666;
          background-color: #f5f5f5;
          padding: 0.2rem 0.5rem;
          border-radius: 50px;
        }
        
        .item-description {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 0.8rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }
        
        .add-to-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background-color: #dc143c;
          border: none;
          color: white;
          padding: 0.6rem 1rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
          margin-top: auto;
        }

        .add-to-cart-btn:hover {
          background-color: #b30000;
          transform: translateY(-2px);
        }
        
        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          grid-column: 1 / -1;
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
        
        /* Item Modal - Modern Styling */
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

        .item-modal {
          background-color: white;
          border-radius: 12px;
          width: 80%;
          max-width: 700px;
          max-height: 85vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modern-modal {
          background-color: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .item-modal-header {
          padding: 0.8rem 1.2rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-modal-header h2 {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
          color: #222;
        }

        .close-modal {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background-color: #f5f5f5;
        }

        .close-modal:hover {
          background-color: #eeeeee;
          color: #dc143c;
        }

        .item-modal-content {
          display: flex;
          flex-direction: row;
          overflow: hidden;
        }

        .item-modal-image-container {
          width: 40%;
          position: relative;
          overflow: hidden;
        }

        .item-modal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-modal-image-overlay {
          position: absolute;
          bottom: 0.6rem;
          left: 0.6rem;
          display: flex;
          gap: 0.5rem;
        }

        .item-modal-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.3rem 0.5rem;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .item-modal-details {
          width: 60%;
          padding: 1rem 1.2rem;
          overflow-y: auto;
          max-height: 65vh;
        }

        .item-modal-price-container {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.8rem;
        }

        .item-modal-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: #dc143c;
          display: flex;
          align-items: center;
        }

        .item-modal-secondary-price {
          font-size: 0.8rem;
          color: #666;
          background-color: #f5f5f5;
          padding: 0.3rem 0.5rem;
          border-radius: 50px;
        }

        .item-modal-description {
          margin-bottom: 1rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .item-modal-description p {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.4;
          margin: 0;
        }

        .item-modal-section {
          margin-bottom: 1rem;
        }

        .item-modal-section h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.3rem;
          color: #333;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .item-modal-section-desc {
          font-size: 0.75rem;
          color: #888;
          margin-bottom: 0.8rem;
        }

        .ingredients-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ingredient-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.6rem 0.8rem;
          border-radius: 8px;
          background-color: #f9f9f9;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .ingredient-item:hover {
          background-color: #f0f0f0;
        }

        .ingredient-item.selected {
          background-color: rgba(220, 20, 60, 0.05);
          border: 1px solid rgba(220, 20, 60, 0.2);
        }

        .ingredient-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .ingredient-item.selected .ingredient-checkbox {
          border-color: #dc143c;
          background-color: #dc143c;
        }

        .ingredient-details {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ingredient-name {
          font-weight: 500;
          font-size: 0.85rem;
          color: #333;
        }

        .ingredient-price {
          font-size: 0.8rem;
          color: #dc143c;
          font-weight: 600;
        }

        .ingredient-action {
          opacity: 0;
          transition: all 0.2s ease;
        }

        .ingredient-item:hover .ingredient-action {
          opacity: 1;
        }

        .ingredient-arrow {
          color: #888;
        }

        .ingredient-item.selected .ingredient-arrow {
          color: #dc143c;
        }

        .no-ingredients {
          text-align: center;
          color: #999;
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          font-size: 0.8rem;
        }

        .item-modal-quantity {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.8rem 0;
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
        }

        .quantity-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #333;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: #f5f5f5;
          padding: 0.3rem;
          border-radius: 50px;
        }

        .quantity-button {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #333;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .quantity-button:hover {
          background-color: #dc143c;
          color: white;
        }

        .quantity-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #f0f0f0;
          color: #999;
        }

        .quantity-value {
          font-weight: 600;
          font-size: 0.9rem;
          min-width: 24px;
          text-align: center;
          color: #333;
        }

        .item-modal-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #333;
        }

        .total-price {
          color: #dc143c;
          font-size: 1.3rem;
          font-weight: 700;
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
        
        .cart-item-ingredients {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .cart-ingredient-tag {
          font-size: 0.8rem;
          color: #666;
          background-color: #f5f5f5;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
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
        
        /* Success Animation */
        .success-animation {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: 2000;
          animation: slideIn 0.5s ease forwards;
        }
        
        .success-icon {
          width: 40px;
          height: 40px;
          background-color: #4CAF50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .success-text {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
        }
        
        .fade-out {
          animation: fadeOut 0.5s ease forwards;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
          .items-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
          
          .item-modal-content {
            flex-direction: column;
          }
          
          .item-modal-image-container,
          .item-modal-details {
            width: 100%;
          }
          
          .item-modal-image-container {
            height: 250px;
          }
        }
        
        @media (max-width: 768px) {
          .food-header {
            padding: 1rem;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
          
          .food-homepage {
            padding: 1rem;
          }
          
          .items-grid {
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
          
          .items-grid {
            grid-template-columns: 1fr;
          }
          
          .filter-groups {
            flex-direction: column;
            gap: 1rem;
          }
        }

        /* Modern UI Enhancements */

        /* Enhanced animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.5s ease forwards;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default Homepage
