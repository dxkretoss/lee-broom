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
    </header>
  );
}
