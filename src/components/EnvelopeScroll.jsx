import React, { useEffect, useState, useRef, useCallback } from 'react';
import Envelope from './Envelope';
import InnerCard from './InnerCard';
import Header from './Header';
import { ChevronDown } from 'lucide-react';

export default function EnvelopeScroll() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dark mode triggers at 0.82 — when the card is zooming in
  const isDarkMode = scrollProgress > 0.75;

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    let targetProgress = 0;
    let currentProgress = 0;
    let rafId = null;

    // Smooth luxury physics lerp (0.06) for premium high-inertia motion
    const tick = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) < 0.0001) {
        currentProgress = targetProgress;
        setScrollProgress(targetProgress);
        rafId = null;
      } else {
        currentProgress += diff * 0.06;
        setScrollProgress(currentProgress);
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const scrollTrackHeight = container.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, window.scrollY - container.offsetTop);
      const progress = scrollTrackHeight > 0 ? Math.min(1, scrolled / scrollTrackHeight) : 0;

      targetProgress = progress;
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Click seal → smooth scroll to start of animation
  const handleSealClick = () => {
    if (!containerRef.current) return;
    const scrollTrackHeight = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: containerRef.current.offsetTop + scrollTrackHeight * 0.08,
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

  const showScrollHint = scrollProgress < 0.04;

  return (
    <div className="scroll-timeline-container" ref={containerRef}>

      <Header isDarkMode={isDarkMode} scrollProgress={scrollProgress} />

      <div className="sticky-viewport">
        <div className="scroll-instruction" style={{ opacity: showScrollHint ? 1 : 0, transform: showScrollHint ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(16px)' }}>
          <span className="luxury-text">Scroll Down</span>
          <ChevronDown size={14} className="chevron-animate" />
        </div>

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
          height: 500vh;
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
        }

        .envelope-scaler {
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center center;
          /* Perspective makes the 3D lid rotation visible */
          perspective: 1400px;
          perspective-origin: 50% 45%;
        }

        .scroll-instruction {
          position: absolute;
          bottom: 80px;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(34, 31, 29, 0.5);
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
