import React from 'react';

export default function Header({ isDarkMode, scrollProgress }) {
  // Determine if we should show the member name based on scroll progress
  // Image 4 shows "CHARLES - DESIGNER" in place of "MEMBERS" when fully scrolled
  const showMemberDetails = scrollProgress > 0.82;

  return (
    <header className={`luxury-header ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-container">
        {/* Left Navigation */}
        <nav className="nav-group left-nav">
          <a href="#products" className="nav-link luxury-text">Products</a>
          <span className="nav-separator">•</span>
          <a href="#universe" className="nav-link luxury-text">Universe</a>
        </nav>

        {/* Brand Logo */}
        <div className="brand-logo">
          <a href="/" className="logo-text luxury-heading">
            Lee Broom
          </a>
        </div>

        {/* Right Navigation */}
        <nav className="nav-group right-nav">
          <div className="members-wrapper">
            <a 
              href="#members" 
              className={`nav-link luxury-text active-member-link ${showMemberDetails ? 'show-details' : ''}`}
            >
              <span className="link-default">Members</span>
              <span className="link-active-detail">Charles – Designer</span>
            </a>
          </div>
          <span className="nav-separator">•</span>
          <a href="#contact" className="nav-link luxury-text">Contact</a>
        </nav>
      </div>
      
      <style>{`
        .luxury-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          z-index: 1000;
          background-color: transparent;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .luxury-header.dark {
          background-color: var(--bg-dark);
          border-bottom: 1px solid rgba(195, 166, 125, 0.15);
        }

        .header-container {
          width: 100%;
          max-width: 1400px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-group {
          display: flex;
          align-items: center;
          gap: 15px;
          width: 30%;
        }

        .left-nav {
          justify-content: flex-start;
        }

        .right-nav {
          justify-content: flex-end;
        }

        .nav-separator {
          font-size: 8px;
          color: rgba(0, 0, 0, 0.3);
          transition: color 0.8s ease;
        }

        .luxury-header.dark .nav-separator {
          color: var(--gold-primary);
        }

        .nav-link {
          text-decoration: none;
          color: rgba(34, 31, 29, 0.7);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.18em;
          position: relative;
          padding: 4px 0;
        }

        .luxury-header.dark .nav-link {
          color: rgba(245, 239, 230, 0.7);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background-color: var(--text-dark);
          transition: width 0.3s ease;
        }

        .luxury-header.dark .nav-link::after {
          background-color: var(--gold-primary);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* Logo styling */
        .brand-logo {
          width: 40%;
          text-align: center;
        }

        .logo-text {
          font-size: 30px;
          color: var(--text-dark);
          text-decoration: none;
          letter-spacing: 0.28em;
          display: inline-block;
          transform: translateY(0);
          transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .luxury-header.dark .logo-text {
          color: var(--gold-light);
          text-shadow: 0 0 15px rgba(195, 166, 125, 0.2);
        }

        /* Members transitions - morphs to user name when active */
        .members-wrapper {
          position: relative;
          height: 20px;
          overflow: hidden;
          min-width: 90px;
          text-align: right;
        }

        .active-member-link {
          display: flex;
          flex-direction: column;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          font-weight: 500;
        }

        .active-member-link .link-default {
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-weight: 600;
          color: var(--text-dark);
        }

        .luxury-header.dark .active-member-link .link-default {
          color: var(--gold-light);
        }

        .active-member-link .link-active-detail {
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          color: var(--gold-primary);
          font-family: var(--font-sans);
          letter-spacing: 0.12em;
          font-weight: 500;
          white-space: nowrap;
        }

        .active-member-link.show-details {
          transform: translateY(-20px);
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .luxury-header {
            height: 70px;
            padding: 0 4%;
          }
          
          .logo-text {
            font-size: 20px;
            letter-spacing: 0.2em;
          }

          .nav-separator {
            display: none;
          }

          .left-nav {
            display: none;
          }

          .right-nav {
            width: 50%;
          }

          .brand-logo {
            width: 50%;
            text-align: left;
          }
        }
      `}</style>
    </header>
  );
}
