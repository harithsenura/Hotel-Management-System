"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isFocusedUsername, setIsFocusedUsername] = useState(false)
  const [isFocusedPassword, setIsFocusedPassword] = useState(false)
  const [isHoveredButton, setIsHoveredButton] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Example validation logic
    if (username === "eventadmin" && password === "1234") {
      navigate("/eventdashboard") // Navigate to dashboard after successful login
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>EM</div>
        </div>
        <h2 style={styles.title}>Event Admin Login</h2>
        <p style={styles.subtitle}>Please log in to your system</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>👤</div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocusedUsername(true)}
                onBlur={() => setIsFocusedUsername(false)}
                style={{
                  ...styles.input,
                  ...(isFocusedUsername ? styles.inputFocus : {}),
                }}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>🔒</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
                style={{
                  ...styles.input,
                  ...(isFocusedPassword ? styles.inputFocus : {}),
                }}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isHoveredButton ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setIsHoveredButton(true)}
            onMouseLeave={() => setIsHoveredButton(false)}
          >
            Login
          </button>
        </form>
        <div style={styles.footer}>
          <p style={styles.footerText}>© 2023 Event Management System</p>
        </div>
      </div>
    </div>
  )
}

// Updated inline styles for a modern 2.5D look
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e4f1f9 100%)",
    fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08), 0 10px 20px rgba(0, 0, 0, 0.05)",
    width: "400px",
    textAlign: "center",
    position: "relative",
    transform: "perspective(1000px) rotateX(0deg)",
    transition: "transform 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.8)",
  },
  logoContainer: {
    position: "absolute",
    top: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#0070f3",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
    boxShadow: "0 8px 16px rgba(0, 112, 243, 0.2)",
    border: "4px solid white",
  },
  title: {
    fontSize: "26px",
    marginTop: "30px",
    marginBottom: "10px",
    color: "#1f2937",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    fontSize: "14px",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#4b5563",
    display: "block",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    fontSize: "16px",
    color: "#9ca3af",
  },
  input: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "#f9fafb",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
  },
  inputFocus: {
    borderColor: "#0070f3",
    boxShadow: "0 0 0 3px rgba(0, 112, 243, 0.15)",
    backgroundColor: "#ffffff",
    transform: "translateY(-2px)",
  },
  button: {
    padding: "14px",
    background: "linear-gradient(135deg, #0070f3 0%, #00a3ff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    marginTop: "10px",
    boxShadow: "0 4px 12px rgba(0, 112, 243, 0.2), 0 2px 4px rgba(0, 112, 243, 0.1)",
    position: "relative",
    overflow: "hidden",
  },
  buttonHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 16px rgba(0, 112, 243, 0.25), 0 4px 8px rgba(0, 112, 243, 0.15)",
    background: "linear-gradient(135deg, #0060df 0%, #0095eb 100%)",
  },
  error: {
    color: "#ef4444",
    marginBottom: "20px",
    fontSize: "14px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#fee2e2",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
  },
  footer: {
    marginTop: "30px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "20px",
  },
  footerText: {
    fontSize: "12px",
    color: "#9ca3af",
  },
}

export default Login

