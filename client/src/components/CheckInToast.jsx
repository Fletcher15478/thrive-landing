import React from 'react';
import '../CheckInToast.css'; // Make sure this file exists

function CheckInToast({ tip }) {
  return (
    <div className="toast-container">
      <div className="toast-inner">
        <img
          src="https://cdn-icons-png.flaticon.com/512/921/921347.png"
          alt="Coach Bot"
          className="coach-icon"
        />
        <div>
          <h4 className="toast-title">Tip of the Day</h4>
          <p className="toast-tip">{tip}</p>
        </div>
      </div>
    </div>
  );
}

export default CheckInToast;
