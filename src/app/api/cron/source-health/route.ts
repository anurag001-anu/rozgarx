import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { verifyCronAuth } from '@/lib/cron-auth';

export async function GET(request: Request) {
  try {
    if (!verifyCronAuth(request as NextRequest)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await getPayload();

    // Prioritize jobs that are active, closing soon, or recently updated
    const jobsRes = await payload.find({
      collection: 'jobs',
      where: {
        and: [
          { isArchived: { not_equals: true } },
          { applyUrl: { exists: true } },
          {
            or: [
              { status: { equals: 'open' } },
              { status: { equals: 'closing soon' } },
            ]
          }
        ]
      },
      limit: 100, // Process in batches to avoid Vercel timeouts
      sort: '-updatedAt'
    });

    let healthy = 0;
    let warning = 0;
    let broken = 0;

    for (const job of jobsRes.docs as any[]) {
      if (!job.applyUrl) continue;

      let linkHealth = 'Healthy';

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(job.applyUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        clearTimeout(timeoutId);

        if (response.status >= 200 && response.status < 400) {
          linkHealth = 'Healthy';
        } else if (response.status >= 400 && response.status < 500) {
          linkHealth = 'Broken';
        } else {
          linkHealth = 'Warning';
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          linkHealth = 'Warning'; // Timeout is a warning, not strictly broken
        } else {
          linkHealth = 'Broken'; // DNS or network failure
        }
      }

      // Update linkHealth in DB, but DO NOT modify lastVerifiedAt or isArchived
      if (job.linkHealth !== linkHealth) {
        await payload.update({
          collection: 'jobs' as any,
          id: job.id,
          data: {
            linkHealth,
            lastCheckedAt: new Date().toISOString()
          } as any,
          overrideAccess: true,
        });

        if (linkHealth === 'Healthy') healthy++;
        if (linkHealth === 'Warning') warning++;
        if (linkHealth === 'Broken') broken++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: jobsRes.docs.length,
      updates: { healthy, warning, broken }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
