import React from 'react';

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

export default function WaxSeal({ scrollProgress, onClick }) {
  // Seal shrinks and fades out between scroll 0.0 → 0.08
  const opacity = 1 - mapRange(scrollProgress, 0, 0.08, 0, 1);
  const scale   = 1 - mapRange(scrollProgress, 0, 0.08, 0, 0.25);
  const isGone  = scrollProgress > 0.10;

  return (
    <div
      className="wax-seal-container"
      onClick={isGone ? undefined : onClick}
      style={{
        opacity,
        transform: `translateX(-50%) translateY(-50%) scale(${scale})`,
        pointerEvents: isGone ? 'none' : 'all',
      }}
    >
      <div className="wax-seal">
        <div className="seal-outer-drip" />
        <div className="seal-body">
          <div className="seal-inner-ring">
            <span className="seal-monogram">LB</span>
          </div>
        </div>
      </div>

      <style>{`
        .wax-seal-container {
          position: absolute;
          /* Center of envelope = fold seam between all four flaps */
          top: 50%;
          left: 50%;
          width: 86px;
          height: 86px;
          cursor: pointer;
          /* z-index above all flaps (bottom-flap: 5, top-flap: 6) */
          z-index: 15;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.42));
          transform-style: preserve-3d;
          backface-visibility: hidden;
          /* No transition — scroll-scrubbed */
        }

        .wax-seal-container:hover {
          filter: drop-shadow(0 8px 16px rgba(195,166,125,0.32));
        }

        .wax-seal {
          position: relative;
          width: 100%; height: 100%;
          background: radial-gradient(circle at 34% 34%, #2a2826 0%, #171514 60%, #0d0c0b 100%);
          border-radius: 50% 48% 52% 49% / 50% 52% 48% 50%;
          box-shadow: inset 2px 2px 4px rgba(255,255,255,0.14), inset -3px -3px 6px rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
        }

        .seal-outer-drip {
          position: absolute;
          top: -2px; left: -4px; right: -3px; bottom: -5px;
          background: #171514;
          z-index: -1;
          border-radius: 46% 54% 48% 52% / 53% 47% 53% 47%;
          box-shadow: inset 1px 1px 3px rgba(255,255,255,0.09),
                      inset -2px -2px 4px rgba(0,0,0,0.8),
                      0 4px 6px rgba(0,0,0,0.3);
          opacity: 0.95;
        }

        .seal-body {
          width: 100%; height: 100%;
          border-radius: 50%;
          border: 4px solid #1a1817;
          background: radial-gradient(circle at 40% 40%, #242220 0%, #151312 80%);
          box-shadow: inset 1px 1px 3px rgba(255,255,255,0.07),
                      inset -2px -2px 4px rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seal-inner-ring {
          width: 82%; height: 82%;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.6);
          background: radial-gradient(circle at 40% 40%, #1a1817 0%, #110f0e 100%);
          box-shadow: inset 2px 2px 5px rgba(0,0,0,0.9),
                      inset -2px -2px 5px rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seal-monogram {
          font-family: var(--font-serif);
          font-size: 26px;
          font-weight: 500;
          color: #12100f;
          letter-spacing: -0.05em;
          text-shadow: 1px 1px 1px rgba(255,255,255,0.07), -1px -1px 2px rgba(0,0,0,0.9);
          user-select: none;
        }
      `}</style>
    </div>
  );
}
