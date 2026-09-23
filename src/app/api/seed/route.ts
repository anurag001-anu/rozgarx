import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production' }, { status: 403 });
  }

  const payload = await getPayload({ config: configPromise })

  try {
    // 1. Create a default admin user if not exists
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@rozgarx.com' } },
    })

    let adminUser
    if (users.totalDocs === 0) {
      adminUser = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@rozgarx.com',
          password: 'password123',
          name: 'Admin User',
          role: 'admin',
        },
      })
    } else {
      adminUser = users.docs[0]
    }

    // 2. Create Companies
    const companies = await payload.find({ collection: 'companies' })
    let companyDocs = companies.docs
    
    if (companyDocs.length === 0) {
      const companyData = [
        { name: 'Tech Mahindra', industry: 'IT & Software', location: 'Pune', website: 'https://techmahindra.com', size: '10000+' },
        { name: 'Infosys', industry: 'IT & Software', location: 'Bengaluru', website: 'https://infosys.com', size: '10000+' },
        { name: 'HDFC Bank', industry: 'Banking', location: 'Mumbai', website: 'https://hdfcbank.com', size: '10000+' },
        { name: 'TCS', industry: 'IT & Software', location: 'Mumbai', website: 'https://tcs.com', size: '10000+' },
      ]

      const createdCompanies = []
      for (const data of companyData) {
        const company = await payload.create({
          collection: 'companies',
          data,
        })
        createdCompanies.push(company)
      }
      companyDocs = createdCompanies
    }

    // 3. Create Private Jobs
    const privateJobsCount = await payload.find({ collection: 'jobs', where: { type: { equals: 'private' } } })
    if (privateJobsCount.totalDocs === 0 && companyDocs.length > 0) {
      const privateJobsData = [
        {
          title: 'Senior Frontend Developer',
          type: 'private' as const,
          description: {
            root: {
              type: 'root',
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  direction: 'ltr' as const,
                  format: '' as const,
                  indent: 0,
                  version: 1,
                  children: [{ mode: 'normal', text: 'We are looking for an experienced Frontend Developer skilled in React and Next.js.', type: 'text', detail: 0, format: 0, style: '' }],
                },
              ],
            },
          },
          location: 'Bengaluru',
          salary: '₹12,00,000 - ₹18,00,000',
          company: companyDocs[1].id,
          experience: '3-5 Years',
          workMode: 'Hybrid' as const,
          jobType: 'Full Time' as const,
          owner: adminUser.id,
        },
        {
          title: 'Banking Associate',
          type: 'private' as const,
          description: {
            root: {
              type: 'root',
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  direction: 'ltr' as const,
                  format: '' as const,
                  indent: 0,
                  version: 1,
                  children: [{ mode: 'normal', text: 'Hiring for Banking Associates with good communication skills.', type: 'text', detail: 0, format: 0, style: '' }],
                },
              ],
            },
          },
          location: 'Mumbai',
          salary: '₹3,00,000 - ₹5,00,000',
          company: companyDocs[2].id,
          experience: '0-2 Years',
          workMode: 'On-site' as const,
          jobType: 'Full Time' as const,
          owner: adminUser.id,
        },
      ]

      for (const data of privateJobsData) {
        await payload.create({
          collection: 'jobs',
          data,
        })
      }
    }

    // 4. Create Government Jobs
    const govtJobsCount = await payload.find({ collection: 'jobs', where: { type: { equals: 'government' } } })
    if (govtJobsCount.totalDocs === 0) {
      const govtJobsData = [
        {
          title: 'SSC CGL 2024 Recruitment',
          type: 'government' as const,
          description: {
            root: {
              type: 'root',
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  direction: 'ltr' as const,
                  format: '' as const,
                  indent: 0,
                  version: 1,
                  children: [{ mode: 'normal', text: 'Staff Selection Commission is conducting CGL examination for various Group B and Group C posts.', type: 'text', detail: 0, format: 0, style: '' }],
                },
              ],
            },
          },
          location: 'All India',
          salary: 'Pay Level 4 to 8',
          organization: 'Staff Selection Commission (SSC)',
          vacancies: 7500,
          qualification: 'Bachelor’s Degree',
          ageLimit: '18 - 32 Years',
          lastDate: '2024-10-30T00:00:00.000Z',
          owner: adminUser.id,
        },
        {
          title: 'SBI Probationary Officer (PO)',
          type: 'government' as const,
          description: {
            root: {
              type: 'root',
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  direction: 'ltr' as const,
                  format: '' as const,
                  indent: 0,
                  version: 1,
                  children: [{ mode: 'normal', text: 'State Bank of India invites applications for the post of Probationary Officer.', type: 'text', detail: 0, format: 0, style: '' }],
                },
              ],
            },
          },
          location: 'All India',
          salary: 'Basic Pay ₹41,960',
          organization: 'State Bank of India (SBI)',
          vacancies: 2000,
          qualification: 'Graduation in any discipline',
          ageLimit: '21 - 30 Years',
          lastDate: '2024-09-15T00:00:00.000Z',
          owner: adminUser.id,
        },
      ]

      for (const data of govtJobsData) {
        await payload.create({
          collection: 'jobs',
          data,
        })
      }
    }

    return NextResponse.json({ message: 'Database successfully seeded with dummy data!' })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Failed to seed database. Check server logs.' }, { status: 500 })
  }
}
