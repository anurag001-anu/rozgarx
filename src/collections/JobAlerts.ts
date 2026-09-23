import type { CollectionConfig } from 'payload'

export const JobAlerts: CollectionConfig = {
  slug: 'job-alerts' as any,
  admin: {
    useAsTitle: 'name',
    hidden: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return { user: { equals: user.id } };
    },
    create: ({ req: { user } }) => {
      return user?.role === 'jobseeker' || user?.role === 'admin';
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return { user: { equals: user.id } };
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return { user: { equals: user.id } };
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Enforce exact user owner
        if (operation === 'create' && req.user) {
          data.user = req.user.id;
        }

        // Prevent exact identical active duplicate alerts by the same user
        if (operation === 'create' || operation === 'update') {
          const payload = req.payload;
          
          const duplicateCheck: any = {
            and: [
              { user: { equals: data.user } },
              { type: { equals: data.type } },
            ]
          };

          // Adding optional matching conditions
          if (data.type === 'government') {
            if (data.govtCategory) duplicateCheck.and.push({ govtCategory: { equals: data.govtCategory } });
            if (data.state) duplicateCheck.and.push({ state: { equals: data.state } });
          } else {
            if (data.privateCategory) duplicateCheck.and.push({ privateCategory: { equals: data.privateCategory } });
            if (data.workMode) duplicateCheck.and.push({ workMode: { equals: data.workMode } });
          }

          if (data.location) duplicateCheck.and.push({ location: { equals: data.location } });
          if (data.qualification) duplicateCheck.and.push({ qualification: { equals: data.qualification } });
          if (data.experience) duplicateCheck.and.push({ experience: { equals: data.experience } });
          if (data.keywords) duplicateCheck.and.push({ keywords: { equals: data.keywords } });

          const existing = await payload.find({
            collection: 'job-alerts' as any,
            where: duplicateCheck,
            limit: 1,
          });

          // Check if it's the exact same by comparing fields exactly, as well as if there's any found
          // We need to allow update to the same document, so exclude the current ID
          let foundDuplicate = false;
          if (existing.totalDocs > 0) {
            for (const doc of existing.docs) {
               // Skip if updating the same document
               if (operation === 'update' && doc.id === data.id) continue;
               
               // Double check exactness of optional fields since payload find might match nullish in some setups
               const d = doc as any;
               const isGovCategorySame = (d.govtCategory || '') === (data.govtCategory || '');
               const isStateSame = (d.state || '') === (data.state || '');
               const isPrivCategorySame = (d.privateCategory || '') === (data.privateCategory || '');
               const isWorkModeSame = (d.workMode || '') === (data.workMode || '');
               const isLocationSame = (d.location || '') === (data.location || '');
               const isQualSame = (d.qualification || '') === (data.qualification || '');
               const isExpSame = (d.experience || '') === (data.experience || '');
               const isKeywordsSame = (d.keywords || '') === (data.keywords || '');

               if (isGovCategorySame && isStateSame && isPrivCategorySame && isWorkModeSame && isLocationSame && isQualSame && isExpSame && isKeywordsSame) {
                  foundDuplicate = true;
                  break;
               }
            }
          }

          if (foundDuplicate) {
            throw new Error('An identical alert already exists for this user.');
          }
        }

        return data;
      }
    ]
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Government', value: 'government' },
        { label: 'Private', value: 'private' },
      ],
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    // --- Government Fields ---
    {
      name: 'govtCategory',
      type: 'select',
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
      name: 'state',
      type: 'text',
      admin: { condition: (data) => data.type === 'government' },
    },
    // --- Private Fields ---
    {
      name: 'privateCategory',
      type: 'select',
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
      name: 'workMode',
      type: 'select',
      options: [
        { label: 'On-site', value: 'On-site' },
        { label: 'Hybrid', value: 'Hybrid' },
        { label: 'Remote', value: 'Remote' },
      ],
      admin: { condition: (data) => data.type === 'private' },
    },
    {
      name: 'experience',
      type: 'text',
      admin: { condition: (data) => data.type === 'private' },
    },
    // --- Shared Filters ---
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'qualification',
      type: 'text',
    },
    {
      name: 'keywords',
      type: 'text',
    },
    {
      name: 'lastMatchedAt',
      type: 'date',
    },
    {
      name: 'lastNotifiedAt',
      type: 'date',
    }
  ],
}
