import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';  // Import axios
import Webcam from 'react-webcam';
import '../css/scan_success.css';
import logo from '../assets/images/scanseta_logo_white.png'; // Adjust the path as needed
import resetIcon from '../assets/icons/scan_success/reset.png'; // Import reset icon
import proceedIcon from '../assets/icons/scan_success/proceed.png'; // Import proceed icon
import homeIcon from '../assets/icons/scan_success/home.png'; // Import the home icon

const ScanSuccess = ({ goNext, goBack }) => {
  const webcamRef = useRef(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  useEffect(() => {
    // Function to check if the webcam is ready
    const checkWebcamReady = () => {
      if (webcamRef.current) {
        console.log('Webcam is ready!');
        setIsWebcamReady(true);
      }
    };

    checkWebcamReady();
  }, []);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot(); // Capture image as base64
  
    if (!imageSrc) {
      console.error('No image captured');
      return;
    }
  
    // Convert base64 string to a Blob
    const byteString = atob(imageSrc.split(',')[1]);
    const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
  
    // Create FormData object
    const formData = new FormData();
    formData.append('file', blob, 'captured_image.jpg'); // Append the blob as a file
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload-file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data); // Log the backend response
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  

  return (
    <div className="scan-success-dashboard">
      <div className="logo-container">
        <img src={logo} alt="Scanseta Logo" className="logo" />
      </div>
      <button className="home-button" onClick={goBack}>
        <img src={homeIcon} alt="Home" className="home-icon" />
      </button>
      <div className="content-container">
        <p className="instruction-text">
          Please place your prescription on the <br />scanner deck
        </p>
        <div className="container1">
          <div className="container2">
            <Webcam
              audio={false} // Disable audio
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className={`webcam ${isWebcamReady ? 'ready' : ''}`} // Add a class when webcam is ready
              onUserMedia={() => setIsWebcamReady(true)} // Set webcam ready when user media is available
              onUserMediaError={() => setIsWebcamReady(false)} // Set webcam not ready on error
            />
          </div>
          <div className="progress">
            <div className="progress-bar">
            </div>
            <p className="progress-text">Scanned successfully</p>
          </div>
        </div>
        <div className="scan-buttons">
          <button className="scan-button-small">
            <img src={resetIcon} alt="Reset" className="button-icon" />
          </button>
          <button className="scan-button-large" onClick={handleCapture}> {/* Call handleCapture on button click */}
            <img src={proceedIcon} alt="Proceed" className="button-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanSuccess;
