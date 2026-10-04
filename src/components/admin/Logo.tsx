import React from 'react';

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #FF6B00 0%, #f59e0b 100%)', 
        color: 'white', 
        fontWeight: 'bold', 
        padding: '0.35rem 0.6rem', 
        borderRadius: '6px', 
        fontSize: '1.25rem', 
        lineHeight: 1,
        boxShadow: '0 2px 8px rgba(255, 107, 0, 0.3)'
      }}>
        RX
      </div>
      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--theme-text, #f8fafc)', letterSpacing: '-0.02em' }}>
        Rozgar<span style={{ color: '#FF6B00' }}>X</span>
      </span>
    </div>
  );
}
