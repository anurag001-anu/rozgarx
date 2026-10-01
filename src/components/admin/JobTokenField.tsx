'use client'
import React, { useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation'

export default function JobTokenField({ path }: { path: string }) {
  const { value, setValue } = useField<string>({ path })
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token && value !== token) {
      setValue(token)
    }
  }, [token, value, setValue])

  // Completely hidden, but exists in the form state
  return <input type="hidden" name={path} value={value || ''} />
}
