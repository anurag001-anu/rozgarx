import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users'
import { Jobs } from './collections/Jobs'
import { Companies } from './collections/Companies'
import { Media } from './collections/Media'
import { Applications } from './collections/Applications'
import { SarkariUpdates } from './collections/SarkariUpdates'

import { SavedJobs } from './collections/SavedJobs'
import { JobAlerts } from './collections/JobAlerts'
import { NotificationHistory } from './collections/NotificationHistory'
import { Results } from './collections/Results'
import { AdmitCards } from './collections/AdmitCards'
import { AnswerKeys } from './collections/AnswerKeys'
import { Syllabuses } from './collections/Syllabuses'
import { GovtNotifications } from './collections/GovtNotifications'
import { Resumes } from './collections/Resumes'
import { JobSources } from './collections/JobSources'
import { SystemSettings } from './globals/SystemSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    components: {
      beforeNavLinks: ['@/components/admin/HomeNavLink', '@/components/admin/AddJobNavLink'],
      beforeDashboard: ['@/components/admin/DashboardMetrics'],
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
      views: {
        AddJobSelect: {
          path: '/add-job',
          Component: '@/components/admin/AddJobSelectView',
        }
      },
    },
  },
  collections: [
    Users,
    Jobs,
    Companies,
    Applications,
    SavedJobs,
    JobAlerts,
    NotificationHistory,
    SarkariUpdates,
    Results,
    AdmitCards,
    AnswerKeys,
    Syllabuses,
    GovtNotifications,
    Media,
    Resumes,
    JobSources,
  ],
  globals: [
    SystemSettings,
  ],
  editor: lexicalEditor({}),
  email: resendAdapter({
    defaultFromAddress: process.env.EMAIL_FROM || 'noreply@rozgarx.com',
    defaultFromName: 'RozgarX',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgres://postgres:postgres@localhost:5432/job_portal',
    },
    push: process.env.NODE_ENV !== 'production',
  }),
})
