// src/components/pages/Dashboard3.jsx
import React, { useState } from 'react';
import logo from '../assets/images/scanseta_logo_white.png'; // Adjust the path as needed
import homeIcon from '../assets/icons/scan_success/home.png'; // Import the home icon
import searchIcon from '../assets/icons/dashboard3/search.png'; // Import the search icon
import '../css/dashboard3.css';

const Dashboard3 = ({ goBack, goNext }) => { // Include goNext in props
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Implement the search functionality here
    console.log(`Searching for: ${searchTerm}`);
    goNext(); // Navigate to the next page (MedInfo)
  };

  return (
    <div className="dashboard">
      <div className="logo-container">
        <img src={logo} alt="Scanseta Logo" className="logo" />
      </div>
      <button className="home-button" onClick={goBack}>
        <img src={homeIcon} alt="Home" className="home-icon" />
      </button>
      <div className="search-container">
        <div className="search-wrapper">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search for medicine..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
          <button className="search-button" onClick={handleSearchSubmit}>
            <img src={searchIcon} alt="Search" className="search-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard3;
