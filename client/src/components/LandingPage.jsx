import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Set body and html background to match landing page
    const originalBodyBackground = document.body.style.background;
    const originalHtmlBackground = document.documentElement.style.background;
    const originalBodyMargin = document.body.style.margin;
    const originalBodyPadding = document.body.style.padding;
    
    document.body.style.background = '#0f172a';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.background = '#0f172a';
    
    // Cleanup function to restore original styles when component unmounts
    return () => {
      document.body.style.background = originalBodyBackground || '';
      document.body.style.margin = originalBodyMargin || '';
      document.body.style.padding = originalBodyPadding || '';
      document.documentElement.style.background = originalHtmlBackground || '';
    };
  }, []);

  return (
    <div className="landing-container">
      <div className="particles"></div>
      <header className="landing-header">
        <h1 className="landing-logo">Thrive</h1>
        <nav className="landing-nav">
          <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="landing-text">
          <span className="hero-subtitle">AI-Powered Fitness</span>
          <h2>Transform Your Fitness Journey</h2>
          <p>
            Experience the future of fitness with Thrive — your intelligent workout companion. 
            Get personalized training plans, real-time progress tracking, and AI-driven insights 
            that adapt to your goals and performance.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Start Free Trial
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/demo')}>
              Watch Demo
            </button>
          </div>
        </div>
        <div className="landing-image">
          <div className="image-container">
            <img src="images/hero.png" alt="Thrive App Preview" />
            <div className="floating-card card-1">
              <span>AI Workouts</span>
            </div>
            <div className="floating-card card-2">
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
