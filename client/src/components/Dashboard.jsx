import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Cards from './Cards';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';
import DailyCheckIn from './DailyCheckIn';
import CheckInToast from './CheckInToast';

function Dashboard() {
  const [userName, setUserName] = useState('');
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dailyTip, setDailyTip] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndFetch = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;

      const name = user.user_metadata?.full_name || user.email.split('@')[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));

      // 🔍 Has user already checked in today?
      const todayStr = new Date().toISOString().split('T')[0];
      const { data: checkin } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayStr)
        .single();

      if (!checkin) setShowCheckIn(true);

      // Load workout plan
      const { data: planData } = await supabase
        .from('ai_workouts')
        .select('generated_plan')
        .eq('id', user.id)
        .single();

      const plan = planData?.generated_plan || [];
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayWorkout = plan.find((entry) => entry.day === today);
      setTodaysWorkout(todayWorkout || null);
    };

    checkAndFetch();
  }, []);

  const handleCheckInComplete = (tip) => {
    setDailyTip(tip);
    setShowToast(true);
    setShowCheckIn(false);
    setTimeout(() => setShowToast(false), 10000);
  };

  const sampleData = [
    { set: 'Set 1', weight: 0 },
    { set: 'Set 2', weight: 45 },
    { set: 'Set 3', weight: 135 },
    { set: 'Set 4', weight: 185 }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{
        marginLeft: '14rem',
        padding: '2rem 4rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '2rem',
        position: 'relative'
      }}>
        {showCheckIn && <DailyCheckIn onComplete={handleCheckInComplete} />}
        {showToast && <CheckInToast tip={dailyTip} />}

        <div style={{ flex: 1 }}>
          <div
            style={{
              background: '#1f293a',
              padding: '1.5rem',
              borderRadius: '1rem',
              color: '#fff',
              marginBottom: '2rem',
              marginTop: '-1rem',
              marginLeft: '-2.5rem',
              width: '105%',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onClick={() => navigate('/progress')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ marginBottom: '1rem', color: '#0ef' }}>Track Your Progress!</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="set" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#0ef" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              background: '#2c4766',
              padding: '1.5rem',
              borderRadius: '1rem',
              color: '#fff',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onClick={() => navigate('/workouts')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ color: '#0ef', marginBottom: '1rem' }}>🔥 Today's Workout</h3>
            <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </h4>
            {todaysWorkout ? (
              <ul style={{ paddingLeft: '1rem' }}>
                {todaysWorkout.workout.map((item, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    {item.name || item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#ccc' }}>No workout found for today.</p>
            )}
          </div>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-start'
        }}>
          <h1 style={{ color: '#fff', marginBottom: '2rem' }}>
            Let's Get Fit, {userName}! 👋
          </h1>

          <div style={{ width: '100%', maxWidth: '600px' }}>
            <Cards />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
