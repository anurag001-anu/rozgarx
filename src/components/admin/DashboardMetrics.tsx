'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardMetrics() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, usersRes, sourcesRes, updatesRes] = await Promise.all([
          fetch('/api/jobs?limit=5&sort=-createdAt'),
          fetch('/api/users?limit=1'),
          fetch('/api/job-sources?limit=5&where[healthStatus][equals]=Broken'),
          fetch('/api/sarkari-updates?limit=5&sort=-createdAt')
        ])

        const jobs = await jobsRes.json()
        const users = await usersRes.json()
        const brokenSources = await sourcesRes.json()
        const updates = await updatesRes.json()

        const totalJobsRes = await fetch('/api/jobs?limit=1')
        const activeJobsRes = await fetch('/api/jobs?limit=1&where[status][equals]=open')
        const govtJobsRes = await fetch('/api/jobs?limit=1&where[type][equals]=government')
        const privateJobsRes = await fetch('/api/jobs?limit=1&where[type][equals]=private')
        const closingSoonRes = await fetch('/api/jobs?limit=5&where[status][equals]=closing soon')

        const totalJobs = await totalJobsRes.json()
        const activeJobs = await activeJobsRes.json()
        const govtJobs = await govtJobsRes.json()
        const privateJobs = await privateJobsRes.json()
        const closingSoon = await closingSoonRes.json()

        setData({
          jobs: jobs.docs,
          usersTotal: users.totalDocs,
          brokenSources: brokenSources.docs,
          updates: updates.docs,
          totalJobsCount: totalJobs.totalDocs,
          activeJobsCount: activeJobs.totalDocs,
          govtJobsCount: govtJobs.totalDocs,
          privateJobsCount: privateJobs.totalDocs,
          closingSoonJobs: closingSoon.docs
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--theme-text, #64748b)' }}>Loading dashboard data...</div>
  }

  return (
    <div id="rx-dashboard" style={{ fontFamily: 'Inter, sans-serif', padding: '1rem 0 3rem 0' }}>
      {/* CSS Injection to Safely Hide Payload's Duplicate Default Collections on Dashboard */}
      <style dangerouslySetInnerHTML={{ __html: `
        #rx-dashboard ~ * {
          display: none !important;
        }
      `}} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--theme-text, #f8fafc)' }}>Dashboard</h1>
          <p style={{ margin: 0, color: 'var(--theme-elevation-400, #94a3b8)', fontSize: '0.9rem' }}>Welcome to RozgarX Operations Console</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/" target="_blank" style={{ 
            background: 'var(--theme-elevation-150, #1e293b)', 
            color: 'var(--theme-text, #f8fafc)', 
            padding: '0.6rem 1.25rem', 
            borderRadius: '8px', 
            textDecoration: 'none', 
            fontWeight: 600,
            border: '1px solid var(--theme-elevation-200, #334155)',
            transition: 'background 0.2s'
          }}>
            View Website
          </a>
          <Link href="/admin/add-job" style={{ 
            background: '#FF6B00', 
            color: 'white', 
            padding: '0.6rem 1.25rem', 
            borderRadius: '8px', 
            textDecoration: 'none', 
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(255, 107, 0, 0.25)',
            transition: 'transform 0.2s'
          }}>
            + Add New Job
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <KpiCard title="Total Jobs" value={data?.totalJobsCount || 0} color="#3b82f6" />
        <KpiCard title="Active Jobs" value={data?.activeJobsCount || 0} color="#10b981" />
        <KpiCard title="Govt Jobs" value={data?.govtJobsCount || 0} color="#FF6B00" />
        <KpiCard title="Private Jobs" value={data?.privateJobsCount || 0} color="#8b5cf6" />
        <KpiCard title="Total Users" value={data?.usersTotal || 0} color="#94a3b8" />
      </div>

      {/* 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={panelStyle}>
            <h3 style={panelTitleStyle}>Recently Added Jobs</h3>
            <ul style={listStyle}>
              {data?.jobs?.length ? data.jobs.map((job: any) => (
                <li key={job.id} style={listItemStyle}>
                  <div>
                    <Link href={`/admin/collections/jobs/${job.id}`} style={linkStyle}>{job.title}</Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-400, #64748b)', marginTop: '0.3rem' }}>
                      <span style={{ color: job.type === 'government' ? '#FF6B00' : '#8b5cf6', fontWeight: 600 }}>{job.type.toUpperCase()}</span> • {job.status.toUpperCase()}
                    </div>
                  </div>
                </li>
              )) : <li style={emptyItemStyle}>No recent jobs</li>}
            </ul>
          </div>

          <div style={panelStyle}>
            <h3 style={panelTitleStyle}>Closing Soon</h3>
            <ul style={listStyle}>
              {data?.closingSoonJobs?.length ? data.closingSoonJobs.map((job: any) => (
                <li key={job.id} style={listItemStyle}>
                  <div>
                    <Link href={`/admin/collections/jobs/${job.id}`} style={linkStyle}>{job.title}</Link>
                    <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '0.3rem', fontWeight: 500 }}>
                      Ends: {job.lastDate ? new Date(job.lastDate).toLocaleDateString() : 'No date'}
                    </div>
                  </div>
                </li>
              )) : <li style={emptyItemStyle}>No jobs closing soon</li>}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={panelStyle}>
            <h3 style={panelTitleStyle}>Latest Govt Updates</h3>
            <ul style={listStyle}>
              {data?.updates?.length ? data.updates.map((update: any) => (
                <li key={update.id} style={listItemStyle}>
                  <div>
                    <Link href={`/admin/collections/sarkari-updates/${update.id}`} style={linkStyle}>{update.title}</Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-400, #64748b)', marginTop: '0.3rem' }}>{update.category}</div>
                  </div>
                </li>
              )) : <li style={emptyItemStyle}>No recent updates</li>}
            </ul>
          </div>

          <div style={panelStyle}>
            <h3 style={panelTitleStyle}>Broken Job Sources</h3>
            <ul style={listStyle}>
              {data?.brokenSources?.length ? data.brokenSources.map((source: any) => (
                <li key={source.id} style={listItemStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Link href={`/admin/collections/job-sources/${source.id}`} style={linkStyle}>{source.name}</Link>
                      <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '0.3rem' }}>Needs attention</div>
                    </div>
                    <a href={source.sourceUrl} target="_blank" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none' }}>Test Link</a>
                  </div>
                </li>
              )) : <li style={emptyItemStyle}>All sources healthy ✅</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <div style={{ 
      background: 'var(--theme-elevation-50, #101A24)', 
      border: '1px solid var(--theme-elevation-150, #1e293b)', 
      padding: '1.5rem', 
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderTop: `2px solid ${color}`
    }}>
      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--theme-elevation-400, #94a3b8)', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.75rem' }}>{title}</div>
      <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--theme-text, #f8fafc)', lineHeight: 1 }}>{value}</div>
    </div>
  )
}

const panelStyle = {
  background: 'var(--theme-elevation-50, #101A24)',
  border: '1px solid var(--theme-elevation-150, #1e293b)',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
}

const panelTitleStyle = {
  margin: '0 0 1.25rem 0',
  fontSize: '1.1rem',
  fontWeight: '700',
  color: 'var(--theme-text, #f8fafc)'
}

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '1rem'
}

const listItemStyle = {
  borderBottom: '1px solid var(--theme-elevation-100, #1e293b)',
  paddingBottom: '1rem'
}

const emptyItemStyle = {
  color: 'var(--theme-elevation-400, #64748b)',
  fontSize: '0.9rem',
  fontStyle: 'italic',
  padding: '1rem 0'
}

const linkStyle = {
  color: 'var(--theme-text, #f8fafc)',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  display: 'block'
}
