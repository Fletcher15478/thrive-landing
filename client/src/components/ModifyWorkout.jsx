import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ModifyWorkout() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentPlan = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_workouts')
        .select('generated_plan')
        .eq('id', user.id)
        .single();

      if (data?.generated_plan) setCurrentPlan(data.generated_plan);
      setLoading(false);
    };

    getCurrentPlan();
  }, []);

  const handleSendModification = async () => {
    setStatus('Sending to AI...');
    const promptText = `
Here is my current workout plan: ${JSON.stringify(currentPlan, null, 2)}

User request: ${prompt}

Please return the updated plan in JSON ONLY like:
[
  { "day": "Monday", "workout": ["Exercise 1", "Exercise 2"] },
  ...
]
    `;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: promptText }] }]
      })
    });

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

    let updatedPlan;
    try {
      const match = text.match(/\[.*\]/s);
      if (match) {
        updatedPlan = JSON.parse(match[0]);
      } else {
        throw new Error();
      }
    } catch {
      setStatus('AI response could not be parsed.');
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;

    const { error } = await supabase
      .from('ai_workouts')
      .update({ generated_plan: updatedPlan })
      .eq('id', user.id);

    if (error) {
      setStatus('Failed to save plan.');
    } else {
      setStatus('✅ Plan updated! Redirecting...');
      setTimeout(() => navigate('/workouts'), 2000);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Suggest a Change</h2>
        {loading ? (
          <p style={{ color: '#fff' }}>Loading your current plan...</p>
        ) : (
          <>
            <textarea
              placeholder="What would you like to change or remove?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '10px',
                border: '2px solid #0ef',
                background: 'transparent',
                color: '#fff',
                marginBottom: '1rem'
              }}
            />
            <button className="btn" onClick={handleSendModification}>Send to AI</button>
            {status && <p style={{ color: 'lime', marginTop: '1rem' }}>{status}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default ModifyWorkout;
