import type { CollectionConfig } from 'payload'

export const JobSources: CollectionConfig = {
  slug: 'job-sources',
  admin: {
    useAsTitle: 'name',
    group: 'Management',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Source Name',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Government', value: 'government' },
        { label: 'Private', value: 'private' },
      ],
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'sourceUrl',
      type: 'text',
      required: true,
      label: 'Official Source URL',
      admin: {
        description: 'The homepage or primary career portal URL',
      }
    },
    {
      name: 'feedUrl',
      type: 'text',
      label: 'Integration/Feed URL (Optional)',
      admin: {
        description: 'Machine-readable endpoint like RSS or JSON API',
      }
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Verified Official Source',
      admin: {
        position: 'sidebar',
        description: 'Must be verified to allow automated imports',
      }
    },
    {
      name: 'healthStatus',
      type: 'select',
      options: [
        { label: 'Healthy', value: 'Healthy' },
        { label: 'Warning', value: 'Warning' },
        { label: 'Broken', value: 'Broken' },
      ],
      defaultValue: 'Healthy',
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'integrationType',
      type: 'select',
      options: [
        { label: 'Manual', value: 'Manual' },
        { label: 'RSS', value: 'RSS' },
        { label: 'API_Webhook', value: 'API_Webhook' },
        { label: 'Scraper', value: 'Scraper' },
      ],
      defaultValue: 'Manual',
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'lastCheckedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      }
    }
  ],
}
