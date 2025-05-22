"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import api from "../services/api" // Import the custom axios instance
import { toast } from "react-toastify"

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const returnUrl = location.state?.returnUrl || "/"

  useEffect(() => {
    // Check if user is already logged in
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user && (user.id || user._id)) {
          navigate(returnUrl)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
      }
    }
  }, [navigate, returnUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Use the api instance instead of axios directly
      const response = await api.post(`/api/users/login`, { email, password })

      // Check if response has data
      if (!response || !response.data) {
        throw new Error("Empty response from server")
      }

      // Validate the user data
      const userData = response.data
      if (!userData || (!userData.id && !userData._id)) {
        console.error("Invalid user data received:", userData)
        throw new Error("Invalid user data received from server")
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      // Show success message
      toast.success("Login successful!")

      // Navigate to return URL or home
      navigate(returnUrl)
    } catch (err) {
      console.error("Login error:", err)

      // Handle different types of errors
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        const serverError = err.response.data || "Server error"
        setError(typeof serverError === "string" ? serverError : "Invalid credentials")
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection.")
      } else {
        // Something else happened while setting up the request
        setError(err.message || "An error occurred during login")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="register-link">
          <span>New user?</span> <Link to="/register">Register here</Link>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 20px;
        }
        
        .login-form-container {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          padding: 30px;
          width: 100%;
          max-width: 400px;
        }
        
        .login-title {
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
        }
        
        .error-message {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #555;
        }
        
        .form-input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          background-color: #f9fafb;
          transition: border-color 0.3s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
        }
        
        .login-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 10px;
        }
        
        .login-button:hover {
          background-color: #3d8b40;
        }
        
        .login-button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }
        
        .register-link {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }
        
        .register-link a {
          color: #dc143c;
          text-decoration: none;
          font-weight: 600;
        }
        
        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

export default LoginPage
