'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PlusCircle } from 'lucide-react'

export default function AddJobNavLink() {
  const pathname = usePathname()
  const isActive = pathname === '/admin/add-job'

  return (
    <div style={{ marginBottom: '1rem', marginTop: '0.5rem', padding: '0 0.25rem' }}>
      <Link 
        href="/admin/add-job" 
        className={`nav__link ${isActive ? 'nav__link--active' : ''}`}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          textDecoration: 'none',
          backgroundColor: '#FF6B00',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          fontWeight: 'bold'
        }}
      >
        <PlusCircle size={18} />
        <span>Add Job</span>
      </Link>
    </div>
  )
}
