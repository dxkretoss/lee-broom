import React, { useState } from 'react';
import { ArrowRight, Check, Award, Compass, ShieldCheck } from 'lucide-react';

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

export default function InnerCard({ scrollProgress = 0 }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('Charles');
  const [email, setEmail] = useState('charles@design.com');
  const [region, setRegion] = useState('LONDON');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [password, setPassword] = useState('');

  // Guarantee scrollProgress is a valid number
  const progress = typeof scrollProgress === 'number' && !isNaN(scrollProgress) ? scrollProgress : 0;

  /**
   * CARD ANIMATION STAGES:
   *
   *  0.00 → 0.50  Card sits inside envelope, static (lid is rotating open - finishes at 200vh)
   *  0.50 → 0.70  Card slides UP out of envelope (flap is fully open)
   *  0.70 → 1.00  Card zooms toward viewer & portal reveals
   */

  // Card slide (0.50 → 0.70): starts only after flap is fully open
  const cardT = clamp((progress - 0.50) / (0.70 - 0.50), 0, 1);
  const cardTranslateY = -cardT * 370;  // 0 nested naturally inside pocket → -370 fully emerged
  const cardScale = 0.96 + cardT * 0.04;    // 0.96 → 1.00
  let cardZIndex = cardT > 0 ? 3 : 2;

  // Card zoom-in (0.70 → 1.00)
  let zoomScale = 1;
  let zoomTranslateY = 0;
  let showPortal = false;

  if (progress > 0.70) {
    const zoomT = clamp((progress - 0.70) / (1.00 - 0.70), 0, 1);
    zoomScale = 1 + zoomT * 0.22;
    zoomTranslateY = zoomT * 150; // Center the card perfectly in the viewport by countering envelope offset
    showPortal = zoomT > 0.18;
    cardZIndex = 20;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'login' && !email) return;
    if (activeTab === 'register' && (!name || !email)) return;
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setFormSubmitted(true); }, 1200);
  };

  const totalTranslateY = cardTranslateY + zoomTranslateY;

  return (
    <div
      className={`inner-card-container ${progress > 0.82 ? 'active-portal' : ''}`}
      style={{
        transform: `translateY(${totalTranslateY}px) scale(${cardScale * zoomScale})`,
        zIndex: cardZIndex,
        clipPath: 'none',
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
                <div className="portal-tabs">
                  <button type="button" className={`tab-btn luxury-text ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Sign In</button>
                  <button type="button" className={`tab-btn luxury-text ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Register</button>
                </div>
              </div>

              <div className="form-fields">
                {activeTab === 'register' && (
                  <div className="input-group animate-item">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder=" " id="fullname" />
                    <label htmlFor="fullname" className="luxury-text">Full Name</label>
                    <div className="input-border-glow" />
                  </div>
                )}

                <div className="input-group animate-item">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder=" " id="email" />
                  <label htmlFor="email" className="luxury-text">Email Address</label>
                  <div className="input-border-glow" />
                </div>

                <div className="input-group animate-item">
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder=" " id="password" />
                  <label htmlFor="password" className="luxury-text">Password</label>
                  <div className="input-border-glow" />
                </div>

                {activeTab === 'register' && (
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
                )}
              </div>

              <button type="submit" className={`submit-btn luxury-text animate-item ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                {isLoading
                  ? <span>Verifying Credentials...</span>
                  : <><span>{activeTab === 'login' ? 'Sign In' : 'Register Account'}</span><ArrowRight size={14} className="btn-icon" /></>}
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
                  { Icon: Compass, title: 'Catalogues', desc: 'Immediate pricing & private collection access' },
                  { Icon: Award, title: 'Priority Booking', desc: 'Exclusive preview slots during London Design Festival' },
                  { Icon: ShieldCheck, title: 'Trade VIP', desc: 'Direct priority line with custom showroom concierge' },
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
    </div>
  );
}
