import React, { useState } from 'react';
import '../App.css';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
    } else {
        navigate('/splash');

    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Enter your email first to reset password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: 'http://localhost:3000/reset-password'
      });

    if (error) {
      setError(error.message);
    } else {
      setError("Password reset email sent!");
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
  <div className="input-box">
    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
    <label>Email</label>
  </div>
  <div className="input-box">
    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
    <label>Password</label>
  </div>
  <div className="forgot-pass">
    <button
      type="button"
      onClick={handleForgotPassword}
      style={{ background: 'transparent', border: 'none', color: '#0ef', cursor: 'pointer', fontSize: '0.85em' }}
    >
      Forgot your password?
    </button>
  </div>

  {/* ✅ Centered Login Button */}
  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
    <button type="submit" className="btn">Login</button>
  </div>

  <div className="signup-link">
    <a href="/register">Signup</a>
  </div>
  {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
</form>

      </div>
      {[...Array(50)].map((_, i) => (
        <span key={i} style={{ "--i": i }}></span>
      ))}
    </div>
  );
}

export default Login;
