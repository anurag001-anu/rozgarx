import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const payload = await getPayload();

    // 1. Create an admin user if it doesn't exist
    let adminUser;
    const usersRes = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@rozgarx.com' } },
    });

    if (usersRes.docs.length > 0) {
      adminUser = usersRes.docs[0];
    } else {
      adminUser = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@rozgarx.com',
          password: 'password123',
          name: 'Super Admin',
          role: 'admin',
        },
      });
    }

    const adminId = adminUser.id;

    // 2. Create Companies
    const companiesData = [
      { name: 'TechNova Solutions', industry: 'IT & Software', location: 'Bengaluru, Karnataka', openPositions: 12 },
      { name: 'Global Finance Corp', industry: 'Banking & Finance', location: 'Mumbai, Maharashtra', openPositions: 8 },
      { name: 'HealthPlus Care', industry: 'Healthcare', location: 'Delhi, NCR', openPositions: 15 },
      { name: 'BuildRight Construction', industry: 'Real Estate', location: 'Hyderabad, Telangana', openPositions: 5 },
    ];

    const createdCompanies = [];
    for (const comp of companiesData) {
      const existing = await payload.find({ collection: 'companies', where: { name: { equals: comp.name } } });
      if (existing.docs.length === 0) {
        const created = await payload.create({
          collection: 'companies',
          data: {
            ...comp,
            owner: adminId,
            description: {
              root: {
                type: 'root',
                direction: 'ltr',
                format: 'left',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: `Leading company in the ${comp.industry} sector.` }]
                  }
                ]
              }
            } as any,
          },
        });
        createdCompanies.push(created);
      } else {
        createdCompanies.push(existing.docs[0]);
      }
    }

    if (createdCompanies.length === 0) {
        return NextResponse.json({ message: 'Data already exists or seeded!' });
    }

    // 3. Create Private Jobs
    const privateJobsData = [
      {
        title: 'Senior Frontend Developer',
        type: 'private' as const,
        location: 'Bengaluru, Karnataka',
        salary: '₹12,00,000 - ₹18,00,000 P.A.',
        company: createdCompanies[0].id,
        experience: '4-6 years',
        workMode: 'Hybrid' as const,
        jobType: 'Full Time' as const,
      },
      {
        title: 'Investment Banker',
        type: 'private' as const,
        location: 'Mumbai, Maharashtra',
        salary: '₹20,00,000 - ₹30,00,000 P.A.',
        company: createdCompanies[1].id,
        experience: '5-8 years',
        workMode: 'On-site' as const,
        jobType: 'Full Time' as const,
      },
      {
        title: 'Clinical Data Analyst',
        type: 'private' as const,
        location: 'Remote',
        salary: '₹6,00,000 - ₹10,00,000 P.A.',
        company: createdCompanies[2].id,
        experience: '2-4 years',
        workMode: 'Remote' as const,
        jobType: 'Contract' as const,
      },
      {
        title: 'Civil Site Engineer',
        type: 'private' as const,
        location: 'Hyderabad, Telangana',
        salary: '₹4,00,000 - ₹7,00,000 P.A.',
        company: createdCompanies[3].id,
        experience: '3-5 years',
        workMode: 'On-site' as const,
        jobType: 'Full Time' as const,
      },
      {
        title: 'React Native Developer',
        type: 'private' as const,
        location: 'Pune, Maharashtra',
        salary: '₹8,00,000 - ₹14,00,000 P.A.',
        company: createdCompanies[0].id,
        experience: '2-5 years',
        workMode: 'Hybrid' as const,
        jobType: 'Full Time' as const,
      }
    ];

    for (const job of privateJobsData) {
      const existing = await payload.find({ collection: 'jobs', where: { title: { equals: job.title } } });
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'jobs',
          data: {
            ...job,
            owner: adminId,
            description: {
              root: {
                type: 'root',
                direction: 'ltr',
                format: 'left',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: `We are looking for a highly skilled ${job.title} to join our team.` }]
                  }
                ]
              }
            } as any,
          },
        });
      }
    }

    // 4. Create Govt Jobs
    const govtJobsData = [
      {
        title: 'SSC CGL 2026',
        type: 'government' as const,
        location: 'All India',
        salary: 'Level 4 to Level 8',
        organization: 'Staff Selection Commission (SSC)',
        vacancies: 7500,
        qualification: 'Bachelor Degree in Any Stream',
        ageLimit: '18-32 Years',
        lastDate: '2026-10-15T00:00:00.000Z',
      },
      {
        title: 'SBI Probationary Officer (PO)',
        type: 'government' as const,
        location: 'All India',
        salary: '₹41,960 Basic Pay',
        organization: 'State Bank of India',
        vacancies: 2000,
        qualification: 'Graduation in any discipline',
        ageLimit: '21-30 Years',
        lastDate: '2026-09-20T00:00:00.000Z',
      },
      {
        title: 'UPSC Civil Services 2026',
        type: 'government' as const,
        location: 'All India',
        salary: 'Level 10 (Starting)',
        organization: 'Union Public Service Commission',
        vacancies: 1105,
        qualification: 'Bachelor Degree',
        ageLimit: '21-32 Years',
        lastDate: '2026-03-05T00:00:00.000Z',
      },
      {
        title: 'Railway RRB NTPC',
        type: 'government' as const,
        location: 'All India',
        salary: 'Level 2 to 6',
        organization: 'Railway Recruitment Board',
        vacancies: 10500,
        qualification: '12th Pass / Graduate',
        ageLimit: '18-30 Years',
        lastDate: '2026-11-10T00:00:00.000Z',
      },
      {
        title: 'UP Police Constable',
        type: 'government' as const,
        location: 'Uttar Pradesh',
        salary: '₹21,700 - ₹69,100',
        organization: 'UP Police Recruitment Board',
        vacancies: 60244,
        qualification: '12th Intermediate Passed',
        ageLimit: '18-25 Years',
        lastDate: '2026-08-30T00:00:00.000Z',
      }
    ];

    for (const job of govtJobsData) {
      const existing = await payload.find({ collection: 'jobs', where: { title: { equals: job.title } } });
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'jobs',
          data: {
            ...job,
            owner: adminId,
            description: {
              root: {
                type: 'root',
                direction: 'ltr',
                format: 'left',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [{ type: 'text', version: 1, text: `Official Notification for ${job.title} recruitment.` }]
                  }
                ]
              }
            } as any,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
