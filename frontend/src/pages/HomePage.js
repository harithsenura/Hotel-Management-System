"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import image1 from "../images/view1.jpg"
import image3 from "../images/view3.jpg"
import image4 from "../images/view4.jpg"
import image5 from "../images/image5.jpg"
import instalogo from "../images/i.png"
import fblogo from "../images/f.png"
import twitterlogo from "../images/t.png"
import companylogo from "../images/company.png"
import headingImage from "../images/view2.jpg"

const HomePage = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isLoading, setIsLoading] = useState(true)

  // Handle scroll events for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const handleOrderClick = () => {
    navigate("/login")
  }

  const handleLoginClick = () => {
    setShowModal(true)
  }

  const handleAdminLogin = () => {
    navigate("/adminpannel")
  }

  const handleCustomerLogin = () => {
    navigate("/login")
  }

  // Animation for cards on hover
  const handleCardHover = (e, isHovering) => {
    const card = e.currentTarget
    const image = card.querySelector(".card-image")
    const content = card.querySelector(".card-content")

    if (isHovering) {
      card.style.transform = "translateY(-10px)"
      image.style.transform = "scale(1.1)"
      content.style.backgroundColor = "#f8f9fa"
    } else {
      card.style.transform = "translateY(0)"
      image.style.transform = "scale(1.0)"
      content.style.backgroundColor = "#ffffff"
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <div className="loading-text">Welcome to Cinnamon Red</div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <style jsx>{`
        /* CSS Reset and Global Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          overflow-x: hidden;
        }
        
        /* Loading Screen */
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ffffff, #f0f0f0);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        
        .spinner {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(220, 20, 60, 0.2);
          border-radius: 50%;
          border-top-color: #dc143c;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 20px;
        }
        
        .loading-text {
          font-size: 24px;
          font-weight: 600;
          color: #dc143c;
          letter-spacing: 1px;
          animation: pulse 1.5s infinite;
        }
        
        /* Animations */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes zoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        /* Container */
        .home-container {
          width: 100%;
          overflow-x: hidden;
        }
        
        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled {
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          padding: 15px 40px;
        }
        
        .logo {
          height: 50px;
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled .logo {
          height: 40px;
        }
        
        .nav-links {
          display: flex;
          gap: 30px;
        }
        
        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled .nav-link {
          color: #333333;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #dc143c;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
        
        .login-btn {
          background-color: #dc143c;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
        }
        
        .login-btn:hover {
          background-color: #b30000;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(220, 20, 60, 0.4);
        }
        
        /* Hero Section */
        .hero {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: zoomIn 1.5s ease-out;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 20px;
        }
        
        .hero-title {
          color: white;
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 20px;
          animation: fadeIn 1s ease-out 0.5s both;
        }
        
        .hero-subtitle {
          color: white;
          font-size: 1.5rem;
          font-weight: 400;
          max-width: 700px;
          margin-bottom: 30px;
          animation: fadeIn 1s ease-out 0.8s both;
        }
        
        .hero-btn {
          background-color: #dc143c;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeIn 1s ease-out 1.1s both;
          box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
        }
        
        .hero-btn:hover {
          background-color: #b30000;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(220, 20, 60, 0.4);
        }
        
        /* Food Order Section */
        .food-order {
          padding: 100px 20px;
          text-align: center;
          background-color: #ffffff;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #333333;
          position: relative;
          display: inline-block;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background-color: #dc143c;
        }
        
        .section-text {
          font-size: 1.1rem;
          color: #666666;
          max-width: 800px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }
        
        .order-btn {
          background-color: #008000;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 128, 0, 0.3);
        }
        
        .order-btn:hover {
          background-color: #006400;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 128, 0, 0.4);
        }
        
        /* Features Section */
        .features {
          padding: 100px 20px;
          background-color: #f8f9fa;
        }
        
        .features-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 60px;
          color: #333333;
          position: relative;
          display: inline-block;
        }
        
        .features-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background-color: #dc143c;
        }
        
        .features-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-card {
          background-color: #ffffff;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .card-image-container {
          height: 200px;
          overflow: hidden;
        }
        
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .card-content {
          padding: 25px;
          transition: background-color 0.3s ease;
        }
        
        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333333;
        }
        
        .card-text {
          font-size: 1rem;
          color: #666666;
          line-height: 1.6;
        }
        
        /* Footer */
        .footer {
          background-color: #1a1a1a;
          color: #ffffff;
          padding: 60px 20px 30px;
        }
        
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
        }
        
        .footer-logo {
          width: 150px;
          margin-bottom: 20px;
        }
        
        .footer-about {
          margin-bottom: 20px;
        }
        
        .footer-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
        }
        
        .footer-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 2px;
          background-color: #dc143c;
        }
        
        .footer-links {
          list-style: none;
        }
        
        .footer-link {
          margin-bottom: 12px;
        }
        
        .footer-link a {
          color: #cccccc;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .footer-link a:hover {
          color: #dc143c;
        }
        
        .social-icons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }
        
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #333333;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          background-color: #dc143c;
          transform: translateY(-5px);
        }
        
        .social-icon img {
          width: 20px;
          height: 20px;
        }
        
        .footer-bottom {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #333333;
          text-align: center;
          color: #999999;
          font-size: 0.9rem;
        }
        
        /* Modal */
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
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }
        
        .modal-container {
          background-color: #ffffff;
          border-radius: 15px;
          padding: 40px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
          text-align: center;
          animation: zoomIn 0.5s ease;
        }
        
        .modal-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 30px;
          color: #333333;
        }
        
        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .modal-btn {
          padding: 15px 20px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .admin-btn {
          background-color: #0066ff;
          color: white;
        }
        
        .admin-btn:hover {
          background-color: #0052cc;
        }
        
        .customer-btn {
          background-color: #dc143c;
          color: white;
        }
        
        .customer-btn:hover {
          background-color: #b30000;
        }
        
        .close-btn {
          background-color: #333333;
          color: white;
        }
        
        .close-btn:hover {
          background-color: #1a1a1a;
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 768px) {
          .navbar {
            padding: 15px 20px;
          }
          
          .navbar.scrolled {
            padding: 10px 20px;
          }
          
          .nav-links {
            display: none;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .hero-btn {
            padding: 12px 30px;
            font-size: 1rem;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
          
          .section-text {
            font-size: 1rem;
          }
          
          .order-btn {
            padding: 12px 30px;
            font-size: 1rem;
          }
          
          .features-container {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
          
          .modal-container {
            padding: 30px;
          }
        }
        
        @media (max-width: 480px) {
          .logo {
            height: 40px;
          }
          
          .navbar.scrolled .logo {
            height: 35px;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 0.9rem;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
          
          .footer-container {
            grid-template-columns: 1fr;
          }
          
          .modal-container {
            padding: 20px;
          }
          
          .modal-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <img src={companylogo || "/placeholder.svg"} alt="Cinnamon Red Hotel" className="logo" />

        <div className="nav-links">
          <a href="#home" className={`nav-link ${activeSection === "home" ? "active" : ""}`}>
            Home
          </a>
          <a href="#food" className={`nav-link ${activeSection === "food" ? "active" : ""}`}>
            Food
          </a>
          <a href="#features" className={`nav-link ${activeSection === "features" ? "active" : ""}`}>
            Features
          </a>
          <a href="#contact" className={`nav-link ${activeSection === "contact" ? "active" : ""}`}>
            Contact
          </a>
        </div>

        <button className="login-btn" onClick={handleLoginClick}>
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <img src={headingImage || "/placeholder.svg"} alt="Cinnamon Red Hotel" className="hero-image" />
        <div className="hero-overlay">
          <h1 className="hero-title">Welcome to Cinnamon Red Hotel</h1>
          <p className="hero-subtitle">
            Experience luxury and comfort like never before. Indulge in our premium services and create unforgettable
            memories.
          </p>
          <button className="hero-btn" onClick={handleOrderClick}>
            Explore Now
          </button>
        </div>
      </section>

      {/* Food Order Section */}
      <section id="food" className="food-order">
        <h2 className="section-title">Food Order Process</h2>
        <p className="section-text">
          Indulge in a wide variety of gourmet dishes from our exclusive menu. Simply click below to start your order
          and enjoy a delectable dining experience delivered right to your room or served at our elegant restaurant.
        </p>
        <button className="order-btn" onClick={handleOrderClick}>
          Order Food Now
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2 className="features-title">Our Amenities</h2>
        <div className="features-container">
          <div
            className="feature-card"
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <div className="card-image-container">
              <img src={image1 || "/placeholder.svg"} alt="Luxurious Rooms" className="card-image" />
            </div>
            <div className="card-content">
              <h3 className="card-title">Luxurious Rooms</h3>
              <p className="card-text">
                Enjoy a stay in our beautifully furnished rooms with panoramic views, designed for ultimate relaxation
                and comfort.
              </p>
            </div>
          </div>

          <div
            className="feature-card"
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <div className="card-image-container">
              <img src={image5 || "/placeholder.svg"} alt="Exclusive Spa" className="card-image" />
            </div>
            <div className="card-content">
              <h3 className="card-title">Exclusive Spa</h3>
              <p className="card-text">
                Unwind with rejuvenating spa treatments designed to relax your senses and provide a peaceful retreat
                from daily stress.
              </p>
            </div>
          </div>

          <div
            className="feature-card"
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <div className="card-image-container">
              <img src={image3 || "/placeholder.svg"} alt="Poolside Relaxation" className="card-image" />
            </div>
            <div className="card-content">
              <h3 className="card-title">Poolside Relaxation</h3>
              <p className="card-text">
                Dive into serenity at our beautiful poolside, a perfect setting for relaxation, socializing, and soaking
                up the sun.
              </p>
            </div>
          </div>

          <div
            className="feature-card"
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <div className="card-image-container">
              <img src={image4 || "/placeholder.svg"} alt="Gourmet Dining" className="card-image" />
            </div>
            <div className="card-content">
              <h3 className="card-title">Gourmet Dining</h3>
              <p className="card-text">
                Indulge in world-class dining with fresh, gourmet cuisines prepared by our expert chefs using the finest
                ingredients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div>
            <img src={companylogo || "/placeholder.svg"} alt="Cinnamon Red Hotel" className="footer-logo" />
            <p className="footer-about">
              Cinnamon Red Hotel offers luxury accommodations with world-class amenities and exceptional service to make
              your stay unforgettable.
            </p>
            <div className="social-icons">
              <a href="https://www.facebook.com" className="social-icon">
                <img src={fblogo || "/placeholder.svg"} alt="Facebook" />
              </a>
              <a href="https://www.instagram.com" className="social-icon">
                <img src={instalogo || "/placeholder.svg"} alt="Instagram" />
              </a>
              <a href="https://twitter.com" className="social-icon">
                <img src={twitterlogo || "/placeholder.svg"} alt="Twitter" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <a href="#home">Home</a>
              </li>
              <li className="footer-link">
                <a href="#food">Food Order</a>
              </li>
              <li className="footer-link">
                <a href="#features">Amenities</a>
              </li>
              <li className="footer-link">
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-links">
              <li className="footer-link">59 Ananda Coomaraswamy Mawatha, Colombo</li>
              <li className="footer-link">+94 11 2 161 161</li>
              <li className="footer-link">info@cinnamonred.com</li>
              <li className="footer-link">24/7 Customer Service</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2023 Cinnamon Red Hotel. All Rights Reserved</p>
        </div>
      </footer>

      {/* Login Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Select Login Type</h2>
            <div className="modal-buttons">
              <button className="modal-btn admin-btn" onClick={handleAdminLogin}>
                Admin Login
              </button>
              <button className="modal-btn customer-btn" onClick={handleCustomerLogin}>
                Customer Login
              </button>
              <button className="modal-btn close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage

