import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { sql, SQL } from 'drizzle-orm';
import { ipRateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    // Rate Limiting
    if (ipRateLimit) {
      const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
      const { success } = await ipRateLimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    const govtCategory = searchParams.get('govtCategory');
    const privateCategory = searchParams.get('privateCategory');
    const location = searchParams.get('location');
    const qualification = searchParams.get('qualification');
    const experience = searchParams.get('experience');
    const workModes = searchParams.getAll('workMode'); // can be multiple
    const jobTypes = searchParams.getAll('jobType');
    const salary = searchParams.get('salary');
    const isVerified = searchParams.get('isVerified') === 'true';
    const statusFilter = searchParams.get('status');
    
    // Pagination Clamps
    let page = parseInt(searchParams.get('page') || '1');
    if (isNaN(page) || page < 1) page = 1;
    if (page > 100) page = 100; // max page limit

    let limit = parseInt(searchParams.get('limit') || '50');
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50; // max limit per page

    const sort = searchParams.get('sort') || (q ? 'relevance' : 'newest');

    const offset = (page - 1) * limit;

    const payload = await getPayload();
    const db = payload.db.drizzle;

    // 1. Base conditions
    const conditions: SQL[] = [
      sql`j.is_archived IS NOT TRUE`,
      sql`j._status = 'published'`,
      
    ];

    let searchSelect: SQL = sql``;
    let searchOrderBy: SQL = sql`ORDER BY j.created_at DESC`;

    if (q) {
      conditions.push(sql`(
        j.search_vector @@ websearch_to_tsquery('english', ${q}) OR
        j.title ILIKE ${'%' + q + '%'} OR
        j.organization ILIKE ${'%' + q + '%'} OR
        j.skills ILIKE ${'%' + q + '%'}
      )`);
      
      if (sort === 'relevance') {
        searchSelect = sql`, ts_rank(j.search_vector, websearch_to_tsquery('english', ${q})) as rank`;
        searchOrderBy = sql`ORDER BY rank DESC, j.created_at DESC`;
      }
    }

    if (type) conditions.push(sql`j.type = ${type}`);
    if (govtCategory) conditions.push(sql`j.govt_category = ${govtCategory}`);
    if (privateCategory) conditions.push(sql`j.private_category = ${privateCategory}`);
    if (location) conditions.push(sql`j.location ILIKE ${'%' + location + '%'}`);
    if (qualification) conditions.push(sql`j.qualification ILIKE ${'%' + qualification + '%'}`);
    if (experience) conditions.push(sql`j.experience ILIKE ${'%' + experience + '%'}`);
    if (salary) conditions.push(sql`j.salary ILIKE ${'%' + salary + '%'}`);
    if (isVerified) conditions.push(sql`j.is_verified = true`);

    if (workModes.length > 0) {
      conditions.push(sql`j.work_mode IN ${workModes}`);
    }

    if (jobTypes.length > 0) {
      conditions.push(sql`j.job_type IN ${jobTypes}`);
    }

    if (statusFilter && (statusFilter === 'open' || statusFilter === 'closing soon')) {
      conditions.push(sql`j.status = ${statusFilter}`);
    }

    // Sorting
    if (sort === 'newest') searchOrderBy = sql`ORDER BY j.created_at DESC`;
    if (sort === 'closing_soon') searchOrderBy = sql`ORDER BY j.last_date ASC NULLS LAST`;
    if (sort === 'recently_updated') searchOrderBy = sql`ORDER BY j.updated_at DESC`;

    const whereClause = sql`WHERE ${sql.join(conditions, sql` AND `)}`;

    // 3. Count Query
    const countQuery = sql`SELECT COUNT(*) as count FROM jobs j ${whereClause}`;
    const countRes = await db.execute(countQuery);
    const totalDocs = parseInt(countRes.rows[0].count as string);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;

    // 4. Data Query
    const dataQuery = sql`
      SELECT 
        j.id, j.title, j.type, j.location, j.salary, j.experience, 
        j.work_mode as "workMode", j.job_type as "jobType", 
        j.organization, j.created_at as "createdAt", j.updated_at as "updatedAt",
        j.last_date as "lastDate", j.status, j.is_verified as "isVerified",
        j.apply_url as "applyUrl", j.private_category as "privateCategory",
        j.govt_category as "govtCategory", j.vacancies,
        json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as company
        ${searchSelect}
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      ${whereClause}
      ${searchOrderBy}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const dataRes = await db.execute(dataQuery);
    
    // Process results to handle null companies gracefully
    const docs = dataRes.rows.map(row => ({
      ...row,
      company: (row.company as any)?.id ? row.company : null
    }));

    return NextResponse.json({
      docs,
      totalDocs,
      limit,
      totalPages,
      page,
      hasNextPage,
      hasPrevPage: page > 1,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null
    });

  } catch (err: any) {
    console.error('Search API Error:', err);
    return NextResponse.json({ error: 'Internal Search Error' }, { status: 500 });
  }
}
