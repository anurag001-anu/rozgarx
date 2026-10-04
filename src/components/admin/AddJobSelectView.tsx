'use client'
import React from 'react'
import Link from 'next/link'

export default function AddJobSelectView() {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.03em', color: '#f8fafc' }}>
          Create New Job
        </h1>
        <Link href="/admin" style={{ color: '#FF6B00', textDecoration: 'none', fontWeight: '600', padding: '0.5rem 1rem', background: 'rgba(255, 107, 0, 0.1)', borderRadius: '8px', transition: 'background 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 107, 0, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 107, 0, 0.1)'}
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1.15rem', maxWidth: '600px', lineHeight: 1.6 }}>
        Select the type of recruitment you are posting. Each option provides a highly specialized and secure workflow designed specifically for that sector.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Private Job Card */}
        <Link href="/api/admin/job-context?type=private" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            backgroundColor: '#101A24', 
            borderRadius: '16px', 
            padding: '2.5rem', 
            border: '1px solid #1e293b',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(0,0,0,0.7)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}></div>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px' }}>🏢</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>Post Private Job</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>
              Standard application form tailored for Private Companies, MNCs, Startups, and general sector recruitments.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 0 0', color: '#cbd5e1', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#3b82f6' }}>✓</span> Company Information</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#3b82f6' }}>✓</span> Standard Salary & Location</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#3b82f6' }}>✓</span> Direct External Apply URL</li>
            </ul>
          </div>
        </Link>

        {/* Government Job Card */}
        <Link href="/api/admin/job-context?type=government" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            backgroundColor: '#101A24', 
            borderRadius: '16px', 
            padding: '2.5rem', 
            border: '1px solid #1e293b',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(0,0,0,0.7)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #FF6B00, #f59e0b)' }}></div>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'rgba(255, 107, 0, 0.1)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px' }}>🏛️</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>Post Government Job</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>
              Advanced Builder for SSC, UPSC, Railway, Police, and all State/Central Govt notifications.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 0 0', color: '#cbd5e1', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#FF6B00' }}>✓</span> Flexible Vacancy Tables</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#FF6B00' }}>✓</span> Detailed Important Dates</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: '#FF6B00' }}>✓</span> Custom Notification Blocks</li>
            </ul>
          </div>
        </Link>
      </div>
    </div>
  )
}
