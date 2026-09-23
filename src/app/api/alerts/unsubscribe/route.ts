import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const type = request.nextUrl.searchParams.get('type');
  const alertId = request.nextUrl.searchParams.get('alertId');

  if (!token || !type) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const payload = await getPayload({ config: configPromise });

  try {
    if (type === 'all') {
      const users = await payload.find({
        collection: 'users',
        where: { globalUnsubscribeToken: { equals: token } },
        limit: 1,
        overrideAccess: true,
      });

      if (users.totalDocs === 0) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
      }

      await payload.update({
        collection: 'users',
        id: users.docs[0].id,
        data: {
          // @ts-ignore
          preferences: {
            // @ts-ignore
            ...(users.docs[0].preferences || {}),
            emailAlerts: false,
          }
        },
        overrideAccess: true,
      });

      return new NextResponse('<html><head><title>Unsubscribed</title><style>body{font-family:sans-serif;text-align:center;padding:50px;}</style></head><body><h1>Unsubscribed</h1><p>You have successfully unsubscribed from all email job alerts.</p></body></html>', { headers: { 'content-type': 'text/html' } });

    } else if (type === 'alert') {
      if (!alertId) return NextResponse.json({ error: 'Alert ID missing' }, { status: 400 });

      const users = await payload.find({
        collection: 'users',
        where: { alertUnsubscribeToken: { equals: token } },
        limit: 1,
        overrideAccess: true,
      });

      if (users.totalDocs === 0) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
      }

      const userId = users.docs[0].id;

      // Ensure the alert belongs to this user
      const alerts = await payload.find({
        collection: 'job-alerts' as any,
        where: {
          and: [
            { id: { equals: alertId } },
            { user: { equals: userId } }
          ]
        },
        limit: 1,
        overrideAccess: true,
      });

      if (alerts.totalDocs === 0) {
        return NextResponse.json({ error: 'Alert not found or unauthorized' }, { status: 404 });
      }

      await payload.update({
        collection: 'job-alerts' as any,
        id: alertId,
        data: { isActive: false },
        overrideAccess: true,
      });

      return new NextResponse('<html><head><title>Alert Disabled</title><style>body{font-family:sans-serif;text-align:center;padding:50px;}</style></head><body><h1>Alert Disabled</h1><p>This specific job alert has been successfully turned off.</p></body></html>', { headers: { 'content-type': 'text/html' } });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
