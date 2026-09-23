import type { CollectionConfig } from 'payload'

export const NotificationHistory: CollectionConfig = {
  slug: 'notification-history' as any,
  admin: {
    useAsTitle: 'id',
    hidden: true,
    group: 'Admin',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return { user: { equals: user.id } };
    },
    create: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'jobseeker';
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return { user: { equals: user.id } };
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin';
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Enforce exact user + job uniqueness
        if (operation === 'create') {
          const payload = req.payload;
          
          const existing = await payload.find({
            collection: 'notification-history' as any,
            where: {
              and: [
                { user: { equals: data.user } },
                { job: { equals: data.job } },
              ]
            },
            limit: 1,
          });

          if (existing.totalDocs > 0) {
            throw new Error('A notification history record for this user and job already exists.');
          }
        }
        return data;
      }
    ]
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs' as any,
      required: true,
      index: true,
    },
    {
      name: 'jobAlert',
      type: 'relationship',
      relationTo: 'job-alerts' as any,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft (Sys)', value: 'draft' },
        { label: 'Queued', value: 'queued' },
        { label: 'Processing', value: 'processing' },
        { label: 'Sent', value: 'sent' },
        { label: 'Skipped', value: 'skipped' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'draft',
      required: true,
      index: true, // Crucial for querying queued/processing statuses efficiently
    },
    {
      name: 'channels',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'In-App', value: 'in-app' },
        { label: 'Email', value: 'email' },
        { label: 'Push', value: 'push' },
      ],
      defaultValue: ['in-app'],
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'lastAttemptAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'nextAttemptAt',
      type: 'date',
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'errorLog',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
}
