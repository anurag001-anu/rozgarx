import { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rozgarx.com';
const LIMIT = 50000;

export async function generateSitemaps() {
  const payload = await getPayload({ config: configPromise });
  
  // To handle pagination, we count the total active jobs.
  const jobsCount = await payload.count({
    collection: 'jobs',
    where: { 
      and: [
        { isArchived: { not_equals: true } },
        
        { _status: { equals: 'published' } }
      ]
    }
  });
  
  // Calculate total chunks. If 0 jobs, we still need 1 chunk for static routes.
  const totalJobs = jobsCount.totalDocs;
  const numChunks = Math.max(1, Math.ceil(totalJobs / LIMIT));
  
  return Array.from({ length: numChunks }).map((_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise });
  const sitemap: MetadataRoute.Sitemap = [];

  // Only include static routes and non-paginated items in the first chunk (id: 0)
  if (id === 0) {
    // Core Static Routes
    sitemap.push({ url: `${SITE_URL}`, lastModified: new Date(), priority: 1.0 });
    sitemap.push({ url: `${SITE_URL}/government`, lastModified: new Date(), priority: 0.9 });
    sitemap.push({ url: `${SITE_URL}/private`, lastModified: new Date(), priority: 0.9 });
    sitemap.push({ url: `${SITE_URL}/jobs`, lastModified: new Date(), priority: 0.8 });
    sitemap.push({ url: `${SITE_URL}/companies`, lastModified: new Date(), priority: 0.9 });

    // Govt Category Routes
    const govtCategories = ['ssc', 'upsc', 'railway', 'banking', 'defence', 'police', 'teaching', 'state-government', 'other'];
    for (const cat of govtCategories) {
      const rawCat = cat.replace(/-/g, ' ');
      const catJobsCount = await payload.count({
        collection: 'jobs',
        where: {
          and: [
            { type: { equals: 'government' } },
            { govtCategory: { equals: ['ssc', 'upsc'].includes(rawCat) ? rawCat.toUpperCase() : (rawCat === 'state government' ? 'State Government' : rawCat.charAt(0).toUpperCase() + rawCat.slice(1)) } },
            { _status: { equals: 'published' } },
            { isArchived: { not_equals: true } }
          ]
        }
      });
      if (catJobsCount.totalDocs > 0) {
        sitemap.push({ url: `${SITE_URL}/government/${cat}`, lastModified: new Date(), priority: 0.8 });
      }
    }

    // Private Category Routes
    const privateCategories = ['it-software', 'engineering', 'finance', 'sales', 'marketing', 'healthcare', 'bpo', 'internship', 'remote', 'other'];
    for (const cat of privateCategories) {
      const rawCat = cat === 'it-software' ? 'IT & Software' : (cat === 'bpo' ? 'BPO' : cat.charAt(0).toUpperCase() + cat.slice(1));
      const catJobsCount = await payload.count({
        collection: 'jobs',
        where: {
          and: [
            { type: { equals: 'private' } },
            { privateCategory: { equals: rawCat } },
            
            { _status: { equals: 'published' } },
            { isArchived: { not_equals: true } }
          ]
        }
      });
      if (catJobsCount.totalDocs > 0) {
        sitemap.push({ url: `${SITE_URL}/private/${cat}`, lastModified: new Date(), priority: 0.8 });
      }
    }

    // Independent Optional Collections
    // 1. Results
    try {
      const results = await payload.find({
        collection: 'results' as any,
        limit: LIMIT,
        where: { and: [{ isPublished: { equals: true } }, { isArchived: { not_equals: true } }] },
        select: { slug: true, updatedAt: true }
      });
      results.docs.forEach((doc: any) => sitemap.push({ url: `${SITE_URL}/government/results/${doc.slug}`, lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(), priority: 0.8 }));
    } catch (e: any) {
      console.warn(`[Sitemap] Skipping results collection: ${e.message}`);
    }

    // 2. Admit Cards
    try {
      const admitCards = await payload.find({
        collection: 'admit-cards' as any,
        limit: LIMIT,
        where: { and: [{ isPublished: { equals: true } }, { isArchived: { not_equals: true } }] },
        select: { slug: true, updatedAt: true }
      });
      admitCards.docs.forEach((doc: any) => sitemap.push({ url: `${SITE_URL}/government/admit-cards/${doc.slug}`, lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(), priority: 0.8 }));
    } catch (e: any) {
      console.warn(`[Sitemap] Skipping admit-cards collection: ${e.message}`);
    }

    // 3. Answer Keys
    try {
      const answerKeys = await payload.find({
        collection: 'answer-keys' as any,
        limit: LIMIT,
        where: { and: [{ isPublished: { equals: true } }, { isArchived: { not_equals: true } }] },
        select: { slug: true, status: true, description: true, updatedAt: true }
      });
      answerKeys.docs.forEach((doc: any) => {
        const isThin = doc.status === 'Not Released' && !doc.description;
        if (!isThin) sitemap.push({ url: `${SITE_URL}/government/answer-keys/${doc.slug}`, lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(), priority: 0.8 });
      });
    } catch (e: any) {
      console.warn(`[Sitemap] Skipping answer-keys collection: ${e.message}`);
    }

    // 4. Syllabuses
    try {
      const syllabuses = await payload.find({
        collection: 'syllabuses' as any,
        limit: LIMIT,
        where: { and: [{ isPublished: { equals: true } }, { isArchived: { not_equals: true } }] },
        select: { slug: true, updatedAt: true }
      });
      syllabuses.docs.forEach((doc: any) => sitemap.push({ url: `${SITE_URL}/government/syllabuses/${doc.slug}`, lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(), priority: 0.8 }));
    } catch (e: any) {
      console.warn(`[Sitemap] Skipping syllabuses collection: ${e.message}`);
    }

    // 5. Govt Notifications
    try {
      const notifications = await payload.find({
        collection: 'govt-notifications' as any,
        limit: LIMIT,
        where: { and: [{ isPublished: { equals: true } }, { isArchived: { not_equals: true } }] },
        select: { slug: true, updatedAt: true }
      });
      notifications.docs.forEach((doc: any) => sitemap.push({ url: `${SITE_URL}/government/notifications/${doc.slug}`, lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(), priority: 0.8 }));
    } catch (e: any) {
      console.warn(`[Sitemap] Skipping govt-notifications collection: ${e.message}`);
    }

    // 6. Companies
    try {
      const companies = await payload.find({
        collection: 'companies' as any,
        limit: LIMIT,
        where: { and: [{ isPublished: { equals: true } }, { isArchived: { not_equals: true } }] },
        select: { slug: true, updatedAt: true, description: true, id: true }
      });
      for (const doc of companies.docs) {
        const d = doc as any;
        const hasDesc = d.description;
        let hasActiveJobs = false;
        if (!hasDesc) {
          const activeJobs = await payload.count({
            collection: 'jobs',
            where: {
              and: [
                { company: { equals: d.id } },
                { type: { equals: 'private' } },
                
                { _status: { equals: 'published' } }
              ]
            }
          });
          hasActiveJobs = activeJobs.totalDocs > 0;
        }
        if (hasDesc || hasActiveJobs) {
          sitemap.push({ url: `${SITE_URL}/companies/${d.slug}`, lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(), priority: 0.8 });
        }
      }
    } catch (e: any) {
      console.warn(`[Sitemap] Skipping companies collection: ${e.message}`);
    }
  }

  // Paginated Job URLs
  const paginatedJobs = await payload.find({
    collection: 'jobs',
    limit: LIMIT,
    page: id + 1,
    depth: 0,
    where: { 
      and: [
        { isArchived: { not_equals: true } },
        
        { _status: { equals: 'published' } }
      ]
    },
    select: { id: true, type: true, status: true, updatedAt: true }
  });

  for (const job of paginatedJobs.docs) {
    const isClosed = (job as any).status === 'closed';
    sitemap.push({
      url: `${SITE_URL}/jobs/${job.type}/${job.id}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
      priority: isClosed ? 0.4 : 0.9,
    });
  }

  return sitemap;
}
