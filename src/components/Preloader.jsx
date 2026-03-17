import React, { useEffect, useState } from 'react';
import apcLogo from '../assets/image.png';

const Preloader = ({ onFinish }) => {
  const [phase, setPhase] = useState('enter'); // enter | visible | exit

  useEffect(() => {
    // Tiny delay so the browser paints 'enter' state first, then transition fires
    const showTimer  = setTimeout(() => setPhase('visible'), 50);
    const exitTimer  = setTimeout(() => setPhase('exit'), 1900);
    const doneTimer  = setTimeout(() => onFinish(), 2500);
    return () => { clearTimeout(showTimer); clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#002C3D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
        opacity: phase === 'exit' ? 0 : phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.55s ease',
        pointerEvents: 'none',
      }}
    >
      {/* Logo + brand */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          transform: phase === 'enter' ? 'scale(0.82) translateY(8px)' : 'scale(1) translateY(0px)',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            flexShrink: 0,
          }}
        >
          <img
            src={apcLogo}
            alt="APC"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: '0.02em', margin: 0 }}>
            African Property Centre
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 4, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Your trusted property platform
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 160,
          height: 3,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 99,
            background: 'linear-gradient(90deg, #4EB3D1, #fff)',
            width: phase === 'enter' ? '0%' : phase === 'visible' ? '100%' : '100%',
            transition: 'width 1.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
};

const usePreloader = () => {
  const [done, setDone] = useState(false);

  // Skip preloader if user already visited (session flag)
  const [skip] = useState(() => sessionStorage.getItem('_apc_loaded') === '1');

  const finish = () => {
    sessionStorage.setItem('_apc_loaded', '1');
    setDone(true);
  };

  return { show: !skip && !done, finish };
};

export { usePreloader };
export default Preloader;
