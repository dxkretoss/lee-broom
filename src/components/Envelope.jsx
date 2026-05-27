import React from 'react';
import WaxSeal from './WaxSeal';

// Clamp a value between min and max
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

// Map a value from one range to another
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

export default function Envelope({ scrollProgress, onSealClick, children }) {
  /**
   * SCROLL ANIMATION STAGES (total range 0 → 1 over 500vh):
   *
   *  0.00 → 0.08  Seal fades away
   *  0.00 → 0.50  Top flap rotates open (0° → -180° - finishes at exactly 200vh)
   *  ──── at 0.25: flap passes -90° → z-index swap
   *  0.50 → 0.82  Inner card slides up out of envelope (from 200vh to 328vh)
   *  0.82 → 1.00  Card zooms / portal reveals
   */

  // ── LID ROTATION ────────────────────────────────────────────────────────────
  // 0.00 → 0.50: lid sweeps all the way from 0° to -180° (finished at 200vh)
  const flapDeg = mapRange(scrollProgress, 0, 0.50, 0, -180);
  const flapPassedHalfway = flapDeg < -90; // z-index handoff at -90°

  // ── INTERNAL GLOW ────────────────────────────────────────────────────────────
  // Glow appears as the lid opens, tracks lid progress (0.10 → 0.45)
  const glowOpacity = mapRange(scrollProgress, 0.10, 0.45, 0, 1);

  // ── ENVELOPE CAMERA PAN ─────────────────────────────────────────────────────
  // Shifts the envelope DOWN as the lid rotates upward so the rotating flap
  // is never clipped by the header. Then pushes further down as card slides out.
  let camY = 55;
  let camScale = 1;
  let camOpacity = 1;

  if (scrollProgress <= 0.50) {
    // Stage 1 (0 → 0.50): lid opens, envelope pans down 55px → 130px
    camY = mapRange(scrollProgress, 0, 0.50, 55, 130);
  } else if (scrollProgress <= 0.82) {
    // Stage 2 (0.50 → 0.82): card slides out, envelope retreats further & fades
    const t = mapRange(scrollProgress, 0.50, 0.82, 0, 1);
    camY = 130 + t * 90;      // 130 → 220px
    camScale = 1 - t * 0.09;    // 1.0 → 0.91
    camOpacity = 1 - t * 0.40;   // 1.0 → 0.60
  } else {
    camY = 220;
    camScale = 0.91;
    camOpacity = 0.60;
  }

  return (
    <div
      className="envelope-container"
      style={{
        transform: `translateY(${camY}px) scale(${camScale})`,
        '--envelope-opacity': camOpacity,
      }}
    >
      <div className="envelope-wrapper">

        {/* Warm golden internal glow */}
        <div className="envelope-internal-glow" style={{ opacity: glowOpacity }} />

        {/* Envelope back plate */}
        <div className="envelope-backboard">
          <div className="inner-shadow-overlay" />
        </div>

        {/* Inner card (child) */}
        {children}

        {/* Top flap — rotates on X axis */}
        <div
          className={`top-flap-wrapper ${flapPassedHalfway ? 'behind-card' : 'in-front-of-card'}`}
          style={{ transform: `rotateX(${flapDeg}deg)` }}
        >
          {/* Outer face (visible when closed) */}
          <div className="top-flap-outer">
            <span className="outer-flap-text luxury-text">Lee Broom Members</span>
          </div>

          {/* Inner face (visible when open / folded back) */}
          <div className="top-flap-inner">
            <div className="inner-flap-lining" />
          </div>

          <WaxSeal scrollProgress={scrollProgress} onClick={onSealClick} />
        </div>

        {/* Side & bottom flaps */}
        <div className="envelope-flap left-flap" />
        <div className="envelope-flap right-flap" />
        <div className="envelope-flap bottom-flap" />

      </div>
    </div>
  );
}
