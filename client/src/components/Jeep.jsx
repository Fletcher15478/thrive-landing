import React, { useEffect } from 'react';

function Jeep({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <>
      {/* Dim background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9998
      }}></div>

      {/* Logging out text */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#0ef',
        fontSize: '1.5rem',
        fontWeight: 600,
        zIndex: 9999,
        animation: 'fadeIn 0.5s ease-in-out'
      }}>
        Logging out<span className="dots">...</span>
        <style>{`
          .dots::after {
            content: '';
            animation: dots 1.2s steps(3, end) infinite;
          }
          @keyframes dots {
            0% { content: ''; }
            33% { content: '.'; }
            66% { content: '..'; }
            100% { content: '...'; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -40%); }
            to   { opacity: 1; transform: translate(-50%, -50%); }
          }
        `}</style>
      </div>

      {/* Sailing ship emoji */}
      <div style={{
        position: 'fixed',
        bottom: '-12px',
        left: 0,
        width: '100%',
        height: '80px',
        zIndex: 9999,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          fontSize: '2.8rem',
          display: 'inline-block',
          animation: 'sailAndBob 6s linear forwards'
        }}>
          🚢
        </div>

        <style>{`
          @keyframes sailAndBob {
            0%   { transform: translateX(0) translateY(0); }
            25%  { transform: translateX(25vw) translateY(-5px); }
            50%  { transform: translateX(50vw) translateY(0); }
            75%  { transform: translateX(75vw) translateY(-5px); }
            100% { transform: translateX(120vw) translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}

export default Jeep;
