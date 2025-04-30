import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Sidebar from './Sidebar';

function AIPlans() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    duration: '',
    avoid: '',
    focus: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return navigate('/');

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
    };

    getProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const weekCount = parseInt(form.duration.split(' ')[0]);

    const prompt = `
You are a fitness coach. Create a detailed ${weekCount}-week workout plan based on this user's profile:

Name: ${profile.full_name}
Goal: ${profile.goal}
Experience: ${profile.experience}
Gender: ${profile.gender}
Weight: ${profile.weight} lbs
Height: ${profile.height} inches

Program Length: ${form.duration}
Focus Areas: ${form.focus}
Avoid: ${form.avoid}

Each workout entry should include:
- "date": YYYY-MM-DD (starting from today)
- "day": Weekday name
- "workout": array of { "name": "Exercise Name", "sets": number, "key": "unique_workout_key" }

IMPORTANT: For the final week of the program, add "end": 0 to each entry to mark it's the last week.

Output ONLY valid JSON. No markdown or explanation. Example:
[
  {
    "date": "2025-04-01",
    "day": "Monday",
    "workout": [
      { "name": "Bench Press", "sets": 3, "key": "bench_press" }
    ]
  },
  {
    "date": "2025-05-20",
    "day": "Tuesday",
    "workout": [],
    "end": 0
  }
]
`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

      let parsedPlan;
      try {
        const match = text.match(/\[.*\]/s);
        if (match) {
          parsedPlan = JSON.parse(match[0]);
        } else {
          throw new Error();
        }
      } catch {
        throw new Error('AI response could not be parsed.');
      }

      // Save whole plan to ai_workouts (optional backup)
      await supabase.from('ai_workouts').upsert({
        id: profile.id,
        plan_title: `AI Plan - ${form.duration}`,
        generated_plan: parsedPlan
      });

      // Save each workout day to user_workouts
      const today = new Date();

      for (let i = 0; i < parsedPlan.length; i++) {
        const entry = parsedPlan[i];
        const workoutDate = new Date(today);
        workoutDate.setDate(today.getDate() + i);
        const isoDate = workoutDate.toISOString().split('T')[0];

        const { error } = await supabase.from('user_workouts').insert({
          user_id: profile.id,
          day_name: entry.day,
          date: isoDate,
          workout: entry.workout
        });

        if (error) console.error('Workout insert error:', error.message);
      }

      navigate('/workouts', { state: { refresh: true } });

    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{
        marginLeft: '14rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div className="login-box" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Generate Your AI Workout Plan</h2>
          <form onSubmit={handleGenerate}>
            <div className="input-box">
              <select name="duration" value={form.duration} onChange={handleChange} required>
                <option value="">Select Program Duration</option>
                <option value="4 weeks">4 Weeks</option>
                <option value="6 weeks">6 Weeks</option>
                <option value="8 weeks">8 Weeks</option>
                <option value="12 weeks">12 Weeks</option>
                <option value="16 weeks">16 Weeks</option>
              </select>
            </div>
            <div className="input-box">
              <select name="focus" value={form.focus} onChange={handleChange} required>
                <option value="">Choose Your Focus</option>
                <option value="strength">Strength</option>
                <option value="hypertrophy">Hypertrophy (Muscle Growth)</option>
                <option value="conditioning">Conditioning</option>
                <option value="fat loss">Fat Loss</option>
                <option value="general fitness">General Fitness</option>
              </select>
            </div>
            <div className="input-box">
              <select name="avoid" value={form.avoid} onChange={handleChange}>
                <option value="">Anything to avoid?</option>
                <option value="none">None</option>
                <option value="no barbell">No Barbell</option>
                <option value="knee pain">Knee Pain / Avoid Squats</option>
                <option value="shoulder pain">Shoulder Pain / Avoid Overhead Pressing</option>
                <option value="no machines">No Machines</option>
                <option value="custom">I'll type my own (add to notes)</option>
              </select>
            </div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Plan'}
            </button>
            {errorMsg && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AIPlans;
