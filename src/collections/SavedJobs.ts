import type { CollectionConfig } from 'payload'

export const SavedJobs: CollectionConfig = {
  slug: 'saved-jobs' as any,
  admin: {
    useAsTitle: 'id',
    hidden: true,
    defaultColumns: ['user', 'job', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          // Strong duplicate prevention
          const existing = await req.payload.find({
            collection: 'saved-jobs' as any,
            where: {
              and: [
                { user: { equals: data.user } },
                { job: { equals: data.job } }
              ]
            },
            limit: 1,
          });
          if (existing.totalDocs > 0) {
            throw new Error('This job is already saved by the user.');
          }
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      index: true,
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: true,
      hasMany: false,
      index: true,
    },
  ],
}
