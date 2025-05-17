import axios from "axios"

// Set the base URL for all axios requests
axios.defaults.baseURL =
  process.env.NODE_ENV === "production" ? "https://itpm-backend-production.up.railway.app" : "http://localhost:5001"

// Add withCredentials to allow cookies to be sent
axios.defaults.withCredentials = true

// Add request interceptor to include credentials
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axios
