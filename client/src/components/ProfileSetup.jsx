import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ProfileSetup() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    weight: '',
    height: '',
    experience: '',
    goal: '',
    calories_target: ''
  });

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        navigate('/');
      }
    };
    getUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('profiles').insert([
      { id: userId, ...formData }
    ]);

    if (error) {
      alert('Error saving profile: ' + error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Customize Your Fitness Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input type="text" name="full_name" onChange={handleChange} required />
            <label>Full Name</label>
          </div>
          <div className="input-box">
            <input type="number" name="weight" onChange={handleChange} required />
            <label>Weight (lbs)</label>
          </div>
          <div className="input-box">
            <input type="number" name="height" onChange={handleChange} required />
            <label>Height (inches)</label>
          </div>
          <div className="input-box">
            <select name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="input-box">
            <select name="experience" onChange={handleChange} required>
              <option value="">Experience Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="input-box">
            <input type="text" name="goal" onChange={handleChange} required />
            <label>Fitness Goal (e.g. Build Muscle)</label>
          </div>
          <div className="input-box">
            <input type="number" name="calories_target" onChange={handleChange} />
            <label>Daily Calorie Target (optional)</label>
          </div>
          <button type="submit" className="btn">Save Profile</button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
