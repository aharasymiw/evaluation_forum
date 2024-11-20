// @ts-nocheck
import { createRef, useState } from 'react';

import axios from 'axios';

const Upload = () => {

  const [photo, setPhoto] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = createRef();

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSnapClick = () => {
    fileInputRef.current.click();
  };

  const handleRetakeClick = () => {
    window.location.reload();
  };

  const submitPhoto = () => {
    if (photo) {
      const formData = new FormData();
      formData.append('file', photo);
      formData.append('upload_preset', import.meta.env.VITE_PRESET_NAME);

      axios.post(`photo upload url`, formData)
        .then(response => {
          const drawing_url = response.data.secure_url;
          return axios.post('/api/drawings', {
            drawing_url: drawing_url,
            round: 1
          });
        })
        .then(() => {
          setIsSubmitted(true);
        })
        .catch(err => {
          console.error('Error:', err.message);
          alert('Error occurred during photo submission.');
        });
    } else {
      alert('Please take a photo before submitting.');
    }
  };

  const closePopupAndRefresh = () => {
    console.log("Popup closed, refreshing the page...");
    window.location.reload();
  };

  return (
    <>
      <div onClick={handleSnapClick} style={{ cursor: 'pointer' }}>
        {!photo ? (

          <div className="center-panel-text">
            Tap here to take a photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <img
            src={URL.createObjectURL(photo)}
            alt="Captured"
            className="captured-image"
            style={{ width: '300px', height: 'auto' }}
          />
        )}
      </div>

      <div className="right-panel">
        <button className="action-button" onClick={handleRetakeClick}>Camera</button>
        <button className="action-button" onClick={submitPhoto}>Gallery</button>
      </div>

      {isSubmitted && (
        <div className="popup">
          <div className="popup-content">
            <h2>Submitted!</h2>
            <p>Your photo is submitted successfully.</p>
            <button className="close-button" onClick={closePopupAndRefresh}>Okay</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;
