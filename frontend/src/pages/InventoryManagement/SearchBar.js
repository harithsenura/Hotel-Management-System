import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSearch = () => {
    onSearch(input); // Trigger search on button click
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search when Enter is pressed
    }
  };

  const searchButtonStyle = {
    padding: "5px 10px",
    backgroundColor: "#A02334",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div
      className="input-wrapper"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #ddd',
        borderRadius: '8px', // Increased border-radius for rounded corners
        padding: '5px',
      }}
    >
      <input
        type="text"
        placeholder="Search items..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Trigger search when Enter is pressed
        style={{
          width: "300px", // Wider input field
          height: "30px", // Reduced thickness
          border: 'none',
          outline: 'none',
          padding: '5px',
          borderRadius: '8px', // Added border-radius for the input
        }}
      />
      <button onClick={handleSearch} style={searchButtonStyle}>
        <FaSearch /> {/* Added search icon */}
      </button>
    </div>
  );
};

export default SearchBar; // Ensure this line is present
