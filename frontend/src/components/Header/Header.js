import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../images/company.png';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import styles from './header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants for menu
  const menuVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 22 
      }
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      scale: 0.98,
      transition: { duration: 0.2 } 
    }
  };

  // Cart count animation
  const cartCountVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/food" className={styles.logo}>
          <motion.img 
            src={logo} 
            alt="Company Logo" 
            className={styles.logoImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          />
        </Link>

        {/* Mobile menu toggle */}
        <div 
          className={styles.mobileMenuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <ul>
            {user ? (
              <li 
                className={styles.menuContainer}
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link to="/dashboard" className={styles.userLink}>
                  <FaUserCircle className={styles.userIcon} />
                  <span>{user.name}</span>
                  <FaChevronDown className={`${styles.chevron} ${menuOpen ? styles.rotated : ''}`} />
                </Link>
                
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div 
                      className={styles.menu}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={menuVariants}
                    >
                      <Link to="/foodprofile" className={styles.menuItem}>
                        <motion.span whileHover={{ x: 5, color: '#34D399' }}>Profile</motion.span>
                      </Link>
                      <Link to="/orders" className={styles.menuItem}>
                        <motion.span whileHover={{ x: 5, color: '#34D399' }}>Orders</motion.span>
                      </Link>
                      <a onClick={logout} className={styles.menuItem}>
                        <motion.span whileHover={{ x: 5, color: '#34D399' }}>Logout</motion.span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/Login" className={styles.loginButton}>
                    Login
                  </Link>
                </motion.div>
              </li>
            )}

            <li className={styles.cartItem}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/cart" className={styles.cartLink}>
                  <FaShoppingCart className={styles.cartIcon} />
                  <span>Cart</span>
                  {cart.totalCount > 0 && (
                    <motion.span 
                      className={styles.cartCount}
                      initial="initial"
                      animate="animate"
                      variants={cartCountVariants}
                      key={cart.totalCount}
                    >
                      {cart.totalCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
