import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="landing-logo">Thrive</h1>
      </header>

      <main className="landing-hero">
        <div className="landing-text">
          <h2>Your AI Fitness Companion</h2>
          <p>
            Thrive is your personal fitness partner — powered by AI. From personalized workouts to macro tracking and daily check-ins,
            Thrive adapts to your goals and grows with your progress. Stay accountable, optimize performance, and take your health to the next level.
          </p>
          <button className="btn btn-pink" onClick={() => navigate('/register')}>Start Now</button>
        </div>
        <div className="landing-image">
          <img src="images/hero.png" alt="Thrive App Preview" />
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
