import { GlobalConfig } from 'payload'

export const SystemSettings: GlobalConfig = {
  slug: 'system-settings',
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'lastJobMatchTimestamp',
      type: 'date',
      label: 'Last Job Match Timestamp',
      admin: {
        description: 'The timestamp up to which the automated job alert dispatcher has processed published jobs. Do not change manually unless resetting the matcher.',
      },
      defaultValue: () => new Date().toISOString(),
    },
  ],
}
