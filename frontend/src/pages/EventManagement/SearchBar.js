import React,{useState} from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { joinPaths, json } from "@remix-run/router";

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
      <div className="input-wrapper" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '5px' }}>
        <input
          type="text"
          placeholder="Search items..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Trigger search when Enter is pressed
          style={{ border: 'none', outline: 'none', padding: '5px' }}
        />
        <button onClick={handleSearch} style={searchButtonStyle}>Search</button>
      </div>
    );
    
  };
  
  export default SearchBar; // Ensure this line is present