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
   *  0.00 → 0.05  Seal fades away
   *  0.00 → 0.60  Top flap rotates open   (0° → -180°)
   *  ──── at 0.30: flap passes -90° → z-index swap, card starts rising
   *  0.30 → 0.82  Inner card slides up out of envelope
   *  0.82 → 1.00  Card zooms / portal reveals
   */

  // ── LID ROTATION ────────────────────────────────────────────────────────────
  // 0.00 → 0.60: lid sweeps all the way from 0° to -180°
  const flapDeg = mapRange(scrollProgress, 0, 0.60, 0, -180);
  const flapPassedHalfway = flapDeg < -90; // z-index handoff at -90°

  // ── INTERNAL GLOW ────────────────────────────────────────────────────────────
  // Glow appears as the lid opens, tracks lid progress (0.10 → 0.55)
  const glowOpacity = mapRange(scrollProgress, 0.10, 0.45, 0, 1);

  // ── ENVELOPE CAMERA PAN ─────────────────────────────────────────────────────
  // Shifts the envelope DOWN as the lid rotates upward so the rotating flap
  // is never clipped by the header. Then pushes further down as card slides out.
  let camY = 55;
  let camScale = 1;
  let camOpacity = 1;

  if (scrollProgress <= 0.60) {
    // Stage 1 (0 → 0.60): lid opens, envelope pans down 55px → 130px
    camY = mapRange(scrollProgress, 0, 0.60, 55, 130);
  } else if (scrollProgress <= 0.82) {
    // Stage 2 (0.60 → 0.82): card slides out, envelope retreats further & fades
    const t = mapRange(scrollProgress, 0.60, 0.82, 0, 1);
    camY     = 130 + t * 90;      // 130 → 220px
    camScale  = 1 - t * 0.09;    // 1.0 → 0.91
    camOpacity = 1 - t * 0.40;   // 1.0 → 0.60
  } else {
    camY       = 220;
    camScale   = 0.91;
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
        <div className="envelope-internal-glow" style={{ opacity: glowOpacity * camOpacity }} />

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
        </div>

        {/* Side & bottom flaps */}
        <div className="envelope-flap left-flap" />
        <div className="envelope-flap right-flap" />
        <div className="envelope-flap bottom-flap" />

        {/* Wax seal — sits on the fold seam above ALL flaps */}
        <WaxSeal scrollProgress={scrollProgress} onClick={onSealClick} />

      </div>

      <style>{`
        .envelope-container {
          position: relative;
          width: var(--envelope-width);
          height: var(--envelope-height);
          /* NO transform transition — all driven by scroll directly */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .envelope-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          box-shadow: 0 20px 50px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.10);
          border-radius: 4px;
        }

        /* ── Warm glow leaking from open envelope ── */
        .envelope-internal-glow {
          position: absolute;
          top: 5%;
          left: 5%;
          width: 90%;
          height: 90%;
          background: radial-gradient(circle, var(--gold-light) 0%, var(--gold-primary) 55%, transparent 100%);
          filter: blur(28px);
          z-index: 2;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        /* ── Base envelope body ── */
        .envelope-backboard {
          position: absolute;
          inset: 0;
          background-color: var(--paper-color);
          border-radius: 4px;
          z-index: 1;
          overflow: hidden;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.12);
          opacity: var(--envelope-opacity, 1);
        }

        .inner-shadow-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 18%);
        }

        /* ── 3D Lid ── */
        .top-flap-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          transform-origin: top center;
          transform-style: preserve-3d;
          opacity: var(--envelope-opacity, 1);
          /* NO transition — scroll scrubbed */
        }

        .top-flap-wrapper.in-front-of-card { z-index: 6; }
        .top-flap-wrapper.behind-card      { z-index: 2; }

        /* Outer lid face (the paper triangle pointing down, visible when closed) */
        .top-flap-outer {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, #f0e8d2 0%, var(--paper-color-top-outer) 100%);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          backface-visibility: hidden;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 36px;
          box-shadow: inset 0 3px 6px rgba(255,255,255,0.45);
        }

        .outer-flap-text {
          font-size: 10.5px;
          color: rgba(34,31,29,0.50);
          letter-spacing: 0.24em;
          text-shadow: 1px 1px 0 rgba(255,255,255,0.55);
          user-select: none;
        }

        /* Inner lid face (points UP when open — clip is mirrored) */
        .top-flap-inner {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, var(--paper-color-top-inner) 0%, #cbbfa7 100%);
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
          transform: rotateX(180deg);
          backface-visibility: hidden;
          z-index: 1;
          overflow: hidden;
        }

        .inner-flap-lining {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0,0,0,0.07) 0%, transparent 55%);
        }

        /* ── Side & Bottom flaps ── */
        .envelope-flap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 4;
          opacity: var(--envelope-opacity, 1);
        }

        .left-flap {
          background: linear-gradient(to right, var(--paper-color-left), #ccc0a4);
          clip-path: polygon(0 0, 51.5% 50%, 0 100%);
          filter: drop-shadow(4px 0 5px rgba(0,0,0,0.06));
        }

        .right-flap {
          background: linear-gradient(to left, var(--paper-color-right), #ccc0a4);
          clip-path: polygon(100% 0, 48.5% 50%, 100% 100%);
          filter: drop-shadow(-4px 0 5px rgba(0,0,0,0.06));
        }

        .bottom-flap {
          background: linear-gradient(to top, var(--paper-color-bottom), #c8bba2);
          clip-path: polygon(0 100%, 50% 46%, 100% 100%);
          z-index: 5;
          filter: drop-shadow(0 -4px 8px rgba(0,0,0,0.09));
        }
      `}</style>
    </div>
  );
}
