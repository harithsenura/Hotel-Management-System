import axios from "axios"

// Set the base URL for all axios requests
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://itpm-backend-production.up.railway.app" : "http://localhost:5001"

// Create a custom axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include credentials and handle tokens
api.interceptors.request.use(
  (config) => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Add cache-busting parameter to all GET requests
    if (config.method === "get") {
      config.params = {
        ...config.params,
        t: new Date().getTime(),
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)
    return Promise.reject(error)
  },
)

export default api
