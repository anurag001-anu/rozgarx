import type { CollectionConfig } from 'payload'

const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();

export const Companies: CollectionConfig = {
  slug: 'companies',
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'employer',
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.role === 'employer') {
        return {
          or: [
            { owner: { equals: user?.id } },
            { members: { in: [user?.id] } }
          ]
        } as any
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.role === 'employer') {
        return {
          or: [
            { owner: { equals: user?.id } },
            { members: { in: [user?.id] } }
          ]
        } as any
      }
      return false
    },
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        // Draft vs Publish requirements (Publish Validation)
        const isPublishing = data?.isPublished === true && data?.isArchived !== true;
        if (isPublishing) {
          if (!data?.name) throw new Error('Company name is required for publishing.');
        }

        // Duplicate Detection Warning
        if (operation === 'create' || operation === 'update') {
          try {
            let possibleDuplicate = false;
            if (data?.name) {
              const existing = await req.payload.find({
                collection: 'companies',
                where: { name: { equals: data.name } },
                limit: 1
              });
              if (existing.totalDocs > (operation === 'update' ? 1 : 0)) possibleDuplicate = true;
            }
            if (data) data.isPossibleDuplicate = possibleDuplicate;
          } catch (e) {}
        }
        return data;
      }
    ],
    beforeDelete: [
      async ({ req, id }) => {
        // Block deletion if company has active jobs
        const activeJobs = await req.payload.find({
          collection: 'jobs',
          where: {
            and: [
              { company: { equals: id } },
              { status: { in: ['Open', 'Closing Soon'] } }
            ]
          },
          limit: 1
        });
        
        if (activeJobs.totalDocs > 0) {
          throw new Error('Cannot delete company. It has active jobs. Please archive or delete the jobs first.');
        }
      }
    ]
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from name. Used for company profile URL.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return formatSlug(value);
            if (data?.name) return formatSlug(data.name);
            return value;
          }
        ]
      }
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      label: 'Verified Business Entity',
      defaultValue: false,
      admin: { 
        position: 'sidebar',
        description: 'Admin-only control. Does not imply endorsement.',
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
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
      name: 'isPossibleDuplicate',
      type: 'checkbox',
      admin: { position: 'sidebar', readOnly: true }
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'industry',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. IT & Software, Banking & Finance, Healthcare, Real Estate, etc.',
      }
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'companySize',
      type: 'select',
      options: [
        { label: '1-10', value: '1-10' },
        { label: '11-50', value: '11-50' },
        { label: '51-200', value: '51-200' },
        { label: '201-500', value: '201-500' },
        { label: '501-1,000', value: '501-1000' },
        { label: '1,001-5,000', value: '1001-5000' },
        { label: '5,001-10,000', value: '5001-10000' },
        { label: '10,000+', value: '10000+' },
        { label: 'Not specified', value: 'Not specified' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      label: 'Official Website',
    },
    {
      name: 'careerUrl',
      type: 'text',
      label: 'Official Career Page',
    },
    {
      name: 'openPositions',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: (data, siblingData, { user }) => {
          return user?.role === 'admin'
        },
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'create' && req.user) {
              return req.user.id;
            }
          }
        ]
      }
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        description: 'Employers who have access to manage this company.',
      },
      hooks: {
        beforeChange: [
          ({ req, operation, value }) => {
            // On create, automatically add creator to members
            if (operation === 'create' && req.user) {
              const currentMembers = Array.isArray(value) ? value : [];
              if (!currentMembers.includes(req.user.id)) {
                return [...currentMembers, req.user.id];
              }
            }
            return value;
          }
        ]
      }
    }
  ],
}
