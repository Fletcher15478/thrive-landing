import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <h2 className="logo">Royal <span>Fitness</span></h2>
        <button className="nav-btn" onClick={() => navigate('/register')}>Join Us</button>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h3>Build Your</h3>
          <h1>Dream Physique</h1>
          <h3><span className="highlight">Fat Loss</span></h3>
          <p>Lorem ipsum dolor sit, bus earum, aliquam ipsa repellat iusto esse laudantium animi vitae consectetur obcaecati.</p>
          <button className="btn" onClick={() => navigate('/register')}>Join Us</button>
        </div>
        <div className="hero-img">
          <div className="bg-text">FITNESS</div>
          <img src="/hero.png" alt="Hero" />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
