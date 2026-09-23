import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload();

    const jobRes = await payload.find({
      collection: 'jobs',
      where: { 
        and: [
          { id: { equals: id } },
          { isArchived: { not_equals: true } },
          { status: { not_equals: 'Closed' } }
        ]
      },
      limit: 1,
      depth: 0
    });
    
    if (jobRes.docs.length === 0) {
      return NextResponse.json({ error: 'Job not found or unavailable' }, { status: 404 });
    }

    const job = jobRes.docs[0] as any;

    const cookieStore = await cookies();
    const token = cookieStore.get("payload-token")?.value;

    // Rate limiting: prevent same user/session from incrementing the same job repeatedly
    const clickCookieName = `clicked_job_${id}`;
    if (cookieStore.get(clickCookieName)) {
      return NextResponse.json({ success: true, message: 'Already tracked' });
    }

    await payload.update({
      collection: 'jobs' as any,
      id: id,
      data: {
        applyClicks: (job.applyClicks || 0) + 1,
      } as any,
      overrideAccess: true, // System operation
    });



    const response = NextResponse.json({ success: true });
    // Set a cookie that expires in 24 hours to prevent repeated clicks from the same device
    response.cookies.set(clickCookieName, '1', { maxAge: 60 * 60 * 24, httpOnly: true });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
