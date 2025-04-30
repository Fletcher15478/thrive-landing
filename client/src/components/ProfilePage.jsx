import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import '../ProfileSettings.css'; // Make sure this file exists

function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    weight: '',
    height: '',
    experience: '',
    goal: '',
    calories_target: ''
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('Account');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) setFormData(data);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', userId);
    if (error) {
      alert('Error updating profile: ' + error.message);
    } else {
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  if (loading) return <div className="splash-screen"><h2>Loading Profile...</h2></div>;

  return (
    <div className="profile-wrapper">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <h3>Thrive</h3>
        {['Account', 'Password', 'Preferences'].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="profile-form-panel">
        <h2>Edit Your Profile</h2>
        <form onSubmit={handleUpdate}>
          {activeTab === 'Account' && (
            <fieldset>
              <legend>👤 Account Info</legend>

              <div className="form-field">
                <label>Full Name</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
              </div>

              <div className="form-field">
                <label>Weight (lbs)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
              </div>

              <div className="form-field">
                <label>Height (inches)</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} />
              </div>
            </fieldset>
          )}

          {activeTab === 'Preferences' && (
            <fieldset>
              <legend>⚙️ Preferences</legend>

              <div className="form-field">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label>Experience</label>
                <select name="experience" value={formData.experience} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-field">
                <label>Fitness Goal</label>
                <input type="text" name="goal" value={formData.goal} onChange={handleChange} />
              </div>

              <div className="form-field">
                <label>Calorie Target (optional)</label>
                <input type="number" name="calories_target" value={formData.calories_target} onChange={handleChange} />
              </div>
            </fieldset>
          )}

{activeTab === 'Password' && (
  <div className="password-info-wrapper">
    <h3>🔐 Change Password</h3>
    <p>
      Password management is handled through Supabase Auth.  
      Use the <strong>forgot password</strong> link on the login screen to reset it.
    </p>
  </div>
)}

          

          <div className="profile-actions">
            <button type="submit" className="save">Save</button>
            <button type="button" className="cancel" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>

          {successMsg && <p style={{ color: 'lime', marginTop: '1rem' }}>{successMsg}</p>}
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
