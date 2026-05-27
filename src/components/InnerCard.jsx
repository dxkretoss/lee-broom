import React, { useState } from 'react';
import { ArrowRight, Check, Award, Compass, ShieldCheck } from 'lucide-react';

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

export default function InnerCard({ scrollProgress }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('Charles');
  const [email, setEmail] = useState('charles@design.com');
  const [region, setRegion] = useState('LONDON');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * CARD ANIMATION STAGES:
   *
   *  0.00 → 0.30  Card sits inside envelope, static (lid is rotating open)
   *  0.30 → 0.82  Card slides UP out of envelope (flap has passed -90° so card is in front)
   *  0.82 → 1.00  Card zooms toward viewer & portal reveals
   */

  // Card slide (0.30 → 0.82): starts only after flap passes -90°
  const cardT = clamp((scrollProgress - 0.30) / (0.82 - 0.30), 0, 1);
  const cardTranslateY = 10 - cardT * 380;  // +10 tucked → -370 fully emerged
  const cardScale = 0.96 + cardT * 0.04;    // 0.96 → 1.00
  let cardZIndex = cardT > 0 ? 3 : 2;

  // Card zoom-in (0.82 → 1.00)
  let zoomScale = 1;
  let zoomTranslateY = 0;
  let showPortal = false;

  if (scrollProgress > 0.82) {
    const zoomT = clamp((scrollProgress - 0.82) / (1.00 - 0.82), 0, 1);
    zoomScale = 1 + zoomT * 0.22;
    zoomTranslateY = zoomT * 90;
    showPortal = zoomT > 0.18;
    cardZIndex = 20;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setFormSubmitted(true); }, 1200);
  };

  return (
    <div
      className={`inner-card-container ${scrollProgress > 0.82 ? 'active-portal' : ''}`}
      style={{
        transform: `translateY(${cardTranslateY + zoomTranslateY}px) scale(${cardScale * zoomScale})`,
        zIndex: cardZIndex,
        /* NO transform transition — scroll scrubbed */
      }}
    >
      <div className="card-texture" />
      <div className="card-face">

        {/* ── Invitation view (visible while card is inside or just emerging) ── */}
        <div className={`invitation-view ${showPortal ? 'fade-out' : ''}`}>
          <div className="invitation-header">
            <span className="luxury-text subtitle">Invitation</span>
            <div className="gold-crest">LB</div>
          </div>
          <div className="invitation-body">
            <h2 className="luxury-heading invitation-title">Lee Broom Members</h2>
            <div className="divider-line" />
            <p className="invitation-desc luxury-text">
              Access to Trade Portal &amp; Exclusive Membership
            </p>
          </div>
          <div className="invitation-footer">
            <span className="scroll-indicator-text luxury-text">Scroll to open portal</span>
          </div>
        </div>

        {/* ── Full interactive portal (reveals after card zooms in) ── */}
        <div className={`portal-view ${showPortal ? 'fade-in' : ''}`}>
          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className="portal-form">
              <div className="portal-header animate-item">
                <div className="mini-crest">LB</div>
                <h3 className="luxury-heading portal-title">Welcome {name || 'Guest'}</h3>
                <p className="portal-subtitle">Please complete your registration to activate access.</p>
              </div>

              <div className="form-fields">
                <div className="input-group animate-item">
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder=" " id="fullname" />
                  <label htmlFor="fullname" className="luxury-text">Full Name</label>
                  <div className="input-border-glow" />
                </div>
                <div className="input-group animate-item">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder=" " id="email" />
                  <label htmlFor="email" className="luxury-text">Email Address</label>
                  <div className="input-border-glow" />
                </div>
                <div className="region-selector animate-item">
                  <span className="selector-label luxury-text">Primary Showroom / Region</span>
                  <div className="region-buttons">
                    {['LONDON', 'NEW YORK', 'PARIS', 'TOKYO'].map(r => (
                      <button key={r} type="button"
                        className={`region-btn luxury-text ${region === r ? 'active' : ''}`}
                        onClick={() => setRegion(r)}>{r}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button type="submit" className={`submit-btn luxury-text animate-item ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                {isLoading
                  ? <span>Verifying Credentials...</span>
                  : <><span>Request Member Access</span><ArrowRight size={14} className="btn-icon" /></>}
              </button>
            </form>
          ) : (
            <div className="portal-success">
              <div className="success-icon-wrapper animate-pop">
                <Check size={36} className="success-icon" />
              </div>
              <h3 className="luxury-heading success-title animate-item">Membership Confirmed</h3>
              <div className="divider-line" />
              <p className="success-desc animate-item">
                Welcome, <strong>{name}</strong>. Your executive credentials have been validated for the <strong>{region}</strong> showroom portal.
              </p>
              <div className="privilege-cards">
                {[
                  { Icon: Compass,    title: 'Catalogues',      desc: 'Immediate pricing & private collection access' },
                  { Icon: Award,      title: 'Priority Booking', desc: 'Exclusive preview slots during London Design Festival' },
                  { Icon: ShieldCheck,title: 'Trade VIP',        desc: 'Direct priority line with custom showroom concierge' },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="privilege-item animate-item">
                    <Icon size={18} className="privilege-icon" />
                    <div>
                      <h4 className="luxury-text">{title}</h4>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setFormSubmitted(false)} className="reset-btn luxury-text animate-item">
                Edit Registration Details
              </button>
            </div>
          )}
        </div>

      </div>

      <style>{`
        .inner-card-container {
          position: absolute;
          top: 15px;
          left: 20px;
          width: calc(100% - 40px);
          height: calc(100% - 30px);
          background-color: #ffffff;
          border-radius: 2px;
          box-shadow:
            0 4px 12px rgba(0,0,0,0.09),
            0 1px 3px rgba(0,0,0,0.05),
            inset 0 0 0 1px rgba(195,166,125,0.15);
          overflow: hidden;
          /* NO transform transition — scroll-scrubbed */
        }

        .inner-card-container.active-portal {
          box-shadow:
            0 30px 70px rgba(0,0,0,0.42),
            0 0 45px rgba(195,166,125,0.12),
            inset 0 0 0 1px rgba(195,166,125,0.4);
        }

        .card-texture {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          z-index: 2;
        }

        .card-face {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .divider-line {
          width: 60px;
          height: 1px;
          background-color: var(--gold-primary);
          margin: 18px auto;
        }

        /* ── Invitation view ── */
        .invitation-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          width: 100%;
          text-align: center;
          transition: opacity 0.4s ease, transform 0.4s ease;
          opacity: 1;
        }

        .invitation-view.fade-out {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.96) translateY(-8px);
        }

        .invitation-header .subtitle {
          font-size: 10px;
          color: var(--gold-dark);
          letter-spacing: 0.3em;
          display: block;
          margin-bottom: 10px;
        }

        .gold-crest {
          font-family: var(--font-serif);
          font-size: 24px;
          font-weight: 500;
          color: var(--gold-dark);
          border: 1px solid var(--gold-primary);
          width: 50px; height: 50px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          margin: 0 auto;
        }

        .invitation-title {
          font-size: 22px;
          color: var(--text-dark);
          letter-spacing: 0.22em;
        }

        .invitation-desc {
          font-size: 9.5px;
          color: rgba(34,31,29,0.6);
          line-height: 1.9;
          max-width: 280px;
          margin: 0 auto;
        }

        .scroll-indicator-text {
          font-size: 8px;
          color: var(--gold-primary);
          letter-spacing: 0.25em;
          animation: floatSlow 2s infinite ease-in-out;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* ── Portal view ── */
        .portal-view {
          position: absolute;
          inset: 0;
          padding: 44px 50px;
          opacity: 0;
          pointer-events: none;
          transform: scale(1.04) translateY(8px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: radial-gradient(circle at 50% 50%, #ffffff 0%, #faf8f5 100%);
        }

        .portal-view.fade-in {
          opacity: 1;
          pointer-events: all;
          transform: scale(1) translateY(0);
        }

        .mini-crest {
          font-family: var(--font-serif);
          font-size: 15px;
          color: var(--gold-dark);
          border: 1px solid var(--gold-primary);
          width: 30px; height: 30px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .portal-title {
          font-size: 18px;
          color: var(--text-dark);
          letter-spacing: 0.18em;
          margin-bottom: 5px;
        }

        .portal-subtitle {
          font-size: 11px;
          color: rgba(34,31,29,0.5);
          font-weight: 300;
          margin-bottom: 22px;
        }

        .portal-form { width: 100%; display: flex; flex-direction: column; }

        .form-fields { display: flex; flex-direction: column; gap: 18px; margin-bottom: 22px; }

        .input-group { position: relative; width: 100%; }

        .input-group input {
          width: 100%;
          padding: 10px 0;
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--text-dark);
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(0,0,0,0.12);
          outline: none;
        }

        .input-group label {
          position: absolute;
          left: 0; top: 10px;
          font-size: 9px;
          color: rgba(34,31,29,0.4);
          letter-spacing: 0.14em;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .input-group input:focus ~ label,
        .input-group input:not(:placeholder-shown) ~ label {
          top: -10px; font-size: 8px; color: var(--gold-dark);
        }

        .input-border-glow {
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: var(--gold-primary);
          box-shadow: 0 0 10px var(--gold-glow);
          transition: width 0.4s ease;
        }

        .input-group input:focus ~ .input-border-glow { width: 100%; }
        .input-group input:focus { border-bottom-color: transparent; }

        .region-selector { text-align: left; }

        .selector-label {
          font-size: 8px;
          color: rgba(34,31,29,0.4);
          letter-spacing: 0.14em;
          display: block;
          margin-bottom: 7px;
        }

        .region-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 7px;
        }

        .region-btn {
          padding: 8px 3px;
          font-size: 8px;
          background: transparent;
          border: 1px solid rgba(0,0,0,0.08);
          color: rgba(34,31,29,0.6);
          cursor: pointer;
          border-radius: 1px;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }

        .region-btn:hover { border-color: var(--gold-primary); color: var(--text-dark); }
        .region-btn.active { background: var(--text-dark); border-color: var(--text-dark); color: #fff; }

        .submit-btn {
          width: 100%;
          padding: 13px 20px;
          background: var(--gold-dark);
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(139,110,75,0.2);
          transition: background 0.25s, box-shadow 0.25s;
        }

        .submit-btn:hover { background: var(--text-dark); box-shadow: 0 6px 20px rgba(0,0,0,0.22); }
        .submit-btn .btn-icon { transition: transform 0.3s ease; }
        .submit-btn:hover .btn-icon { transform: translateX(4px); }
        .submit-btn.loading { background: rgba(139,110,75,0.6); pointer-events: none; }

        /* ── Success state ── */
        .portal-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          overflow-y: auto;
        }

        .success-icon-wrapper {
          width: 58px; height: 58px;
          border-radius: 50%;
          background: rgba(195,166,125,0.1);
          border: 1.5px solid var(--gold-primary);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold-dark);
          margin-bottom: 18px;
          animation: scaleUp 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
        }

        .success-title { font-size: 17px; color: var(--text-dark); letter-spacing: 0.2em; }

        .success-desc {
          font-size: 12px;
          color: rgba(34,31,29,0.6);
          line-height: 1.7;
          max-width: 380px;
          margin-bottom: 22px;
        }

        .success-desc strong { color: var(--text-dark); }

        .privilege-cards {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 22px;
          text-align: left;
        }

        .privilege-item {
          display: flex;
          gap: 12px;
          padding: 9px 12px;
          background: rgba(195,166,125,0.05);
          border-left: 2px solid var(--gold-primary);
        }

        .privilege-icon { color: var(--gold-dark); flex-shrink: 0; margin-top: 2px; }
        .privilege-item h4 { font-size: 8.5px; color: var(--text-dark); font-weight: 600; margin-bottom: 2px; }
        .privilege-item p { font-size: 10.5px; color: rgba(34,31,29,0.5); font-weight: 300; }

        .reset-btn {
          font-size: 8px;
          background: transparent;
          border: none;
          color: rgba(34,31,29,0.4);
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .reset-btn:hover { color: var(--gold-dark); }

        /* ── Staggered entrance animations ── */
        .active-portal .animate-item {
          animation: slideUpIn 0.7s cubic-bezier(0.25,1,0.5,1) both;
        }
        .active-portal .animate-item:nth-child(1) { animation-delay: 0.05s; }
        .active-portal .animate-item:nth-child(2) { animation-delay: 0.15s; }
        .active-portal .animate-item:nth-child(3) { animation-delay: 0.25s; }
        .active-portal .animate-item:nth-child(4) { animation-delay: 0.35s; }

        @keyframes slideUpIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleUp {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .card-face { padding: 20px; }
          .portal-view { padding: 22px 18px; }
          .invitation-title { font-size: 18px; }
          .region-buttons { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
