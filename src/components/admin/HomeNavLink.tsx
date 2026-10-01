'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'

export default function HomeNavLink() {
  const pathname = usePathname()
  const isActive = pathname === '/admin'

  return (
    <div style={{ marginBottom: '0.5rem', marginTop: '1rem', padding: '0 0.25rem' }}>
      <Link 
        href="/admin" 
        className={`nav__link ${isActive ? 'nav__link--active' : ''}`}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
      >
        <Home size={18} />
        <span>Dashboard / Home</span>
      </Link>
    </div>
  )
}
