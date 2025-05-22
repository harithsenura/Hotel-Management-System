import api from "./api"

// Enhanced getUser function with better error handling and data validation
export const getUser = () => {
  try {
    const userData = localStorage.getItem("user")

    if (!userData) {
      console.log("No user data found in localStorage")
      return null
    }

    const user = JSON.parse(userData)

    // Validate that the parsed user object has the required fields
    if (!user || typeof user !== "object") {
      console.error("Invalid user data format in localStorage")
      return null
    }

    // Check if user has _id or id property
    if (!user._id && !user.id) {
      console.error("User object missing _id and id properties:", user)
      return null
    }

    return user
  } catch (error) {
    console.error("Error retrieving user from localStorage:", error)
    // Clear corrupted data
    localStorage.removeItem("user")
    return null
  }
}

export const login = async (email, password) => {
  try {
    const response = await api.post(`/api/users/login`, { email, password })

    // Validate the response data
    const data = response.data
    if (!data || (!data.id && !data._id)) {
      console.error("Invalid response from login API:", data)
      throw new Error("Invalid response from server")
    }

    // Store the user data in localStorage
    localStorage.setItem("user", JSON.stringify(data))
    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const register = async (registerData) => {
  try {
    const response = await api.post(`/api/users/register`, registerData)

    // Validate the response data
    const data = response.data
    if (!data || (!data.id && !data._id)) {
      console.error("Invalid response from register API:", data)
      throw new Error("Invalid response from server")
    }

    localStorage.setItem("user", JSON.stringify(data))
    return data
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem("user")
}

export const updateProfile = async (user) => {
  try {
    const response = await api.put(`/api/users/updateProfile`, user)

    // Validate the response data
    const data = response.data
    if (!data || (!data.id && !data._id)) {
      console.error("Invalid response from updateProfile API:", data)
      throw new Error("Invalid response from server")
    }

    localStorage.setItem("user", JSON.stringify(data))
    return data
  } catch (error) {
    console.error("Update profile error:", error)
    throw error
  }
}

export const changePassword = async (passwords) => {
  try {
    await api.put(`/api/users/changePassword`, passwords)
  } catch (error) {
    console.error("Change password error:", error)
    throw error
  }
}

// New function to check if user data is valid
export const isValidUserData = () => {
  try {
    const user = getUser()
    return user && (user.id || user._id) ? true : false
  } catch (error) {
    return false
  }
}

// New function to refresh user data from server
export const refreshUserData = async () => {
  try {
    const user = getUser()
    if (!user || (!user.id && !user._id)) return null

    const userId = user.id || user._id
    const response = await api.get(`/api/users/${userId}`)

    const data = response.data
    if (data && (data.id || data._id)) {
      localStorage.setItem("user", JSON.stringify(data))
      return data
    }
    return null
  } catch (error) {
    console.error("Error refreshing user data:", error)
    return null
  }
}
