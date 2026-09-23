import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    group: 'Users & Candidates',
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => user?.role === 'admin',
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Employer', value: 'employer' },
        { label: 'Job Seeker', value: 'jobseeker' },
      ],
      defaultValue: 'jobseeker',
      required: true,
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
        create: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'emailAlerts',
          type: 'checkbox',
          defaultValue: true,
          label: 'Receive Job Alerts via Email',
        },
        {
          name: 'inAppAlerts',
          type: 'checkbox',
          defaultValue: true,
          label: 'Receive Job Alerts In-App',
        },
      ],
    },
    {
      name: 'alertUnsubscribeToken',
      type: 'text',
      admin: { readOnly: true, disabled: true },
      access: { read: () => false }, // Do not expose in API responses
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              return require('crypto').randomBytes(32).toString('hex');
            }
            return value;
          }
        ]
      }
    },
    {
      name: 'globalUnsubscribeToken',
      type: 'text',
      admin: { readOnly: true, disabled: true },
      access: { read: () => false }, // Do not expose in API responses
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              return require('crypto').randomBytes(32).toString('hex');
            }
            return value;
          }
        ]
      }
    }
  ],
}
