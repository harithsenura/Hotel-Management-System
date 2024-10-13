import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Example validation logic
    if (username === 'baradmin' && password === '1234') {
      navigate('/bardashboard'); // Navigate to dashboard after successful login
    } else {
      setError('Invalid username or password');
    }
  };
  const titleBarStyle = {
    backgroundColor: '#1a1a1a',  // Match sidebar color
    padding: '10px',  // Increased padding for better appearance
    margin: 0,
    width: '100%',  // Full width minus sidebar width
    position: 'fixed',
    top: 0,  // Align with the top of the viewport
    boxSizing: 'border-box',
    textAlign: 'center',  // Center the title text
    color: '#fff',  // White text for contrast on dark background
    borderBottom: '1px solid #333',  // Optional: darker gray border at the bottom for better contrast
  };


  return (
    <div>
    <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Bar Management</h1>
      </div>
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Bar Admin Login</h2>
        <p style={styles.subtitle}>Please log in to your system</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Username</label>
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
          
          <label style={styles.label}>Password</label>
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
          
          {error && <p style={styles.error}>{error}</p>}
          
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
      </div>
      </div>
  );
};

// Updated inline styles for a more modern look
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'url("https://source.unsplash.com/random/1920x1080?event") no-repeat center center fixed',
    backgroundSize: 'cover',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    width: '400px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: '26px',
    marginBottom: '10px',
    color: '#333',
    fontWeight: '600',
    fontFamily: '"Poppins", sans-serif',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '20px',
    fontFamily: '"Poppins", sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
    textAlign: 'left',
    fontFamily: '"Poppins", sans-serif',
  },
  input: {
    marginBottom: '20px',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: '"Poppins", sans-serif',
    transition: 'border 0.3s, box-shadow 0.3s',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#800000',
    boxShadow: '0 0 5px rgba(128, 0, 0, 0.5)',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(45deg, #800000, #ff6347)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: '"Poppins", sans-serif',
    transition: 'background 0.3s, transform 0.2s',
    marginTop: '10px',
  },
  buttonHover: {
    transform: 'scale(1.05)',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
    fontSize: '14px',
  },
};

export default Login;
