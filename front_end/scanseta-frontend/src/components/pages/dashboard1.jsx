// src/components/pages/dashboard1.jsx
import React from 'react';
import '../css/dashboard1.css';
import logo from '../assets/images/scanseta_logo_white.png'; // Adjust the path as needed
import scanIcon from '../assets/icons/dashboard1/scan_icon.png'; // Updated image name
import searchIcon from '../assets/icons/dashboard1/search_icon.png'; // Updated image name
import uploadIcon from '../assets/icons/dashboard1/cloud-computing.png'; // Updated image name

const Dashboard1 = ({ goToDashboard2, goToDashboard3, goToUploadFile }) => ( // Added goToUploadFile prop
  <div className="dashboard">
    <div className="header">
      <img src={logo} alt="Scanseta Logo" className="logo" />
    </div>
    <div className="buttons">
      <button onClick={goToDashboard2}>
        <img src={scanIcon} alt="Scan Icon" className="button-image" />
        <h2>Scan</h2>
        <p>Scan Doctor’s prescription</p>
      </button>
      <button onClick={goToUploadFile}> {/* Updated to call goToUploadFile */}
        <img src={uploadIcon} alt="Upload Icon" className="button-image" />
        <h2>Upload</h2>
        <p>Upload your prescription</p>
      </button>
      <button onClick={goToDashboard3}>
        <img src={searchIcon} alt="Search Icon" className="button-image" />
        <h2>Search</h2>
        <p>Discover medicine’s information</p>
      </button>
    </div>
  </div>
);

export default Dashboard1;
