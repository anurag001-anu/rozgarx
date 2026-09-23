import React from 'react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF6B00"/>
          <path d="M2 17L12 22L22 17" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme-text, #fff)' }}>
          Rozgar<span style={{ color: '#FF6B00' }}>X</span>
        </span>
      </div>
      <span style={{ fontSize: '0.65rem', color: 'var(--theme-elevation-400, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Admin Console
      </span>
    </div>
  )
}
