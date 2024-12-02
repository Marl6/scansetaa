// src/components/pages/dashboard1.jsx
import React from 'react';
import '../css/medinfo.css';
import back from '../assets/icons/medinfo/back.png'; // Ensure the path is correct

const Dashboard1 = ({ goToDashboard3 }) => (
  <div className="dashboard">
    <div className="header">
      <button className="back-button" onClick={goToDashboard3}>
        <img src={back} alt="Back" className="back-icon" />
      </button>

      <button className="medicine_name">
        <h2>Medicine Name</h2>
      </button>
    </div>

    {/* New overall-container */}
    <div className="overall-container">
      <p>This is your content inside the container.</p>
      <div className="name-container">
        <p>This is your content inside the container.</p>
      </div>
    </div>
  </div>
);

export default Dashboard1;
