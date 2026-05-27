import React from 'react';
import EnvelopeScroll from './components/EnvelopeScroll';

export default function App() {
  return (
    <>
      {/* Tactile Luxury Paper Grain */}
      <div className="noise-overlay" />

      {/* Dynamic Ambient Light Vignette */}
      <div className="ambient-vignette" />

      {/* Scroll Timeline Coordinator */}
      <EnvelopeScroll />
    </>
  );
}
