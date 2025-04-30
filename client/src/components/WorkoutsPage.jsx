import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

function WorkoutsPage() {
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  const today = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  useEffect(() => {
    const fetchAllData = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;

      const { data: workouts } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('user_id', user.id);

      setPlan(workouts || []);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const isSameDay = (d1, d2) =>
    new Date(d1).toDateString() === new Date(d2).toDateString();

  const goToNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const goToPrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '14rem', padding: '2rem', width: '100%' }}>
        <h2 style={{ color: '#0ef', marginBottom: '2rem' }}>Your Workout Calendar</h2>

        {loading ? (
          <p style={{ color: '#fff' }}>Loading...</p>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              <button
                onClick={goToPrevMonth}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0ef',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  padding: '0.25rem 1rem'
                }}
              >
                ←
              </button>
              <h1 style={{ color: '#0ef' }}>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h1>
              <button
                onClick={goToNextMonth}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0ef',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  padding: '0.25rem 1rem'
                }}
              >
                →
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '0.75rem',
              background: '#1e293b',
              padding: '1rem',
              borderRadius: '1rem',
              marginTop: '2rem'
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ color: '#0ef', textAlign: 'center' }}>{day}</div>
              ))}

              {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                const dateStr = dateObj.toISOString().split('T')[0];
                const pretty = dateObj.toDateString();
                const workout = plan.find(w => new Date(w.date).toDateString() === pretty);
                const isToday = isSameDay(dateObj, today);
                const isCompleted = workout?.completed;

                return (
                  <div
                    key={i}
                    onClick={() => workout && !isCompleted && navigate(`/workout-entry/${workout.workout_id}`)}
                    style={{
                      background: workout
                        ? isCompleted
                          ? '#1f5a36'
                          : isToday ? '#0ef' : '#2c4766'
                        : '#374151',
                      color: workout
                        ? isCompleted
                          ? '#fff'
                          : isToday ? '#1f293a' : '#fff'
                        : '#6b7280',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                      cursor: workout && !isCompleted ? 'pointer' : 'default'
                    }}
                  >
                    <h4>{i + 1}</h4>
                    {workout && (
                      <>
                        {workout.workout?.length > 0 && (
                          <p style={{ fontSize: '0.8rem' }}>
                            {workout.workout.length} exercises
                          </p>
                        )}
                        {workout.end === 0 && (
                          <p style={{ fontSize: '0.75rem', color: '#fff' }}>🏁 Final Day</p>
                        )}
                        {isCompleted ? (
                          <p style={{ fontSize: '0.75rem', color: 'lime' }}>✅ Done</p>
                        ) : (
                          <p style={{ fontSize: '0.75rem', color: '#f87171' }}>❌ Not Done</p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkoutsPage;
