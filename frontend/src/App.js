"use client"

import { useLocation } from "react-router-dom"
import AppRoutes from "./AppRoutes"
import Header from "./components/Header/Header"
import Loading from "./components/Loading/Loading"
import { useLoading } from "./hooks/useLoading"
import { setLoadingInterceptor } from "./interceptors/loadingInterceptors"
import { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getUser } from "./services/userService"
import axios from "axios"

function App() {
  const { showLoading, hideLoading } = useLoading()
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading })

    // Set up axios interceptor for authentication
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const user = getUser()
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`
        }

        // Add cache-busting parameter to all GET requests
        if (config.method === "get") {
          config.params = {
            ...config.params,
            t: new Date().getTime(),
          }
        }

        // Add CORS headers
        config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        config.headers["Pragma"] = "no-cache"
        config.headers["Expires"] = "0"

        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Load user from localStorage
    const storedUser = getUser()
    setUser(storedUser)

    // Log the user to console for debugging
    console.log("Current user from localStorage:", storedUser)

    return () => {
      // Clean up interceptor when component unmounts
      axios.interceptors.request.eject(interceptor)
    }
  }, [showLoading, hideLoading])

  // Determine if we should show the header
  const shouldShowHeader = !location.pathname.includes("/login") && !location.pathname.includes("/register")

  return (
    <>
      <ToastContainer />
      <Loading />
      
      <AppRoutes />
    </>
  )
}

export default App
