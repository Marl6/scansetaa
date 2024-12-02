import React, { useState } from 'react';
import logo from '../assets/images/scanseta_logo_white.png'; // Adjust the path as needed
import homeIcon from '../assets/icons/scan_success/home.png'; // Import the home icon
import uploadIcon from '../assets/icons/dashboard1/cloud-computing.png'; // Replace with your upload icon path
import '../css/uploadFile.css';

const UploadFile = ({ goBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewImage, setPreviewImage] = useState(null); // State for the image preview
  const [predictedMedicine, setPredictedMedicine] = useState(''); // State to store predicted medicine name

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the selected image
    } else {
      setPreviewImage(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/upload-file', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus(result.message || 'File uploaded successfully!');
      } else {
        setUploadStatus(result.error || 'Failed to upload the file.');
      }
    } catch (error) {
      setUploadStatus('Error occurred while uploading.');
    }
  };

  const handleScanImage = async () => {
    if (!selectedFile) {
      setUploadStatus('No image selected for scanning.');
      return;
    }

    // Send the image to the backend for processing
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/scan-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus(result.message || 'Image scanned successfully!');
        // Set the predicted medicine name received from backend
        setPredictedMedicine(result.predicted_class); 
      } else {
        setUploadStatus(result.error || 'Failed to scan the image.');
      }
    } catch (error) {
      setUploadStatus('Error occurred while scanning the image.');
    }
  };

  return (
    <div className="upload-file">
      <div className="logo-container">
        <img src={logo} alt="Scanseta Logo" className="logo" />
      </div>
      <button className="home-button" onClick={goBack}>
        <img src={homeIcon} alt="Home" className="home-icon" />
      </button>
      <div className="upload-container">
        <input
          type="file"
          id="file-input"
          className="file-input"
          onChange={handleFileChange}
          accept="image/*"
        />
        {previewImage && (
          <div className="image-preview">
            <img src={previewImage} alt="Selected" className="preview-img" />
            {/* Floating button on top of the image */}
            <button className="scan-image-button" onClick={handleScanImage}>
              Scan Image
            </button>
          </div>
        )}
        <label className="upload-label" htmlFor="file-input">
          <img src={uploadIcon} alt="Upload" className="upload-icon" />
          <span>Select an image to upload</span>
        </label>
        <button className="upload-button" onClick={handleFileUpload}>
          Upload File
        </button>
        {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        {predictedMedicine && (
          <p className="predicted-medicine">
            Predicted Medicine: <strong>{predictedMedicine}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
