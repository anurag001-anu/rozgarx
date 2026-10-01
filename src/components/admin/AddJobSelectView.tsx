import React from 'react'
import Link from 'next/link'

export default function AddJobSelectView() {
  return (
    <div className="add-job-select-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Choose Job Type</h1>
        <Link href="/admin" style={{ color: '#FF6B00', textDecoration: 'none', fontWeight: 'bold' }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Select the type of job you want to post. Each type has a specialized posting form.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Private Job Card */}
        <Link href="/api/admin/job-context?type=private" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            backgroundColor: '#1f2937', 
            borderRadius: '1rem', 
            padding: '2rem', 
            border: '1px solid #374151',
            transition: 'transform 0.2s, borderColor 0.2s',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.transform = 'translateY(-4px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'none' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Post Private Job</h2>
            <p style={{ color: '#9ca3af', lineHeight: 1.5 }}>
              Standard form for private company jobs, MNCs, startups, and generic recruitments.
            </p>
          </div>
        </Link>

        {/* Government Job Card */}
        <Link href="/api/admin/job-context?type=government" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            backgroundColor: '#1f2937', 
            borderRadius: '1rem', 
            padding: '2rem', 
            border: '1px solid #374151',
            transition: 'transform 0.2s, borderColor 0.2s',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.transform = 'translateY(-4px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'none' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Post Government Job</h2>
            <p style={{ color: '#9ca3af', lineHeight: 1.5 }}>
              Advanced flexible form for SSC, Railway, UPSC, state boards and custom recruitment sections.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
