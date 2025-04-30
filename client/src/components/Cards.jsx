import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import '../App.css';

function Cards() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error) {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <p style={{ color: '#fff' }}>Loading stats...</p>;
  }

  return (
    <div className="Cards">
      <div className="Card purple">
        <h4>Current Weight</h4>
        <p>{profile.weight} lbs</p>
      </div>
      <div className="Card pink">
        <h4>Calories Target</h4>
        <p>{profile.calories_target || 'Not set'} kcal</p>
      </div>
      <div className="Card yellow">
        <h4>Fitness Goal</h4>
        <p>{profile.goal}</p>
      </div>
    </div>
  );
}

export default Cards;
