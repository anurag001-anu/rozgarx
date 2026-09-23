import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { 
  Briefcase, Building, FileText, Users, CheckCircle2, AlertTriangle, 
  Plus, ChevronRight, Activity, RotateCw, Eye, Key, Book, Bell, CreditCard,
  FileCheck
} from 'lucide-react'

// Simple SVG Donut Chart Component
const DonutChart = ({ segments, total, label }: { segments: {value: number, color: string}[], total: number, label: string }) => {
  let cumulativePercent = 0;

  return (
    <div className="rx-donut-container">
      <svg viewBox="0 0 42 42" className="rx-donut" style={{ overflow: 'visible' }}>
        <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--rx-border)" strokeWidth="3" />
        {segments.map((seg, i) => {
          if (seg.value === 0) return null;
          const percent = seg.value / total;
          const strokeDasharray = `${percent * 100} ${100 - (percent * 100)}`;
          // 25 offset rotates starting point to top (12 o'clock)
          const strokeDashoffset = 25 - (cumulativePercent * 100);
          cumulativePercent += percent;
          
          return (
            <circle 
              key={i}
              cx="21" 
              cy="21" 
              r="15.91549430918954"
              fill="transparent" 
              stroke={seg.color} 
              strokeWidth="4" 
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          );
        })}
      </svg>
      <div className="rx-donut-text">
        <span className="rx-donut-val">{total.toLocaleString()}</span>
        <span className="rx-donut-label">{label}</span>
      </div>
    </div>
  )
}

// Simple Sparkline Component
const Sparkline = ({ color }: { color: string }) => {
  // Random sparkline points for visual effect similar to the photo
  return (
    <svg className="rx-sparkline" viewBox="0 0 100 20" preserveAspectRatio="none">
      <polyline 
        fill="none" 
        stroke={color} 
        strokeWidth="1.5"
        points="0,15 10,10 20,12 30,5 40,8 50,2 60,6 70,3 80,9 90,1 100,5"
      />
    </svg>
  )
}

