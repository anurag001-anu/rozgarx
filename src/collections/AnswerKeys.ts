import { CollectionConfig } from 'payload';

export const AnswerKeys: CollectionConfig = {
  slug: 'answer-keys',
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
        if (!data.overrideStatus) {
          const now = new Date();
          const releaseDate = data.answerKeyReleaseDate ? new Date(data.answerKeyReleaseDate) : null;
          const objectionStart = data.objectionStartDate ? new Date(data.objectionStartDate) : null;
          const objectionEnd = data.objectionLastDate ? new Date(data.objectionLastDate) : null;
          
          if (objectionEnd && objectionEnd < now) {
            data.status = 'Objection Closed';
          } else if (objectionStart && objectionStart <= now && (!objectionEnd || objectionEnd >= now)) {
            data.status = 'Objection Open';
          } else if (releaseDate && releaseDate <= now) {
            data.status = 'Released';
          } else {
            data.status = 'Not Released';
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
      label: 'Answer Key Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug (e.g., ssc-cgl-answer-key-2026)',
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
          name: 'answerKeyReleaseDate',
          type: 'date',
          label: 'Answer Key Release Date',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'objectionStartDate',
          type: 'date',
          label: 'Objection Start Date',
        },
        {
          name: 'objectionLastDate',
          type: 'date',
          label: 'Objection Last Date',
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
          admin: { description: 'Check to manually set the status instead of auto-calculating.' }
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
        { label: 'Draft (Sys)', value: 'draft' },
            { label: 'Not Released', value: 'Not Released' },
            { label: 'Released', value: 'Released' },
            { label: 'Objection Open', value: 'Objection Open' },
            { label: 'Objection Closed', value: 'Objection Closed' },
          ],
          admin: {
            condition: (data) => data.overrideStatus,
          }
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Additional Information',
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
          label: 'Official Answer Key URL',
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
