import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

import { ipRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Rate Limiting
    if (ipRateLimit) {
      const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
      const { success } = await ipRateLimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }
    }

    const resolvedParams = await params;
    const jobId = parseInt(resolvedParams.id, 10);
    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'Invalid Job ID' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    // Fetch base job to get its attributes for matching
    // Also verify the base job is published and not archived
    const baseJobRes = await payload.db.drizzle.execute(sql`
      SELECT id, title, type, govt_category, private_category, skills, location, updated_at
      FROM jobs
      WHERE id = ${jobId}
        AND _status = 'published'
        AND (is_archived IS NULL OR is_archived = false)
        AND status IN ('Open', 'Closing Soon')
    `);

    if (baseJobRes.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found or not eligible for similarity' }, { status: 404 });
    }

    const baseJob = baseJobRes.rows[0];

    // Caching Strategy: We return cache control headers based on the base job's updated_at 
    // to ensure if the base job changes (e.g. location/title changes), the similarity cache invalidates.
    const lastModified = new Date(baseJob.updated_at as string | number | Date).toUTCString();
    
    // Check If-Modified-Since
    const ifModifiedSince = request.headers.get('if-modified-since');
    if (ifModifiedSince && ifModifiedSince === lastModified) {
      return new NextResponse(null, { status: 304 });
    }

    const targetCategory = baseJob.type === 'government' ? baseJob.govt_category : baseJob.private_category;
    const isGovt = baseJob.type === 'government';

    // Raw SQL to leverage pg_trgm similarity and scalar weighting
    // Ecosystem Isolation strictly enforced by filtering on baseJob.type
    // We only select public-safe fields
    const similarJobsRes = await payload.db.drizzle.execute(sql`
      SELECT 
        j.id, 
        j.title, 
        j.type,
        j.govt_category as "govtCategory",
        j.private_category as "privateCategory",
        j.organization, 
        j.location, 
        j.salary,
        j.last_date as "lastDate",
        j.status,
        j.created_at as "createdAt",
        j.updated_at as "updatedAt",
        j.application_method as "applicationMethod",
        j.apply_url as "applyUrl",
        (
          (COALESCE(similarity(j.title, ${baseJob.title || ''}), 0) * 3.0) +
          (COALESCE(similarity(j.skills, ${baseJob.skills || ''}), 0) * 2.0) +
          (COALESCE(similarity(j.location, ${baseJob.location || ''}), 0) * 1.0) +
          (CASE 
            WHEN ${isGovt}::boolean AND j.govt_category::text = ${targetCategory ? targetCategory.toString() : null}::text THEN 1.0 
            WHEN NOT ${isGovt}::boolean AND j.private_category::text = ${targetCategory ? targetCategory.toString() : null}::text THEN 1.0 
            ELSE 0.0 
          END) +
          (COALESCE(j.ranking_score, 0) / 100.0)
        ) AS similarity_score
      FROM jobs j
      WHERE 
        j._status = 'published'
        AND j.status IN ('Open', 'Closing Soon')
        AND (j.is_archived IS NULL OR j.is_archived = false)
        AND j.type = ${baseJob.type}
        AND j.id != ${jobId}
      ORDER BY similarity_score DESC, j.created_at DESC
      LIMIT 6;
    `);

    return NextResponse.json(
      { jobs: similarJobsRes.rows },
      { 
        status: 200, 
        headers: { 
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'Last-Modified': lastModified
        } 
      }
    );

  } catch (error: any) {
    console.error('Similar Jobs API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
