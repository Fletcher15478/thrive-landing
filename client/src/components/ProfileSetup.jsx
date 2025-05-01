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
      const { data } = await supabase.auth.getUser();
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
    <div className="profile-container">
      <div className="profile-box">
        <h2>Customize Your Fitness Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <label htmlFor="full_name">Full Name</label>
          </div>

          <div className="input-box">
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            <label htmlFor="weight">Weight (lbs)</label>
          </div>

          <div className="input-box">
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
            <label htmlFor="height">Height (inches)</label>
          </div>

          <div className="input-box">
  <select
    id="gender"
    name="gender"
    value={formData.gender}
    onChange={handleChange}
    required
  >
    <option value="" disabled hidden></option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </select>
  <label
    htmlFor="gender"
    className={formData.gender ? 'floating' : ''}
  >
    Gender
  </label>
</div>

<div className="input-box">
  <select
    id="experience"
    name="experience"
    value={formData.experience}
    onChange={handleChange}
    required
  >
    <option value="" disabled hidden></option>
    <option value="beginner">Beginner</option>
    <option value="intermediate">Intermediate</option>
    <option value="advanced">Advanced</option>
  </select>
  <label
    htmlFor="experience"
    className={formData.experience ? 'floating' : ''}
  >
    Experience Level
  </label>
</div>

          <div className="input-box">
            <input
              type="text"
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
            />
            <label htmlFor="goal">Fitness Goal</label>
          </div>

          <div className="input-box">
            <input
              type="number"
              id="calories_target"
              name="calories_target"
              value={formData.calories_target}
              onChange={handleChange}
            />
            <label htmlFor="calories_target">Daily Calorie Target (optional)</label>
          </div>

          <button type="submit" className="btn">Save Profile</button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
