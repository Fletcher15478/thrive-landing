import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Sidebar from './Sidebar';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function ProgressPage() {
  const [liftData, setLiftData] = useState({});
  const [search, setSearch] = useState('');
  const [topLifts, setTopLifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLifts = async () => {
      setLoading(true);
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('tracked_lifts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        console.error(error.message);
        return;
      }

      const organized = {};
      data.forEach((lift) => {
        const key = lift.exercise_name;
        if (!organized[key]) organized[key] = [];
        organized[key].push({
          date: new Date(lift.date).toLocaleDateString(),
          weight: lift.average_weight
        });
      });

      setLiftData(organized);

      const allLifts = data.map((l) => ({
        name: l.exercise_name,
        weight: l.average_weight
      }));
      const top = allLifts.sort((a, b) => b.weight - a.weight).slice(0, 3);
      setTopLifts(top);
      setLoading(false);
    };

    fetchLifts();
  }, []);

  const filteredKeys = Object.keys(liftData).filter((key) =>
    key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '14rem', padding: '2rem', width: '100%', color: '#fff' }}>
        <h2 style={{ color: '#0ef' }}>📈 Progress Tracker</h2>

        <div style={{ margin: '2rem 0' }}>
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #0ef',
              background: '#1f293a',
              color: '#fff'
            }}
          />
        </div>

        <h3 style={{ color: '#0ef' }}>🏆 Top 3 Lifts</h3>
        <ul style={{ marginBottom: '2rem' }}>
          {topLifts.map((lift, i) => (
            <li key={i}>
              <strong>{lift.name}:</strong> {lift.weight.toFixed(1)} lbs
            </li>
          ))}
        </ul>

        {loading ? (
          <p>Loading...</p>
        ) : filteredKeys.length === 0 ? (
          <p>No lift data found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {filteredKeys.map((key) => (
              <div key={key}>
                <h4 style={{ marginBottom: '0.5rem', color: '#0ef' }}>{key}</h4>
                <div style={{ background: '#2c4766', padding: '1rem', borderRadius: '1rem' }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={liftData[key]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#0ef" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressPage;
