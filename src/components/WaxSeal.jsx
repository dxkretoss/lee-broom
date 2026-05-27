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
    </div>
  );
}
