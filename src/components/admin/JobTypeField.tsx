'use client'
import React, { useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation'

export default function JobTypeField({ path, required }: { path: string, required?: boolean }) {
  const { value, setValue } = useField<string>({ path })
  const searchParams = useSearchParams()
  const jobType = searchParams.get('jobType')

  useEffect(() => {
    if (jobType === 'government' && value !== 'government') {
      setValue('government')
    } else if (jobType === 'private' && value !== 'private') {
      setValue('private')
    }
  }, [jobType, value, setValue])

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
        Job Type {required && <span className="required" style={{color: 'red'}}>*</span>}
      </label>
      <div style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', backgroundColor: value === 'government' ? '#eff6ff' : value === 'private' ? '#f0fdf4' : '#f3f4f6', color: value === 'government' ? '#1d4ed8' : value === 'private' ? '#15803d' : '#374151', border: `1px solid ${value === 'government' ? '#bfdbfe' : value === 'private' ? '#bbf7d0' : '#d1d5db'}`, borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600 }}>
        {value === 'government' ? '🏛️ Government Job' : value === 'private' ? '🏢 Private Job' : 'Select Type'}
      </div>
      <input type="hidden" name={path} value={value || ''} />
    </div>
  )
}
