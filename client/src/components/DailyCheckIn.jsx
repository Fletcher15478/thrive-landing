// components/DailyCheckIn.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import '../DailyCheckIn.css';

function DailyCheckIn({ onComplete }) {
  const [form, setForm] = useState({ feeling: '', sleep_quality: '', lift_feedback: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    const today = new Date().toISOString().split('T')[0];
    if (!user) return;

    const prompt = `
You are an AI fitness buddy. A user filled out:
- Feeling: ${form.feeling}
- Sleep: ${form.sleep_quality}
- Lift: ${form.lift_feedback}
Give a friendly motivational fitness tip for today, based on that info.
`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    });

    const json = await res.json();
    const ai_tip = json.candidates?.[0]?.content?.parts?.[0]?.text || 'Stay consistent — small wins add up 💪';

    await supabase.from('daily_checkins').insert({
      user_id: user.id,
      date: today,
      feeling: form.feeling,
      sleep_quality: form.sleep_quality,
      lift_feedback: form.lift_feedback,
      ai_tip
    });

    localStorage.setItem('lastCheckInDate', today);
    onComplete(ai_tip);
    setLoading(false);
  };

  return (
    <div className="checkin-overlay">
      <div className="checkin-modal">
        <h2>🧠 Daily Check-In</h2>
        <form onSubmit={handleSubmit}>
          <textarea name="feeling" placeholder="How are you feeling?" onChange={handleChange} required />
          <textarea name="sleep_quality" placeholder="How did you sleep?" onChange={handleChange} required />
          <textarea name="lift_feedback" placeholder="How was your last workout?" onChange={handleChange} required />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
  }  

  export default DailyCheckIn;
