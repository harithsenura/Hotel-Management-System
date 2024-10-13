import React, { useState } from 'react'; // Import React and useState
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import image1 from '../images/view1.jpg';
import image2 from '../images/view2.jpg';
import image3 from '../images/view3.jpg';
import image4 from '../images/view4.jpg';
import image5 from '../images/image5.jpg';
import instalogo from '../images/i.png';
import fblogo from '../images/f.png';
import twitterlogo from '../images/t.png';
import companylogo from '../images/company.png';
import headingImage from '../images/view2.jpg'; // Path to your larger heading image

// Inline CSS for modern look
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '0',
    padding: '0',
    boxSizing: 'border-box',
  },
  header: {
    position: 'relative',
    backgroundImage: 'url(images/header-bg.jpg)', // Background image for header
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#000',
    textAlign: 'center',
    padding: '100px 10px 50px 10px',
  },
  logo: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '100px',
  },
  headerText: {
    fontSize: '48px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  subHeader: {
    fontSize: '20px',
    fontWeight: '300',
    marginTop: '20px',
  },
  loginButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#ff6347',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
  },
  largeHeadingImage: {
    width: '100%',
    height: '600px',
    objectFit: 'cover',
  },
  section: {
    padding: '50px 20px',
    textAlign: 'center',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  sectionText: {
    fontSize: '18px',
    color: '#777',
    margin: '0 auto',
    maxWidth: '800px',
    lineHeight: '1.6',
  },
  cardSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '50px',
    padding: '0 20px',
  },
  card: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
  },
  cardContent: {
    padding: '20px',
    textAlign: 'center',
    background: '#fff',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '10px 0',
  },
  cardDescription: {
    fontSize: '16px',
    color: '#777',
    marginBottom: '20px',
  },
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px 0',
    textAlign: 'center',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '10px',
  },
  footerLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    textTransform: 'uppercase',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  socialIcon: {
    width: '24px',
    height: '24px',
  },
  companyLogo: {
    width: '150px',
    marginTop: '20px',
  },
  orderButton: {
    padding: '10px 20px',
    backgroundColor: '#b30000',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '30px',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  modalButton: {
    padding: '10px 20px',
    margin: '10px',
    backgroundColor: '#ff6347',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
  },
};

const HomePage = () => {
  const navigate = useNavigate(); // Use the useNavigate hook

  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleOrderClick = () => {
    navigate('/login'); // Navigate to /order route
  };

  const handleLoginClick = () => {
    setShowModal(true); // Show the modal when Login button is clicked
  };

  const handleAdminLogin = () => {
    navigate('/adminlogin'); // Navigate to admin login page
  };

  const handleCustomerLogin = () => {
    navigate('/login'); // Navigate to customer login page
  };

  

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <img
          src={companylogo} // Add your company logo here
          alt="Cinnamon Red Hotel"
          style={styles.logo}
        />
        <h1 style={styles.headerText}>Welcome to Cinnamon Red Hotel</h1>
        <p style={styles.subHeader}>Experience a luxurious stay like never before</p>
        <button style={styles.loginButton} onClick={handleLoginClick}>Login</button>
      </header>

      {/* Large Heading Image */}
      <img
        src={headingImage} // Path to your larger heading image
        alt="Cinnamon Red Hotel"
        style={styles.largeHeadingImage}
      />

      {/* Food Order Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Food Order Process</h2>
        <p style={styles.sectionText}>
          Indulge in a wide variety of gourmet dishes from our exclusive menu.
          Simply click below to start your order and enjoy a delectable dining experience.
        </p>
        <button style={styles.orderButton} onClick={handleOrderClick}>
          Order Food Now..
        </button>
      </section>

      {/* Hotel Features Section */}
      <section style={styles.cardSection}>
        <div style={styles.card}>
          <img
            src={image1} // Hotel View 1 Image
            alt="Luxurious Rooms"
            style={styles.cardImage}
          />
          <div style={styles.cardContent}>
            <h3 style={styles.cardTitle}>Luxurious Rooms</h3>
            <p style={styles.cardDescription}>
              Enjoy a stay in our beautifully furnished rooms with a panoramic view, designed for relaxation and comfort.
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <img
            src={image5} // Hotel View 2 Image
            alt="Exclusive Spa"
            style={styles.cardImage}
          />
          <div style={styles.cardContent}>
            <h3 style={styles.cardTitle}>Exclusive Spa</h3>
            <p style={styles.cardDescription}>
              Unwind with rejuvenating spa treatments designed to relax your senses. Enjoy a peaceful retreat.
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <img
            src={image3} // Hotel View 3 Image
            alt="Poolside Relaxation"
            style={styles.cardImage}
          />
          <div style={styles.cardContent}>
            <h3 style={styles.cardTitle}>Poolside Relaxation</h3>
            <p style={styles.cardDescription}>
              Dive into serenity at our beautiful poolside, a perfect setting for relaxation and socializing.
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <img
            src={image4} // Hotel View 4 Image
            alt="Gourmet Dining"
            style={styles.cardImage}
          />
          <div style={styles.cardContent}>
            <h3 style={styles.cardTitle}>Gourmet Dining</h3>
            <p style={styles.cardDescription}>
              Indulge in world-class dining with fresh, gourmet cuisines prepared by our expert chefs.
            </p>
          </div>
        </div>
      </section>
<br/><br/>
      {/* Footer Section */}
      <footer style={styles.footer}>
        <p>2023 Cinnamon Red Hotel.© All Rights Reserved</p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacy</a>
          <a href="#" style={styles.footerLink}>Terms</a>
        </div>
        <div style={styles.socialIcons}>
          <a href="https://www.facebook.com">
            <img src={fblogo} alt="Facebook" style={styles.socialIcon} />
          </a>
          <a href="https://www.instagram.com">
            <img src={instalogo} alt="Instagram" style={styles.socialIcon} />
          </a>
          <a href="https://twitter.com">
            <img src={twitterlogo} alt="Twitter" style={styles.socialIcon} />
          </a>
        </div>
      </footer>
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Select Login Type</h2>
            <button style={styles.modalButton} onClick={handleAdminLogin}>
              Admin Login
            </button>
            <button style={styles.modalButton} onClick={handleCustomerLogin}>
              Customer Login
            </button>
            <button style={styles.modalButton} onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default HomePage;
