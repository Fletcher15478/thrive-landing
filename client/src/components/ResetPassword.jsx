import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setStatus('Error: ' + error.message);
    } else {
      setStatus('✅ Password updated! Redirecting to login...');
      setTimeout(() => navigate('/'), 2500);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Reset Password</h2>
        <form onSubmit={handlePasswordReset}>
          <div className="input-box">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label>New Password</label>
          </div>
          <button type="submit" className="btn">Update Password</button>
          {status && <p style={{ color: 'lime', textAlign: 'center', marginTop: '10px' }}>{status}</p>}
        </form>
      </div>
      {[...Array(50)].map((_, i) => (
        <span key={i} style={{ "--i": i }}></span>
      ))}
    </div>
  );
}

export default ResetPassword;
