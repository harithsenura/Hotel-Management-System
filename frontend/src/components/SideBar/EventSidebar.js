"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import logo from "../../images/company.png"

function SideBar() {
  // State for responsive sidebar
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Check window size on mount and resize
  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkWindowSize()

    // Add event listener
    window.addEventListener("resize", checkWindowSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkWindowSize)
  }, [])

  // Toggle mobile sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Modern hover style with blue
  const hoverStyle = {
    backgroundColor: "#0066FF", // More vibrant blue for hover
    color: "#fff",
    transform: "translateX(8px)",
    boxShadow: "0 4px 12px rgba(0, 102, 255, 0.2)",
  }

  // Modern default style with white background - reduced width
  const defaultStyle = {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    marginBottom: "10px",
    backgroundColor: "#ffffff", // White background
    borderRadius: "10px",
    color: "#4b5563", // Modern gray text
    textDecoration: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother animation
    border: "1px solid #f3f4f6",
    fontWeight: "500",
    position: "relative", // For animations
    overflow: "hidden", // For animations
    width: "85%", // Reduced width
    marginLeft: "auto",
    marginRight: "auto",
  }

  // Active style with deeper blue
  const activeStyle = {
    ...defaultStyle,
    backgroundColor: "#0066FF", // Vibrant blue for active
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0, 102, 255, 0.2)",
  }

  // Red-themed link style (for Add operations)
  const redLinkStyle = {
    ...defaultStyle,
    color: "#4b5563",
  }

  // Red hover style
  const redHoverStyle = {
    backgroundColor: "#FF3366", // Vibrant red
    color: "#fff",
    transform: "translateX(8px)",
    boxShadow: "0 4px 12px rgba(255, 51, 102, 0.2)",
  }

  // Logo style
  const logoStyle = {
    color: "#fff",
    textAlign: "center",
    lineHeight: "1.5",
    margin: "20px auto",
    fontSize: "1.5em",
    padding: "10px 0",
  }

  // Modern white title bar style
  const titleBarStyle = {
    backgroundColor: "#ffffff", // White background
    padding: "16px 24px",
    margin: 0,
    width: isMobile ? "100%" : "calc(100% - 250px)",
    position: "fixed",
    top: 0,
    left: isMobile ? 0 : "250px",
    boxSizing: "border-box",
    color: "#1f2937", // Dark text for contrast
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    borderRadius: "0 0 12px 12px",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  // Title text style
  const titleTextStyle = {
    margin: 0,
    padding: 0,
    fontSize: isMobile ? "18px" : "20px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    color: "#0066FF", // Vibrant blue text
  }

  // Dashboard icon style
  const dashboardIconStyle = {
    marginRight: "12px",
    fontSize: "20px",
  }

  // User info container style
  const userInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #f3f4f6",
    borderRadius: "50px",
    padding: "4px 12px 4px 4px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  }

  // User avatar style
  const userAvatarStyle = {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#e6f0ff", // Light blue background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0066FF", // Vibrant blue text
    boxShadow: "0 2px 4px rgba(0, 102, 255, 0.1)",
    border: "2px solid #CCE0FF",
    position: "relative", // For pulse animation
  }

  // Pulse effect for avatar (green status)
  const pulseStyle = {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#00CC66", // Vibrant green
    border: "2px solid white",
    animation: "pulse 1.5s infinite", // Added animation
  }

  // User name style
  const userNameStyle = {
    fontWeight: "500",
    fontSize: "14px",
    color: "#1f2937", // Dark text
  }

  // Content style
  const contentStyle = {
    marginTop: "70px",
    padding: "20px",
  }

  // Logout button style with green
  const logoutStyle = {
    ...defaultStyle,
    backgroundColor: "#e6fff0", // Light green background
    color: "#00CC66", // Vibrant green text
    fontWeight: "500",
    border: "1px solid #e6f6ee",
    marginTop: "16px",
  }

  // Logout hover style
  const logoutHoverStyle = {
    backgroundColor: "#00CC66", // Vibrant green for hover
    color: "#ffffff",
    transform: "translateX(8px)",
    boxShadow: "0 4px 12px rgba(0, 204, 102, 0.2)",
  }

  // Icon style
  const iconStyle = {
    marginRight: "12px",
    fontSize: "16px",
    display: "inline-block",
    width: "38px",
    height: "38px",
    textAlign: "center",
    lineHeight: "38px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  }

  // Blue icon style
  const blueIconStyle = {
    ...iconStyle,
    backgroundColor: "#e6f0ff", // Light blue background
    color: "#0066FF", // Vibrant blue
  }

  // Red icon style
  const redIconStyle = {
    ...iconStyle,
    backgroundColor: "#ffe6e6", // Light red background
    color: "#FF3366", // Vibrant red
  }

  // Green icon style
  const greenIconStyle = {
    ...iconStyle,
    backgroundColor: "rgba(0, 204, 102, 0.15)", // Light green background
    color: "#00CC66", // Vibrant green
  }

  // Status indicator style
  const statusIndicatorStyle = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#00CC66", // Vibrant green for online status
    marginLeft: "8px",
    animation: "pulse 1.5s infinite", // Added animation
  }

  // Date time style
  const dateTimeStyle = {
    fontSize: "12px",
    opacity: "0.7",
    marginTop: "4px",
    color: "#6b7280", // Medium gray text
  }

  // Mobile menu button style
  const mobileMenuButtonStyle = {
    display: isMobile ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "#f9fafb", // Light gray background
    color: "#4b5563", // Gray text
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    marginRight: "12px",
    transition: "all 0.2s ease",
  }

  // Mobile menu button hover style
  const mobileMenuButtonHoverStyle = {
    backgroundColor: "#f3f4f6", // Slightly darker gray on hover
    transform: "scale(1.05)",
  }

  // Overlay style for mobile
  const overlayStyle = {
    display: isMobile && isSidebarOpen ? "block" : "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(2px)",
    zIndex: 150,
    transition: "all 0.3s ease",
  }

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date()
    return now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Sidebar container style
  const sidebarContainerStyle = {
    width: "250px",
    height: "100vh",
    backgroundColor: "#ffffff", // White background
    padding: "12px",
    position: "fixed",
    top: 0,
    left: isMobile ? (isSidebarOpen ? 0 : "-100%") : 0,
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
    borderRight: "1px solid #f3f4f6",
    zIndex: 200,
    overflowY: "auto",
    transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother transition
  }

  // Navigation list style
  const navListStyle = {
    listStyleType: "none",
    padding: "8px 0 0 0",
    margin: 0,
  }

  // Logo image style
  const logoImageStyle = {
    width: "120px",
    height: "auto",
    padding: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f3f4f6",
    transition: "transform 0.3s ease",
  }

  // Separator style
  const separatorStyle = {
    height: "1px",
    backgroundColor: "#f3f4f6",
    margin: "20px 0",
    position: "relative",
  }

  // Separator accent
  const separatorAccentStyle = {
    position: "absolute",
    top: "-1px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "50px",
    height: "3px",
    backgroundColor: "#0066FF",
    borderRadius: "3px",
  }

  // Enhanced animation keyframes
  const keyframes = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0px); }
    }
    @keyframes glow {
      0% { box-shadow: 0 0 5px rgba(0, 102, 255, 0.5); }
      50% { box-shadow: 0 0 20px rgba(0, 102, 255, 0.8); }
      100% { box-shadow: 0 0 5px rgba(0, 102, 255, 0.5); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `

  // Enhanced nav item styles with animations
  const navItemStyle = (index) => ({
    animation: "fadeIn 0.5s ease forwards",
    animationDelay: `${0.1 * (index + 1)}s`,
    opacity: 0,
  })

  // Active indicator bar style
  const activeIndicatorStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "4px",
    backgroundColor: "#ffffff",
    animation: "slideIn 0.4s ease-out forwards",
  }

  // Chevron icon style
  const chevronStyle = {
    marginLeft: "auto",
    fontSize: "16px",
    transition: "transform 0.3s ease",
  }

  return (
    <div>
      {/* Add enhanced keyframes for animations */}
      <style>{keyframes}</style>

      {/* Overlay for mobile */}
      <div style={overlayStyle} onClick={toggleSidebar} />

      {/* Sidebar */}
      <div style={sidebarContainerStyle}>
        <div style={{ ...logoStyle, animation: "float 3s ease-in-out infinite" }}>
          <a
            href="/adminpannel"
            style={{ textDecoration: "none" }}
            onMouseOver={(e) => {
              e.currentTarget.querySelector(".logo-img").style.transform = "scale(1.05)"
              e.currentTarget.querySelector(".logo-img").style.boxShadow = "0 8px 20px rgba(0, 102, 255, 0.15)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.querySelector(".logo-img").style.transform = "scale(1)"
              e.currentTarget.querySelector(".logo-img").style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)"
            }}
          >
            <img src={logo || "/placeholder.svg"} alt="Company Logo" style={logoImageStyle} className="logo-img" />
          </a>
        </div>
        <ul style={navListStyle}>
          <li style={navItemStyle(0)}>
            <Link
              to="/eventdashboard"
              style={{ ...activeStyle, position: "relative" }} // Changed to active style
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, { ...activeStyle, transform: "translateX(5px)" })
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, activeStyle)
              }}
              onClick={() => isMobile && toggleSidebar()}
            >
              {/* Active indicator bar with animation */}
              <div style={activeIndicatorStyle}></div>
              <span
                style={{ ...blueIconStyle, backgroundColor: "rgba(255, 255, 255, 0.2)", color: "#ffffff" }}
                className="icon"
              >
                📊
              </span>
              Dashboard
              <span className="chevron" style={{ ...chevronStyle, color: "#ffffff" }}>
                ›
              </span>
            </Link>
          </li>
          <li style={navItemStyle(1)}>
            <Link
              to="/events"
              style={defaultStyle} // Changed to default style
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                e.currentTarget.querySelector(".icon").style.color = "#ffffff"
                e.currentTarget.querySelector(".chevron").style.opacity = "1"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(0)"
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "#e6f0ff"
                e.currentTarget.querySelector(".icon").style.color = "#0066FF"
                e.currentTarget.querySelector(".chevron").style.opacity = "0"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(-10px)"
              }}
              onClick={() => isMobile && toggleSidebar()}
            >
              <span style={blueIconStyle} className="icon">
                📅
              </span>
              All Events
              <span className="chevron" style={{ ...chevronStyle, opacity: 0, transform: "translateX(-10px)" }}>
                ›
              </span>
            </Link>
          </li>
          <li style={navItemStyle(2)}>
            <Link
              to="/events/add"
              style={redLinkStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, redHoverStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                e.currentTarget.querySelector(".icon").style.color = "#ffffff"
                e.currentTarget.querySelector(".chevron").style.opacity = "1"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(0)"
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, redLinkStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "#ffe6e6"
                e.currentTarget.querySelector(".icon").style.color = "#FF3366"
                e.currentTarget.querySelector(".chevron").style.opacity = "0"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(-10px)"
              }}
              onClick={() => isMobile && toggleSidebar()}
            >
              <span style={redIconStyle} className="icon">
                ➕
              </span>
              Add Event
              <span className="chevron" style={{ ...chevronStyle, opacity: 0, transform: "translateX(-10px)" }}>
                ›
              </span>
            </Link>
          </li>
          <li style={navItemStyle(3)}>
            <Link
              to="/eventplanner/add"
              style={redLinkStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, redHoverStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                e.currentTarget.querySelector(".icon").style.color = "#ffffff"
                e.currentTarget.querySelector(".chevron").style.opacity = "1"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(0)"
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, redLinkStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "#ffe6e6"
                e.currentTarget.querySelector(".icon").style.color = "#FF3366"
                e.currentTarget.querySelector(".chevron").style.opacity = "0"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(-10px)"
              }}
              onClick={() => isMobile && toggleSidebar()}
            >
              <span style={redIconStyle} className="icon">
                👤
              </span>
              Add Event Planner
              <span className="chevron" style={{ ...chevronStyle, opacity: 0, transform: "translateX(-10px)" }}>
                ›
              </span>
            </Link>
          </li>
          <li style={navItemStyle(4)}>
            <Link
              to="/eventplanners"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                e.currentTarget.querySelector(".icon").style.color = "#ffffff"
                e.currentTarget.querySelector(".chevron").style.opacity = "1"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(0)"
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "#e6f0ff"
                e.currentTarget.querySelector(".icon").style.color = "#0066FF"
                e.currentTarget.querySelector(".chevron").style.opacity = "0"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(-10px)"
              }}
              onClick={() => isMobile && toggleSidebar()}
            >
              <span style={blueIconStyle} className="icon">
                👥
              </span>
              All Event Planners
              <span className="chevron" style={{ ...chevronStyle, opacity: 0, transform: "translateX(-10px)" }}>
                ›
              </span>
            </Link>
          </li>

          {/* Separator with accent */}
          <li style={{ padding: "10px 0" }}>
            <div style={separatorStyle}>
              <div style={{ ...separatorAccentStyle, animation: "glow 2s infinite" }}></div>
            </div>
          </li>

          <li style={navItemStyle(5)}>
            <Link
              to="/adminpannel"
              style={logoutStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, logoutHoverStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                e.currentTarget.querySelector(".icon").style.color = "#ffffff"
                e.currentTarget.querySelector(".icon").style.transform = "rotate(20deg)"
                e.currentTarget.querySelector(".chevron").style.opacity = "1"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(0)"
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, logoutStyle)
                e.currentTarget.querySelector(".icon").style.backgroundColor = "rgba(0, 204, 102, 0.15)"
                e.currentTarget.querySelector(".icon").style.color = "#00CC66"
                e.currentTarget.querySelector(".icon").style.transform = "rotate(0deg)"
                e.currentTarget.querySelector(".chevron").style.opacity = "0"
                e.currentTarget.querySelector(".chevron").style.transform = "translateX(-10px)"
              }}
              onClick={() => isMobile && toggleSidebar()}
            >
              <span style={greenIconStyle} className="icon">
                🚪
              </span>
              Log Out
              <span className="chevron" style={{ ...chevronStyle, opacity: 0, transform: "translateX(-10px)" }}>
                ›
              </span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Modern White Header Title Bar */}
      <div style={titleBarStyle}>
        {isMobile && (
          <button
            style={mobileMenuButtonStyle}
            onMouseOver={(e) => {
              Object.assign(e.currentTarget.style, {
                ...mobileMenuButtonStyle,
                ...mobileMenuButtonHoverStyle,
              })
            }}
            onMouseOut={(e) => {
              Object.assign(e.currentTarget.style, mobileMenuButtonStyle)
            }}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? "✕" : "☰"}
          </button>
        )}

        <div>
          <h1 style={{ ...titleTextStyle, animation: "fadeIn 0.5s ease-out" }}>
            <span style={{ ...dashboardIconStyle, animation: "bounce 2s infinite" }}>🏢</span>
            Welcome to Admin Panel
          </h1>
          <div style={dateTimeStyle}>{getCurrentDateTime()}</div>
        </div>

        {!isMobile && (
          <div style={{ ...userInfoStyle, animation: "fadeIn 0.5s ease-out" }}>
            <div style={userAvatarStyle}>
              A<div style={pulseStyle}></div>
            </div>
            <div>
              <div style={userNameStyle}>
                Admin User
                <span style={statusIndicatorStyle}></span>
              </div>
              <div style={dateTimeStyle}>Administrator</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SideBar

