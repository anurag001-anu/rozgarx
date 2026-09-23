import { getPayload } from "@/lib/payload";
import { verifyCronAuth } from "@/lib/cron-auth";
import { NextResponse, NextRequest } from "next/server";

// In production, you would secure this endpoint using a CRON_SECRET token
export async function GET(request: Request) {
  try {
    if (!verifyCronAuth(request as NextRequest)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await getPayload();

    const now = new Date();
    
    // 1. Mark jobs as Closed if lastDate has passed
    const expiredJobs = await payload.find({
      collection: 'jobs',
      where: {
        and: [
          { statusLock: { not_equals: true } },
          { lastDate: { less_than: now.toISOString() } },
          { status: { in: ['open', 'closing soon'] } }
        ]
      },
      limit: 1000,
    });

    let closedCount = 0;
    for (const job of expiredJobs.docs) {
      await payload.update({
        collection: 'jobs',
        id: job.id,
        data: { status: 'closed' } as any
      });
      closedCount++;
    }

    // 2. Mark jobs as Closing Soon if lastDate is within 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    const closingSoonJobs = await payload.find({
      collection: 'jobs',
      where: {
        and: [
          { statusLock: { not_equals: true } },
          { lastDate: { greater_than_equal: now.toISOString() } },
          { lastDate: { less_than_equal: threeDaysFromNow.toISOString() } },
          { status: { equals: 'open' } }
        ]
      },
      limit: 1000,
    });

    let closingSoonCount = 0;
    for (const job of closingSoonJobs.docs) {
      await payload.update({
        collection: 'jobs',
        id: job.id,
        data: { status: 'closing soon' } as any
      });
      closingSoonCount++;
    }

    return NextResponse.json({
      success: true,
      message: 'Job statuses updated successfully.',
      closed: closedCount,
      closingSoon: closingSoonCount,
    });

  } catch (error) {
    console.error('Error updating job statuses:', error);
    return NextResponse.json({ error: 'Failed to update job statuses' }, { status: 500 });
  }
}
