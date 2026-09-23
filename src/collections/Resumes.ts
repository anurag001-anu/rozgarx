import type { CollectionConfig } from 'payload'

export const Resumes: CollectionConfig = {
  slug: 'resumes',
  upload: {
    staticDir: 'media/resumes',
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Users & Candidates',
  },
  access: {
    read: ({ req: { user }, id }) => {
      if (user?.role === 'admin') return true;
      if (user) {
        return {
          user: { equals: user.id }
        };
      }
      return false;
    },
    create: ({ req: { user } }) => user?.role === 'jobseeker' || user?.role === 'admin',
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      if (user?.role === 'jobseeker') {
        return { user: { equals: user?.id } }
      }
      return false;
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      if (user?.role === 'jobseeker') {
        return { user: { equals: user?.id } }
      }
      return false;
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'isPrimary',
      type: 'checkbox',
      defaultValue: false,
    }
  ],
}
