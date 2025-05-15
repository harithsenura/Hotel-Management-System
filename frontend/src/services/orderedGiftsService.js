// Service to track which gifts have already been ordered

// Store ordered gift IDs in localStorage
const ORDERED_GIFTS_KEY = "ordered_gifts"

// Get all ordered gift IDs
export const getOrderedGifts = () => {
  try {
    const orderedGifts = localStorage.getItem(ORDERED_GIFTS_KEY)
    return orderedGifts ? JSON.parse(orderedGifts) : []
  } catch (error) {
    console.error("Error getting ordered gifts:", error)
    return []
  }
}

// Add a gift to the ordered gifts list
export const addOrderedGift = (giftId) => {
  try {
    const orderedGifts = getOrderedGifts()
    if (!orderedGifts.includes(giftId.toString())) {
      orderedGifts.push(giftId.toString())
      localStorage.setItem(ORDERED_GIFTS_KEY, JSON.stringify(orderedGifts))
    }
  } catch (error) {
    console.error("Error adding ordered gift:", error)
  }
}

// Check if a gift has already been ordered
export const isGiftOrdered = (giftId) => {
  try {
    const orderedGifts = getOrderedGifts()
    return orderedGifts.includes(giftId.toString())
  } catch (error) {
    console.error("Error checking if gift is ordered:", error)
    return false
  }
}

// Clear all ordered gifts (for testing purposes)
export const clearOrderedGifts = () => {
  localStorage.removeItem(ORDERED_GIFTS_KEY)
}
