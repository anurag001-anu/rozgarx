import { CollectionConfig } from 'payload';

export const AdmitCards: CollectionConfig = {
  slug: 'admit-cards',
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'organization', 'status', 'isPublished', 'updatedAt'],
    group: 'Government Updates',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return {
        and: [
          { _status: { equals: 'published' } },
          { isArchived: { not_equals: true } }
        ]
      } as any;
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const isPublishing = data?.isPublished === true && data?.isArchived !== true;
        if (isPublishing) {
          if (!data?.title) throw new Error('Title is required for publishing.');
          if (!data?.organization) throw new Error('Organization is required for publishing.');
        }
        return data;
      }
    ],
    beforeChange: [
      ({ data }) => {
        // Auto-calculate status based on dates if not explicitly overridden
        if (!data.overrideStatus) {
          const now = new Date();
          const releaseDate = data.admitCardReleaseDate ? new Date(data.admitCardReleaseDate) : null;
          const examDate = data.examDate ? new Date(data.examDate) : null;
          
          if (examDate && examDate < now) {
            data.status = 'Exam Completed';
          } else if (releaseDate && releaseDate <= now) {
            data.status = 'Released';
          } else {
            data.status = 'Upcoming';
          }
        }
        return data;
      }
    ]
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Admit Card Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug (e.g., ssc-cgl-admit-card-2026)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'organization',
          type: 'text',
          required: true,
        },
        {
          name: 'examName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'examDate',
          type: 'date',
          label: 'Exam Date',
        },
        {
          name: 'admitCardReleaseDate',
          type: 'date',
          label: 'Admit Card Release Date',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'overrideStatus',
          type: 'checkbox',
          label: 'Override Auto Status?',
          defaultValue: false,
          admin: { description: 'Check to manually set the status instead of auto-calculating from dates.' }
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
        { label: 'Draft (Sys)', value: 'draft' },
            { label: 'Upcoming', value: 'Upcoming' },
            { label: 'Released', value: 'Released' },
            { label: 'Exam Completed', value: 'Exam Completed' },
          ],
          admin: {
            condition: (data) => data.overrideStatus,
          }
        },
      ],
    },
    {
      name: 'instructions',
      type: 'richText',
      label: 'Important Instructions',
    },
    {
      name: 'relatedJob',
      type: 'relationship',
      relationTo: 'jobs',
      hasMany: false,
      admin: {
        description: 'Link to the original Government Job/Recruitment (Optional)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'officialUrl',
          type: 'text',
          label: 'Official Admit Card URL',
        },
        {
          name: 'isVerified',
          type: 'checkbox',
          label: 'Official Source Verified',
          defaultValue: false,
        },
      ]
    },
    {
      name: 'verifiedDate',
      type: 'date',
      admin: {
        condition: (data) => data.isVerified === true,
      }
    },
    {
      name: 'verificationStatus',
      type: 'select',
      options: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Under Review', value: 'Under Review' },
        { label: 'Verified', value: 'Verified' },
        { label: 'Rejected', value: 'Rejected' },
      ],
      defaultValue: 'Draft',
      index: true,
      admin: { position: 'sidebar' }
    },
    {
      name: 'isArchived',
      type: 'checkbox',
      label: 'Archived (Soft Delete)',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' }
    },
    {
      name: 'verifiedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'officialSourceUrl',
      type: 'text',
      label: 'Official Source URL (Internal Verification)',
      admin: { position: 'sidebar' },
    },
    {
      name: 'linkHealth',
      type: 'select',
      options: [
        { label: 'Healthy', value: 'Healthy' },
        { label: 'Warning', value: 'Warning' },
        { label: 'Broken', value: 'Broken' },
      ],
      defaultValue: 'Healthy',
      admin: { position: 'sidebar' }
    },
    {
      name: 'lastCheckedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true }
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Publish to Website',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.isPublished && !value) return new Date().toISOString();
            if (!siblingData.isPublished) return null;
            return value;
          }
        ]
      }
    },
  ],
};
