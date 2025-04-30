import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import Sidebar from './Sidebar';

function WorkoutEntry() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [weights, setWeights] = useState({});
  const [saved, setSaved] = useState({});
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      const { data } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('workout_id', workoutId)
        .single();

      if (data) {
        setWorkout(data);
      }
    };
    fetchWorkout();
  }, [workoutId]);

  const handleChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (exerciseName, sets) => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user || !workout) return;

    const inputs = Array.from({ length: sets }, (_, i) =>
      parseFloat(weights[`${exerciseName}-${i}`] || 0)
    );
    const avg = inputs.reduce((sum, v) => sum + v, 0) / sets;

    const { error } = await supabase.from('tracked_lifts').upsert({
      user_id: user.id,
      workout_id: workout.workout_id,
      exercise_name: exerciseName,
      average_weight: avg,
      date: workout.date
    });

    if (!error) {
      setSaved((prev) => ({ ...prev, [exerciseName]: true }));

      const allDone = workout.workout.every(
        (e) => saved[e.name] || e.name === exerciseName
      );

      if (allDone) {
        setShowCongrats(true);
        await supabase
          .from('user_workouts')
          .update({ completed: true })
          .eq('workout_id', workout.workout_id);
      }
    } else {
      console.error('Save error:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '14rem', padding: '2rem', width: '100%', color: '#fff' }}>
        <h2 style={{ color: '#0ef' }}>🏋️ Workout Entry</h2>
        {workout ? (
          <>
            <h3>{new Date(workout.date).toLocaleDateString('en-US', {
  weekday: undefined,
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}</h3>

            {showCongrats && (
              <div style={{
                background: '#1f5a36',
                color: '#fff',
                padding: '1rem',
                marginTop: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                🎉 Congrats! You’ve completed this workout!
              </div>
            )}

            {workout.workout.map((exercise, i) => {
              const name = exercise.name;
              const sets = exercise.sets || 3;
              const done = saved[name];

              return (
                <div key={i} style={{
                  background: done ? '#1f5a36' : '#2c4766',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  marginBottom: '2rem'
                }}>
                  <strong>{name}</strong>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Array.from({ length: sets }).map((_, s) => (
                      <input
                        key={s}
                        type="number"
                        disabled={done}
                        value={weights[`${name}-${s}`] || ''}
                        onChange={(e) => handleChange(`${name}-${s}`, e.target.value)}
                        placeholder={`Set ${s + 1}`}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #0ef',
                          background: done ? '#1f5a36' : '#1f293a',
                          color: '#fff'
                        }}
                      />
                    ))}
                    {!done && (
                      <button
                        className="btn"
                        onClick={() => handleSave(name, sets)}
                        style={{ background: '#0ef', color: '#1f293a' }}
                      >
                        Save Avg
                      </button>
                    )}
                    {done && <span style={{ color: 'lime' }}>✅ Saved</span>}
                  </div>
                </div>
              );
            })}

<button
  className="btn"
  onClick={() => navigate('/workouts')}
  style={{
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    background: '#0ef',
    color: '#1f293a',
    fontWeight: 'bold',
    fontSize: '1rem',
    whiteSpace: 'nowrap',       // prevents wrap
    minWidth: '250px',          // makes it wide enough
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer'
  }}
>
  ← Back to Calendar
</button>


          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default WorkoutEntry;