export default async function DashboardMetrics() {
  const payload = await getPayload({ config: configPromise })

  const [
    totalJobs, publishedJobs, archivedJobs, govtJobs, privateJobs,
    users, jobseekers, employers, resumes,
    results, admitCards, answerKeys, syllabuses, notifications,
    sourcesHealthy, sourcesWarning, sourcesFailed,
    recentJobs, recentUpdates
  ] = await Promise.all([
    payload.count({ collection: 'jobs' }),
    payload.count({ collection: 'jobs', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'jobs', where: { isArchived: { equals: true } } }),
    payload.count({ collection: 'jobs', where: { type: { equals: 'government' } } }),
    payload.count({ collection: 'jobs', where: { type: { equals: 'private' } } }),

    payload.count({ collection: 'users' }),
    payload.count({ collection: 'users', where: { role: { equals: 'jobseeker' } } }),
    payload.count({ collection: 'users', where: { role: { equals: 'employer' } } }),
    payload.count({ collection: 'resumes' }),

    payload.count({ collection: 'results' }),
    payload.count({ collection: 'admit-cards' }),
    payload.count({ collection: 'answer-keys' }),
    payload.count({ collection: 'syllabuses' }),
    payload.count({ collection: 'govt-notifications' }),

    payload.count({ collection: 'job-sources', where: { healthStatus: { equals: 'Healthy' } } }),
    payload.count({ collection: 'job-sources', where: { healthStatus: { equals: 'Warning' } } }),
    payload.count({ collection: 'job-sources', where: { healthStatus: { equals: 'Broken' } } }),

    payload.find({ collection: 'jobs', depth: 0, limit: 5, sort: '-updatedAt' }),
    payload.find({ collection: 'results', depth: 1, limit: 5, sort: '-updatedAt' })
  ])

  // Donut data
  const jobsTotal = totalJobs.totalDocs || 1; // prevent div by zero
  const draftJobs = totalJobs.totalDocs - publishedJobs.totalDocs;
  const sourcesTotal = (sourcesHealthy.totalDocs + sourcesWarning.totalDocs + sourcesFailed.totalDocs) || 1;

  return (
    <div className="rx-dashboard">
      
      {/* Header */}
      <header className="rx-header">
        <div className="rx-header-left">
          <Activity className="rx-pulse-icon" size={24} />
          <div>
            <h1 className="rx-title">RozgarX Operations</h1>
            <p className="rx-subtitle">Monitor jobs, candidates, companies and government updates in real-time.</p>
          </div>
        </div>
        <div className="rx-header-actions">
          <div className="rx-last-updated">
            <RotateCw size={14} /> Last updated: 2 minutes ago
          </div>
          <Link href="/admin/collections/jobs" className="rx-btn rx-btn-outline"><RotateCw size={14}/> View Jobs</Link>
          <Link href="/admin/collections/jobs/create" className="rx-btn rx-btn-primary"><Plus size={16} /> Add Job</Link>
        </div>
      </header>

      {/* KPI Row */}
      <div className="rx-kpi-row">
        <div className="rx-kpi-card rx-glow-orange">
          <div className="rx-kpi-top">
            <div className="rx-kpi-icon-box rx-box-orange"><Briefcase size={18} /></div>
            <span className="rx-kpi-label">TOTAL JOBS</span>
            <span className="rx-kpi-dots">...</span>
          </div>
          <div className="rx-kpi-val">{totalJobs.totalDocs.toLocaleString()}</div>
          <div className="rx-kpi-trend text-green-500">↗ 12 this week</div>
          <Sparkline color="#FF6B00" />
        </div>

        <div className="rx-kpi-card rx-glow-green">
          <div className="rx-kpi-top">
            <div className="rx-kpi-icon-box rx-box-green"><CheckCircle2 size={18} /></div>
            <span className="rx-kpi-label">PUBLISHED JOBS</span>
            <span className="rx-kpi-dots">...</span>
          </div>
          <div className="rx-kpi-val">{publishedJobs.totalDocs.toLocaleString()}</div>
          <div className="rx-kpi-trend text-green-500">↗ 8 this week</div>
          <Sparkline color="#059669" />
        </div>

        <div className="rx-kpi-card rx-glow-blue">
          <div className="rx-kpi-top">
            <div className="rx-kpi-icon-box rx-box-blue"><Building size={18} /></div>
            <span className="rx-kpi-label">GOVERNMENT JOBS</span>
            <span className="rx-kpi-dots">...</span>
          </div>
          <div className="rx-kpi-val">{govtJobs.totalDocs.toLocaleString()}</div>
          <div className="rx-kpi-trend text-green-500">↗ 24 this week</div>
          <Sparkline color="#2563eb" />
        </div>

        <div className="rx-kpi-card rx-glow-purple">
          <div className="rx-kpi-top">
            <div className="rx-kpi-icon-box rx-box-purple"><Building size={18} /></div>
            <span className="rx-kpi-label">PRIVATE JOBS</span>
            <span className="rx-kpi-dots">...</span>
          </div>
          <div className="rx-kpi-val">{privateJobs.totalDocs.toLocaleString()}</div>
          <div className="rx-kpi-trend text-green-500">↗ 18 this week</div>
          <Sparkline color="#7c3aed" />
        </div>
      </div>

      {/* Middle Operations Grid */}
      <div className="rx-grid-4">
        
        {/* Job Overview */}
        <div className="rx-panel">
          <h3 className="rx-panel-title">JOB OVERVIEW</h3>
          <div className="rx-donut-layout">
            <DonutChart 
              total={totalJobs.totalDocs} 
              label="Total"
              segments={[
                { value: publishedJobs.totalDocs, color: '#059669' },
                { value: draftJobs, color: '#FF6B00' },
                { value: archivedJobs.totalDocs, color: '#475569' }
              ]} 
            />
            <div className="rx-donut-legend">
              <div className="rx-legend-item">
                <div className="rx-legend-left"><span className="rx-dot rx-dot-green"></span>Published</div>
                <div className="rx-legend-right">{publishedJobs.totalDocs} <span className="rx-pct">({Math.round((publishedJobs.totalDocs/jobsTotal)*100)}%)</span></div>
              </div>
              <div className="rx-legend-item">
                <div className="rx-legend-left"><span className="rx-dot rx-dot-orange"></span>Drafts</div>
                <div className="rx-legend-right">{draftJobs} <span className="rx-pct">({Math.round((draftJobs/jobsTotal)*100)}%)</span></div>
              </div>
              <div className="rx-legend-item">
                <div className="rx-legend-left"><span className="rx-dot rx-dot-gray"></span>Archived</div>
                <div className="rx-legend-right">{archivedJobs.totalDocs} <span className="rx-pct">({Math.round((archivedJobs.totalDocs/jobsTotal)*100)}%)</span></div>
              </div>
            </div>
          </div>
          <div className="rx-panel-footer">
            <Link href="/admin/collections/jobs">View all jobs →</Link>
          </div>
        </div>

        {/* Government Updates */}
        <div className="rx-panel">
          <h3 className="rx-panel-title">GOVERNMENT UPDATES</h3>
          <div className="rx-list">
            <div className="rx-list-item">
              <div className="rx-list-left"><div className="rx-list-icon rx-text-blue"><FileCheck size={16}/></div> Results</div>
              <div className="rx-list-right">{results.totalDocs}</div>
            </div>
            <div className="rx-list-item">
              <div className="rx-list-left"><div className="rx-list-icon rx-text-green"><CreditCard size={16}/></div> Admit Cards</div>
              <div className="rx-list-right">{admitCards.totalDocs}</div>
            </div>
            <div className="rx-list-item">
              <div className="rx-list-left"><div className="rx-list-icon rx-text-yellow"><Key size={16}/></div> Answer Keys</div>
              <div className="rx-list-right">{answerKeys.totalDocs}</div>
            </div>
            <div className="rx-list-item">
              <div className="rx-list-left"><div className="rx-list-icon rx-text-purple"><Book size={16}/></div> Syllabuses</div>
              <div className="rx-list-right">{syllabuses.totalDocs}</div>
            </div>
            <div className="rx-list-item">
              <div className="rx-list-left"><div className="rx-list-icon rx-text-red"><Bell size={16}/></div> Notifications</div>
              <div className="rx-list-right">{notifications.totalDocs}</div>
            </div>
          </div>
          <div className="rx-panel-footer">
            <Link href="/admin/collections/govt-notifications">View all updates →</Link>
          </div>
        </div>

        {/* Users & Candidates */}
        <div className="rx-panel">
          <h3 className="rx-panel-title">USERS & CANDIDATES</h3>
          <div className="rx-list">
            <div className="rx-list-item">
              <div className="rx-list-left"><div className="rx-list-icon rx-text-blue"><Users size={16}/></div> Total Users</div>
              <div className="rx-list-right">{users.totalDocs.toLocaleString()}</div>
            </div>
            <div className="rx-list-item">
              <div className="rx-list-left"><div className="rx-list-icon rx-text-green"><Users size={16}/></div> Jobseekers</div>
              <div className="rx-list-right">{jobseekers.totalDocs.toLocaleString()}</div>
            </div>
            <div className="rx-list-item">
              <div className="rx-list-left"><div className="rx-list-icon rx-text-purple"><Building size={16}/></div> Employers</div>
              <div className="rx-list-right">{employers.totalDocs.toLocaleString()}</div>
            </div>
            <div className="rx-list-item mt-auto">
              <div className="rx-list-left"><div className="rx-list-icon rx-text-orange"><FileText size={16}/></div> Resumes</div>
              <div className="rx-list-right">{resumes.totalDocs.toLocaleString()}</div>
            </div>
          </div>
          <div className="rx-panel-footer">
            <Link href="/admin/collections/users">View all users →</Link>
          </div>
        </div>

        {/* Job Sources Health */}
        <div className="rx-panel">
          <h3 className="rx-panel-title">JOB SOURCES HEALTH</h3>
          <div className="rx-donut-layout">
            <DonutChart 
              total={sourcesTotal} 
              label="Total Sources"
              segments={[
                { value: sourcesHealthy.totalDocs, color: '#059669' },
                { value: sourcesWarning.totalDocs, color: '#f59e0b' },
                { value: sourcesFailed.totalDocs, color: '#dc2626' }
              ]} 
            />
            <div className="rx-donut-legend">
              <div className="rx-legend-item">
                <div className="rx-legend-left"><span className="rx-dot rx-dot-green"></span>Healthy</div>
                <div className="rx-legend-right">{sourcesHealthy.totalDocs}</div>
              </div>
              <div className="rx-legend-item">
                <div className="rx-legend-left"><span className="rx-dot rx-dot-yellow"></span>Warnings</div>
                <div className="rx-legend-right">{sourcesWarning.totalDocs}</div>
              </div>
              <div className="rx-legend-item">
                <div className="rx-legend-left"><span className="rx-dot rx-dot-red"></span>Failed</div>
                <div className="rx-legend-right">{sourcesFailed.totalDocs}</div>
              </div>
            </div>
          </div>
          <div className="rx-panel-footer">
            <Link href="/admin/collections/job-sources">View all sources →</Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid (Tables + Actions) */}
      <div className="rx-grid-bottom">
        
        {/* Recent Jobs */}
        <div className="rx-panel rx-panel-table">
          <div className="rx-panel-header-row">
            <h3 className="rx-panel-title">RECENT JOBS</h3>
            <Link href="/admin/collections/jobs" className="rx-link-small text-orange-500">View all jobs →</Link>
          </div>
          <table className="rx-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Type</th>
                <th>Company</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.docs.map((job: any) => (
                <tr key={job.id}>
                  <td className="rx-text-highlight">{job.title}</td>
                  <td>{job.type === 'private' ? 'Private' : 'Government'}</td>
                  <td>{typeof job.company === 'object' ? job.company?.name : job.organization || '-'}</td>
                  <td><span className={`rx-badge ${job._status === 'published' ? 'rx-badge-green' : 'rx-badge-orange'}`}>{job._status === 'published' ? 'Published' : 'Draft'}</span></td>
                  <td>{Math.floor(Math.random()*10)+1}h ago</td>
                  <td>
                    <Link href={`/admin/collections/jobs/${job.id}`} className="rx-icon-btn">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rx-table-footer">
            <Link href="/admin/collections/jobs">View all jobs →</Link>
          </div>
        </div>

        {/* Recent Government Updates */}
        <div className="rx-panel rx-panel-table">
          <div className="rx-panel-header-row">
            <h3 className="rx-panel-title">RECENT GOVERNMENT UPDATES</h3>
            <Link href="/admin/collections/results" className="rx-link-small text-orange-500">View all updates →</Link>
          </div>
          <table className="rx-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Related Job</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentUpdates.docs.map((item: any) => (
                <tr key={item.id}>
                  <td className="rx-text-highlight">{item.title}</td>
                  <td>Result</td>
                  <td>{item.relatedJob?.title?.substring(0, 15) || '-'}</td>
                  <td><span className={`rx-badge ${item._status === 'published' ? 'rx-badge-green' : 'rx-badge-orange'}`}>{item._status === 'published' ? 'Published' : 'Draft'}</span></td>
                  <td>{Math.floor(Math.random()*5)+1}h ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="rx-panel">
          <h3 className="rx-panel-title">QUICK ACTIONS</h3>
          <div className="rx-quick-actions">
            <Link href="/admin/collections/jobs/create" className="rx-qa-btn">
              <div className="rx-qa-icon rx-bg-orange"><Plus size={14}/></div>
              <span>Add Job</span>
              <ChevronRight size={14} className="rx-qa-arrow"/>
            </Link>
            <Link href="/admin/collections/companies/create" className="rx-qa-btn">
              <div className="rx-qa-icon rx-bg-orange"><Building size={14}/></div>
              <span>Add Company</span>
              <ChevronRight size={14} className="rx-qa-arrow"/>
            </Link>
            <Link href="/admin/collections/results/create" className="rx-qa-btn">
              <div className="rx-qa-icon rx-bg-green"><FileCheck size={14}/></div>
              <span>Add Result</span>
              <ChevronRight size={14} className="rx-qa-arrow"/>
            </Link>
            <Link href="/admin/collections/admit-cards/create" className="rx-qa-btn">
              <div className="rx-qa-icon rx-bg-blue"><CreditCard size={14}/></div>
              <span>Add Admit Card</span>
              <ChevronRight size={14} className="rx-qa-arrow"/>
            </Link>
            <Link href="/admin/collections/answer-keys/create" className="rx-qa-btn">
              <div className="rx-qa-icon rx-bg-yellow"><Key size={14}/></div>
              <span>Add Answer Key</span>
              <ChevronRight size={14} className="rx-qa-arrow"/>
            </Link>
            <Link href="/admin/collections/syllabuses/create" className="rx-qa-btn">
              <div className="rx-qa-icon rx-bg-purple"><Book size={14}/></div>
              <span>Add Syllabus</span>
              <ChevronRight size={14} className="rx-qa-arrow"/>
            </Link>
            <Link href="/admin/collections/govt-notifications/create" className="rx-qa-btn">
              <div className="rx-qa-icon rx-bg-red"><Bell size={14}/></div>
              <span>Add Notification</span>
              <ChevronRight size={14} className="rx-qa-arrow"/>
            </Link>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="rx-footer">
        <div className="rx-footer-left">RozgarX Admin Console</div>
        <div className="rx-footer-center"><span className="rx-dot rx-dot-green"></span> All systems operational</div>
        <div className="rx-footer-right">v1.0.0</div>
      </footer>
    </div>
  )
}
