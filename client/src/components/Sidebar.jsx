import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import JeepTribute from './Jeep';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showJeep, setShowJeep] = useState(false);

  const handleLogout = async () => {
    setShowJeep(true); // trigger animation
  };

  const finishLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <>
      {showJeep && <JeepTribute onFinish={finishLogout} />}
      <div className="Sidebar">
        <h2 className="logo">🏋️ Thrive</h2>
        <ul>
          <li onClick={() => navigate('/dashboard')}>📊 Dashboard</li>
          <li onClick={() => navigate('/progress')}>📈 Progress</li>
          <li onClick={() => navigate('/aiplans')}>🧠 AI Plans</li>
          <li onClick={() => navigate('/profile')}>👤 Profile</li>
          <li onClick={() => navigate('/workouts')}>🏋️ Workouts</li>
          <li onClick={() => navigate('/macrotracker')}>🍽️ Calorie Tracker</li>
          
          <li onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
