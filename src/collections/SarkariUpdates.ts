import { CollectionConfig } from 'payload';

export const SarkariUpdates: CollectionConfig = {
  slug: 'sarkari-updates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true, // Everyone can read
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'Result', value: 'Result' },
        { label: 'Admit Card', value: 'Admit Card' },
        { label: 'Latest Jobs', value: 'Latest Jobs' },
        { label: 'Answer Key', value: 'Answer Key' },
        { label: 'Syllabus', value: 'Syllabus' },
        { label: 'Admission', value: 'Admission' },
        { label: 'Important', value: 'Important' },
      ],
    },
    {
      name: 'link',
      type: 'text',
      required: true,
      label: 'Direct Government Link URL',
    },
    {
      name: 'highlight',
      type: 'checkbox',
      label: 'Highlight (Make text bold/colored)',
      defaultValue: false,
    },
  ],
};
