import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState('enter');
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Counter animation 0 → 100
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      setCount(Math.min(start, 100));
      if (start >= 100) clearInterval(interval);
    }, 22);

    const t1 = setTimeout(() => setPhase('exit'), 2600);
    const t2 = setTimeout(() => onDone(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval); };
  }, [onDone]);

  return (
    <div className={`splash splash-${phase}`}>
      {/* Grid background */}
      <div className="splash-grid" />

      {/* Animated orbs */}
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`particle p${i}`} />
      ))}

      <div className="splash-content">
        {/* Logo with 3D feel */}
        <div className="splash-logo-container">
          <div className="splash-logo-shadow" />
          <div className="splash-logo-main">
            <span className="splash-rupee">₹</span>
          </div>
          <div className="splash-logo-ring r1" />
          <div className="splash-logo-ring r2" />
          <div className="splash-logo-ring r3" />
        </div>

        {/* Brand name with letter spacing animation */}
        <div className="splash-brand">
          <h1 className="splash-title">
            {'SpendWise'.split('').map((ch, i) => (
              <span key={i} className="splash-letter" style={{ animationDelay: `${0.3 + i * 0.06}s` }}>{ch}</span>
            ))}
          </h1>
          <div className="splash-tagline-wrap">
            <div className="splash-line" />
            <p className="splash-tagline">Smart Money. Smarter Life.</p>
            <div className="splash-line" />
          </div>
        </div>

        {/* Feature pills */}
        <div className="splash-pills">
          {['💸 Expenses', '💰 Income', '📊 Analytics', '🎯 Budget'].map((f, i) => (
            <span key={f} className="splash-pill" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>{f}</span>
          ))}
        </div>

        {/* Progress bar with counter */}
        <div className="splash-progress-wrap">
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${count}%` }}>
              <div className="splash-progress-glow" />
            </div>
          </div>
          <div className="splash-progress-info">
            <span className="splash-loading-text">Initializing...</span>
            <span className="splash-counter">{count}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
