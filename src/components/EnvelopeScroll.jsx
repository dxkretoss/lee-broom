import React, { useEffect, useState, useRef, useCallback } from 'react';
import Envelope from './Envelope';
import InnerCard from './InnerCard';
import Header from './Header';
import { ChevronDown } from 'lucide-react';

export default function EnvelopeScroll() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef(null);

  // Pure rAF scroll tracker — 1:1 with scroll bar, no lag
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const scrollTrackHeight = container.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, window.scrollY - container.offsetTop);
      const progress = Math.min(1, scrolled / scrollTrackHeight);
      setScrollProgress(progress);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  // Dark mode only at the very end — 0.90+ when portal is fully zoomed in
  const isDarkMode = scrollProgress > 0.90;

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Click seal → smooth scroll to start animation
  const handleSealClick = () => {
    if (!containerRef.current) return;
    const scrollTrackHeight = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: containerRef.current.offsetTop + scrollTrackHeight * 0.06,
      behavior: 'smooth',
    });
  };

  // Responsive scale
  const [scaleFactor, setScaleFactor] = useState(1);
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w < 480) setScaleFactor(Math.max(0.40, (w - 32) / 700));
      else if (w < 768) setScaleFactor(Math.max(0.55, (w - 48) / 700));
      else if (w < 1100) setScaleFactor((w - 80) / 700);
      else setScaleFactor(1);
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const showScrollHint = scrollProgress < 0.03;

  return (
    <div className="scroll-timeline-container" ref={containerRef}>
      <Header isDarkMode={isDarkMode} scrollProgress={scrollProgress} />

      {/*
        perspective MUST be on sticky-viewport — an element with NO transforms.
        If perspective is on envelope-scaler (which has scale()), the 3D chain breaks.
      */}
      <div className="sticky-viewport">

        <div
          className="scroll-instruction"
          style={{
            opacity: showScrollHint ? 1 : 0,
            transform: showScrollHint
              ? 'translateX(-50%) translateY(0)'
              : 'translateX(-50%) translateY(16px)',
          }}
        >
          <span className="luxury-text">Scroll Down</span>
          <ChevronDown size={14} className="chevron-animate" />
        </div>

        {/* Scale wrapper — does NOT carry perspective; just handles mobile scaling */}
        <div className="envelope-scaler" style={{ transform: `scale(${scaleFactor})` }}>
          <Envelope scrollProgress={scrollProgress} onSealClick={handleSealClick}>
            <InnerCard scrollProgress={scrollProgress} />
          </Envelope>
        </div>
      </div>

      <style>{`
        .scroll-timeline-container {
          position: relative;
          width: 100vw;
          /* 600vh — each animation stage feels crisp & deliberate */
          height: 600vh;
        }

        .sticky-viewport {
          position: sticky;
          top: 0;
          left: 0;
          z-index:99999;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          /* Perspective lives HERE — parent with no transforms */
          perspective: 1600px;
          perspective-origin: 50% 42%;
        }

        /* Scaling wrapper — no perspective here to avoid breaking the 3D chain */
        .envelope-scaler {
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center center;
          /* preserve-3d passes the perspective down through the scale transform */
          transform-style: preserve-3d;
        }

        .scroll-instruction {
          position: absolute;
          bottom: 40px;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(34, 31, 29, 0.50);
          transition: opacity 0.5s ease, transform 0.5s ease;
          pointer-events: none;
          z-index: 100;
        }

        .scroll-instruction span {
          font-size: 8.5px;
          letter-spacing: 0.35em;
          font-weight: 500;
        }

        body.dark-mode .scroll-instruction {
          color: var(--gold-primary);
        }

        .chevron-animate {
          animation: bounceSlow 1.8s infinite ease-in-out;
        }

        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}
