import { NextResponse, NextRequest } from 'next/server';
import { getPayload } from '@/lib/payload';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production' }, { status: 403 });
  }

  try {
    const payload = await getPayload();

    const jobsRes = await payload.find({
      collection: 'jobs',
      limit: 100000,
    });

    const docs = jobsRes.docs;
    
    let totalJobs = docs.length;
    let govtJobs = 0;
    let privateJobs = 0;
    let withApplyUrl = 0;
    let withoutApplyUrl = 0;
    
    let missingDiscoveredAt = 0;
    let missingLastVerifiedAt = 0;
    let missingSourceRegistry = 0;
    
    let possibleDuplicates = 0;
    let strongDuplicateSet = new Set();
    let strongDuplicates = 0;

    let verificationStatusCounts: any = {};

    for (const job of docs as any[]) {
      if (job.type === 'government') govtJobs++;
      else if (job.type === 'private') privateJobs++;
      
      if (job.applyUrl) withApplyUrl++;
      else withoutApplyUrl++;

      if (!job.discoveredAt) missingDiscoveredAt++;
      if (!job.lastVerifiedAt) missingLastVerifiedAt++;
      if (!job.sourceRegistry) missingSourceRegistry++;

      if (job.isPossibleDuplicate) possibleDuplicates++;

      let strongKey = '';
      if (job.type === 'government' && job.advertisementNumber && job.organization) {
        strongKey = `govt_${job.advertisementNumber}_${job.organization}`;
      } else if (job.applyUrl && job.title) {
        strongKey = `url_${job.applyUrl}_${job.title}`;
      }

      if (strongKey) {
        if (strongDuplicateSet.has(strongKey)) {
          strongDuplicates++;
        } else {
          strongDuplicateSet.add(strongKey);
        }
      }

      const vStatus = job.verificationStatus || 'Draft';
      verificationStatusCounts[vStatus] = (verificationStatusCounts[vStatus] || 0) + 1;
    }

    return NextResponse.json({
      totalJobs,
      govtJobs,
      privateJobs,
      withApplyUrl,
      withoutApplyUrl,
      verificationStatusCounts,
      missingDiscoveredAt,
      missingLastVerifiedAt,
      missingSourceRegistry,
      possibleDuplicates,
      strongDuplicates,
      message: 'DRY RUN COMPLETE. NO DATA MODIFIED.'
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
