import type { CollectionConfig } from 'payload'

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'id',
    hidden: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) {
        // Candidates can see their own tracked applications
        return {
          applicant: { equals: user.id },
        }
      }
      return false
    },
    create: ({ req: { user } }) => {
      return user?.role === 'jobseeker' || user?.role === 'admin'
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.role === 'jobseeker') {
        return { applicant: { equals: user?.id } }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.role === 'jobseeker') {
        return { applicant: { equals: user?.id } }
      }
      return false
    },
  },
  fields: [
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: true,
      hasMany: false,
    },
    {
      name: 'applicant',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft (Sys)', value: 'draft' },
        { label: 'Applied', value: 'applied' },
        { label: 'Interview', value: 'interview' },
        { label: 'Selected', value: 'selected' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Withdrawn', value: 'withdrawn' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'notes',
      type: 'text',
      admin: { readOnly: true },
      label: 'System Notes (External Tracking)',
    },
    {
      name: 'statusHistory',
      type: 'array',
      admin: { readOnly: true },
      fields: [
        { name: 'previousStatus', type: 'text' },
        { name: 'newStatus', type: 'text' },
        { name: 'changedBy', type: 'relationship', relationTo: 'users' },
        { name: 'changedAt', type: 'date' }
      ]
    }
  ],
}
