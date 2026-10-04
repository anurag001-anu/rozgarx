import type { CollectionConfig } from 'payload'
import { NotificationService } from '../services/NotificationService'
import jwt from 'jsonwebtoken'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'employer',
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.role === 'employer') {
        return {
          owner: {
            equals: user?.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.role === 'employer') {
        return {
          owner: {
            equals: user?.id,
          },
        }
      }
      return false
    },
  },
  hooks: {
    beforeOperation: [
      ({ args, operation }) => {
        if (operation === 'read' && args.req?.user?.role !== 'admin') {
          if ('where' in args) {
            args.where = {
              and: [
                args.where || {},
                { isArchived: { not_equals: true } },
                { _status: { equals: 'published' } }
              ]
            };
          }
        }
        return args;
      }
    ],
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        // Enforce Server-Side Type Security
        if (operation === 'create') {
          // Must have a valid signed token from the Add Job flow
          let token = data?.postingContextToken;
          if (!token && req.headers) {
            const cookieHeader = typeof req.headers.get === 'function' ? req.headers.get('cookie') : (req.headers as any).cookie;
            if (cookieHeader) {
              const match = cookieHeader.match(/postingContextToken=([^;]+)/);
              if (match) token = match[1];
            }
          }
          if (!token) {
            throw new Error('Security Error: Missing posting context token. Please use the official Add Job flow.');
          }
          try {
            const decoded = jwt.verify(token, process.env.PAYLOAD_SECRET || 'your-secret-key') as any;
            if (decoded.type !== data?.type) {
              throw new Error(`Security Error: Type mismatch. Token authorized for ${decoded.type} but requested ${data?.type}.`);
            }
            if (decoded.userId !== req.user?.id) {
              throw new Error('Security Error: Token user mismatch. Token belongs to another session.');
            }
          } catch (e: any) {
            if (e.message.includes('Security Error')) throw e;
            throw new Error('Security Error: Invalid or expired posting context token. Please try again.');
          }
        }

        // Prevent changing Job Type after creation (Server-Side Enforcement)
        if (operation === 'update' && originalDoc?.type && data?.type && data.type !== originalDoc.type) {
          throw new Error(`Type Modification Blocked: Cannot change Job Type from ${originalDoc.type} to ${data.type} after creation.`);
        }

        // Draft vs Publish requirements
        const isPublishing = data?.status && data.status !== 'draft' && data?.isArchived !== true;
        
        if (isPublishing) {
          if (data?.type === 'government') {
            if (!data.title) throw new Error('Title is required for publishing Government Jobs.');
            if (!data.organization) throw new Error('Organization is required for publishing Government Jobs.');
            if (!data.lastDate) throw new Error('Last Date is required for publishing Government Jobs.');
          } else if (data?.type === 'private') {
            if (!data.title) throw new Error('Title is required for publishing Private Jobs.');
            if (!data.company) throw new Error('Company is required for publishing Private Jobs.');
            if (!data.applyUrl) throw new Error('Apply URL is required for publishing Private Jobs.');
          }
        }

        // Ensure non-admins cannot create or modify government jobs
        if (operation === 'create' || operation === 'update') {
          if ((data?.type === 'government' || req.data?.type === 'government') && req.user?.role !== 'admin') {
            throw new Error('Only admins can manage Government Jobs.');
          }

          // Type Compatibility Validation
          if (data?.sourceRegistry) {
            const sourceId = typeof data.sourceRegistry === 'object' ? data.sourceRegistry.id : data.sourceRegistry;
            const sourceDoc = await req.payload.findByID({ collection: 'job-sources' as any, id: sourceId });
            if (sourceDoc && sourceDoc.type !== data.type) {
              throw new Error(`Type Mismatch: Cannot link a ${data.type} job to a ${sourceDoc.type} source.`);
            }
          }
        }

        // Duplicate Detection Warning
        if (operation === 'create' || operation === 'update') {
          try {
            let possibleDuplicate = false;

            // 1. Strong Duplicate: Same Apply URL + Source + Job Identity
            if (data?.applyUrl && data?.title) {
              const applyQuery: any = {
                and: [
                  { applyUrl: { equals: data.applyUrl } },
                  { title: { equals: data.title } }
                ]
              };
              if (data.sourceRegistry) {
                applyQuery.and.push({ sourceRegistry: { equals: typeof data.sourceRegistry === 'object' ? data.sourceRegistry.id : data.sourceRegistry } });
              }
              const applyMatches = await req.payload.find({ collection: 'jobs', where: applyQuery, limit: 1 });
              if (applyMatches.totalDocs > (operation === 'update' ? 1 : 0)) {
                throw new Error('Strong Duplicate: A job with the exact same Apply URL and Title already exists.');
              }
            }

            // 2. Strong Duplicate (Government): adv_no + org
            if (data?.type === 'government' && data?.advertisementNumber && data?.organization) {
              const advQuery: any = {
                and: [
                  { type: { equals: 'government' } },
                  { advertisementNumber: { equals: data.advertisementNumber } },
                  { organization: { equals: data.organization } }
                ]
              };
              const advMatches = await req.payload.find({ collection: 'jobs', where: advQuery, limit: 1 });
              if (advMatches.totalDocs > (operation === 'update' ? 1 : 0)) {
                throw new Error('Strong Duplicate: A Government job with the same Advertisement Number and Organization already exists.');
              }
            }

            // 3. Possible Duplicate (Private)
            if (data?.type === 'private' && data?.title && data?.company) {
              const existing = await req.payload.find({
                collection: 'jobs',
                where: {
                  and: [
                    { type: { equals: 'private' } },
                    { title: { equals: data.title } },
                    { company: { equals: typeof data.company === 'object' ? data.company.id : data.company } }
                  ]
                },
                limit: 1
              });
              if (existing.totalDocs > (operation === 'update' ? 1 : 0)) possibleDuplicate = true;
            }

            if (data) data.isPossibleDuplicate = possibleDuplicate;
          } catch (e: any) {
            if (e.message.includes('Strong Duplicate')) {
              throw e;
            }
            console.error('Duplicate detection failed', e);
          }
        }
        return data;
      }
    ],
    beforeDelete: [
      async ({ req, id }) => {
        // Prevent deletion if heavily referenced, or handle gracefully
        // In a real prod environment we'd check saved jobs, alerts, etc.
        // For now, we allow it but log it.
        req.payload.logger.info(`Job ${id} is being hard-deleted. Consider archiving instead.`);
      }
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Notification matching is now handled asynchronously by the Matcher Cron (Step 13)
        // See /api/cron/match-alerts for details.
        return doc;
      }
    ]
  },
  fields: [
    // --- SIDEBAR FIELDS ---
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft (Sys)', value: 'draft' },
        { label: 'Open', value: 'open' },
        { label: 'Closing Soon', value: 'closing soon' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'draft',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Effective display status for the frontend.',
      },
    },
    {
      name: 'statusLock',
      type: 'checkbox',
      label: 'Lock Status (Admin Override)',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'If checked, automated expiry scripts will ignore this job.',
      }
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
      name: 'isPossibleDuplicate',
      type: 'checkbox',
      admin: { position: 'sidebar', readOnly: true }
    },
    {
      name: 'postingContextToken',
      type: 'text',
      hooks: { beforeChange: [() => null] },
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/JobTokenField',
        }
      },
      },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Private', value: 'private' },
        { label: 'Government', value: 'government' },
      ],
      required: true,
      
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/JobTypeField',
        }
      },
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      label: 'Official Source Verified',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'verifiedDate',
      type: 'date',
      label: 'Verification Date',
      admin: {
        position: 'sidebar',
        condition: (data) => data.isVerified === true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.isVerified && !value) {
              return new Date().toISOString();
            }
            if (!siblingData.isVerified) {
              return null;
            }
            return value;
          }
        ]
      }
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
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
      },
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
      name: 'sourceRegistry',
      type: 'relationship',
      relationTo: 'job-sources' as any,
      admin: { position: 'sidebar' },
    },
    {
      name: 'discoveredAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
      hooks: {
        beforeChange: [
          ({ operation, value }) => {
            if (operation === 'create' && !value) {
              return new Date().toISOString();
            }
            return value;
          }
        ]
      }
    },
    {
      name: 'lastVerifiedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'rankingScore',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
    // --- MAIN CONTENT FIELDS ---
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title / Post Name',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'location',
          type: 'text',
          required: true,
        },
        {
          name: 'salary',
          type: 'text',
          label: 'Salary / Pay Level',
        },
      ]
    },
    {
      name: 'applyUrl',
      type: 'text',
      label: 'Official Apply / Career URL',
      admin: {
        description: 'URL where candidate should apply directly (Govt portal or Company career page)',
      },
    },

    // --- GOVERNMENT JOB DYNAMIC SECTIONS ---
    {
      name: 'dynamicSections',
      type: 'blocks',
      admin: {
        condition: (data) => data.type === 'government',
      },
      blocks: [
        {
          slug: 'ImportantDates',
          labels: { singular: 'Important Dates', plural: 'Important Dates' },
          fields: [
            {
              name: 'dates',
              type: 'array',
              fields: [
                { name: 'event', type: 'text', required: true, label: 'Event Name' },
                { name: 'date', type: 'date', required: true, label: 'Date' },
                { name: 'note', type: 'text', label: 'Additional Note (Optional)' }
              ]
            }
          ]
        },
        {
          slug: 'ApplicationFee',
          labels: { singular: 'Application Fee', plural: 'Application Fee' },
          fields: [
            {
              name: 'fees',
              type: 'array',
              fields: [
                { name: 'category', type: 'text', required: true, label: 'Category' },
                { name: 'amount', type: 'text', required: true, label: 'Fee Amount' },
              ]
            },
            { name: 'paymentMode', type: 'text', label: 'Payment Mode Details' }
          ]
        },
        {
          slug: 'VacancyTable',
          labels: { singular: 'Vacancy Details', plural: 'Vacancy Details' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Vacancy Details', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'EducationalQualification',
          labels: { singular: 'Educational Qualification', plural: 'Educational Qualification' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Educational Qualification', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'AgeLimit',
          labels: { singular: 'Age Limit', plural: 'Age Limit' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Age Limit', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'SelectionProcess',
          labels: { singular: 'Selection Process', plural: 'Selection Process' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Selection Process', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'ExamDetails',
          labels: { singular: 'Exam Details', plural: 'Exam Details' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Exam Details', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'PhysicalStandards',
          labels: { singular: 'Physical Standards', plural: 'Physical Standards' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Physical Standards', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'MedicalStandards',
          labels: { singular: 'Medical Standards', plural: 'Medical Standards' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Medical Standards', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'SalaryPayScale',
          labels: { singular: 'Salary / Pay Scale', plural: 'Salary / Pay Scale' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Salary / Pay Scale', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'Experience',
          labels: { singular: 'Experience', plural: 'Experience' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Experience', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'DocumentsRequired',
          labels: { singular: 'Documents Required', plural: 'Documents Required' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Documents Required', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'HowToApply',
          labels: { singular: 'How to Apply', plural: 'How to Apply' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'How to Apply', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'HowToFillForm',
          labels: { singular: 'How to Fill Form', plural: 'How to Fill Form' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'How to Fill Form', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'ImportantInstructions',
          labels: { singular: 'Important Instructions', plural: 'Important Instructions' },
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Important Instructions', required: true },
            { name: 'content', type: 'richText', required: true }
          ]
        },
        {
          slug: 'ImportantLinks',
          labels: { singular: 'Important Links', plural: 'Important Links' },
          fields: [
            {
              name: 'links',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Link Label (e.g. Apply Online)' },
                { name: 'url', type: 'text', required: true, label: 'URL' }
              ]
            }
          ]
        },
        {
                  slug: 'CustomSection',
                  labels: { singular: 'Custom Section', plural: 'Custom Section' },
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'content', type: 'richText', required: true }
                  ]
                },
                {
                  slug: 'DynamicMatrix',
                  labels: { singular: 'Matrix Table', plural: 'Matrix Tables' },
                  fields: [
                    { name: 'title', type: 'text', required: true, label: 'Table Title' },
                    { name: 'description', type: 'textarea', label: 'Optional Description or Footnote' },
                    { 
                      name: 'columns', type: 'array', required: true, minRows: 1, 
                      fields: [{ name: 'heading', type: 'text', required: true }] 
                    },
                    { 
                      name: 'rows', type: 'array',
                      validate: (value: any, { siblingData }: any) => {
                        const cols = siblingData?.columns?.length || 0;
                        if (value && Array.isArray(value)) {
                          for (let i = 0; i < value.length; i++) {
                            const cells = value[i]?.cells?.length || 0;
                            if (cells !== cols) {
                              return `Validation Error: Row ${i + 1} has ${cells} cells, but the table has ${cols} columns. Please match the number of cells. Blank cells can be left empty but the cell itself must exist.`;
                            }
                          }
                        }
                        return true;
                      },
                      fields: [{ 
                        name: 'cells', type: 'array', 
                        fields: [{ name: 'value', type: 'text' }] 
                      }] 
                    }
                  ]
                },
                {
                  slug: 'KeyValueList',
                  labels: { singular: 'Key-Value List', plural: 'Key-Value Lists' },
                  fields: [
                    { name: 'title', type: 'text', required: true, label: 'Section Title' },
                    { 
                      name: 'listItems', type: 'array', required: true, 
                      fields: [
                        { name: 'key', type: 'text', required: true, label: 'Label' }, 
                        { name: 'value', type: 'textarea', label: 'Value (Optional for long text)' }
                      ] 
                    }
                  ]
                }
      ]
    },

    // --- GOVERNMENT JOB FIELDS ---
    {
      name: 'govtCategory',
      type: 'select',
      label: 'Government Category',
      options: [
        { label: 'SSC', value: 'SSC' },
        { label: 'UPSC', value: 'UPSC' },
        { label: 'Railway', value: 'Railway' },
        { label: 'Banking', value: 'Banking' },
        { label: 'Defence', value: 'Defence' },
        { label: 'Police', value: 'Police' },
        { label: 'Teaching', value: 'Teaching' },
        { label: 'State Government', value: 'State Government' },
        { label: 'Other', value: 'Other' },
      ],
      admin: { condition: (data) => data.type === 'government' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'organization',
          type: 'text',
          label: 'Department / Organization',
          admin: { condition: (data) => data.type === 'government' },
        },
        {
          name: 'advertisementNumber',
          type: 'text',
          label: 'Advertisement Number',
          admin: { condition: (data) => data.type === 'government' },
        },
        {
          name: 'vacancies',
          type: 'number',
          label: 'Total Vacancies',
          admin: { condition: (data) => data.type === 'government' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'qualification',
          type: 'text',
          label: 'Qualification Required',
          admin: { condition: (data) => data.type === 'government' },
        },
        {
          name: 'ageLimit',
          type: 'text',
          label: 'Age Limit',
          admin: { condition: (data) => data.type === 'government' },
        },
        {
          name: 'applicationFee',
          type: 'text',
          label: 'Application Fee',
          admin: { condition: (data) => data.type === 'government' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'applicationStartDate',
          type: 'date',
          label: 'Application Start Date',
          admin: { condition: (data) => data.type === 'government' },
        },
        {
          name: 'lastDate',
          type: 'date',
          label: 'Last Date',
          admin: { condition: (data) => data.type === 'government' },
        },
        {
          name: 'correctionDate',
          type: 'date',
          label: 'Correction Date',
          admin: { condition: (data) => data.type === 'government' },
        },
        {
          name: 'examDate',
          type: 'date',
          label: 'Exam Date',
          admin: { condition: (data) => data.type === 'government' },
        },
      ],
    },
    {
      name: 'selectionProcess',
      type: 'textarea',
      label: 'Selection Process',
      admin: { condition: (data) => data.type === 'government' },
    },
    {
      name: 'requiredDocuments',
      type: 'textarea',
      label: 'Required Documents',
      admin: { condition: (data) => data.type === 'government' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'officialNotificationUrl',
          type: 'text',
          label: 'Official Notification URL',
          admin: { condition: (data) => data.type === 'government' },
        },
        {
          name: 'officialWebsiteUrl',
          type: 'text',
          label: 'Official Website URL',
          admin: { condition: (data) => data.type === 'government' },
        },
      ],
    },

    // --- PRIVATE JOB FIELDS ---
    {
      name: 'privateCategory',
      type: 'select',
      label: 'Private Category',
      options: [
        { label: 'IT & Software', value: 'IT & Software' },
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'BPO', value: 'BPO' },
        { label: 'Internship', value: 'Internship' },
        { label: 'Remote', value: 'Remote' },
        { label: 'Other', value: 'Other' },
      ],
      admin: { condition: (data) => data.type === 'private' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'company',
          type: 'relationship',
          relationTo: 'companies',
          label: 'Company',
          admin: { condition: (data) => data.type === 'private' },
        },
        {
          name: 'companyWebsiteUrl',
          type: 'text',
          label: 'Company Website URL',
          admin: { condition: (data) => data.type === 'private' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'experience',
          type: 'text',
          label: 'Experience Required',
          admin: { condition: (data) => data.type === 'private' },
        },
        {
          name: 'workMode',
          type: 'select',
          label: 'Work Mode',
          options: [
            { label: 'On-site', value: 'On-site' },
            { label: 'Hybrid', value: 'Hybrid' },
            { label: 'Remote', value: 'Remote' },
          ],
          admin: { condition: (data) => data.type === 'private' },
        },
        {
          name: 'jobType',
          type: 'select',
          label: 'Job Type',
          options: [
            { label: 'Full Time', value: 'Full Time' },
            { label: 'Part Time', value: 'Part Time' },
            { label: 'Contract', value: 'Contract' },
            { label: 'Internship', value: 'Internship' },
          ],
          admin: { condition: (data) => data.type === 'private' },
        },
      ],
    },
    {
      name: 'skills',
      type: 'text',
      label: 'Skills Required (Comma separated)',
      admin: { condition: (data) => data.type === 'private' },
    },
    {
      name: 'applicationMethod',
      type: 'select',
      options: [
        { label: 'External Apply', value: 'external' },
      ],
      defaultValue: 'external',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            return 'external';
          }
        ]
      }
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
      access: { update: ({ req: { user } }) => user?.role === 'admin' }
    },
    {
      name: 'applyClicks',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, position: 'sidebar' },
      access: { update: ({ req: { user } }) => user?.role === 'admin' }
    }
  ],
}

