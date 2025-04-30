import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Splash() {
  const [visibleText, setVisibleText] = useState('');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const fullText = "Let's Get Healthy 💪";

  useEffect(() => {
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        const nextChar = fullText.charAt(charIndex);
        setVisibleText((prev) => prev + nextChar);
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 150);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => navigate('/dashboard'), 800);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => {
      clearInterval(typeInterval);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1 className="typing">{visibleText}</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="loading-msg">Charging Muscles… {progress}%</p>
      </div>
    </div>
  );
}

export default Splash;
