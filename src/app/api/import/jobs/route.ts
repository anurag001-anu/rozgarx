import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production' }, { status: 403 });
  }

  try {
    const headersList = await headers();
    const token = headersList.get('Authorization')?.replace('Bearer ', '');
    const cronSecret = process.env.CRON_SECRET;

    if (!token || token !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await getPayload();
    const data = await request.json();

    if (!data.sourceRegistry) {
      return NextResponse.json({ error: 'Missing sourceRegistry' }, { status: 400 });
    }

    // 1. Source validation
    const sourceDoc = await payload.findByID({
      collection: 'job-sources' as any,
      id: data.sourceRegistry,
    });

    if (!sourceDoc) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    if (!sourceDoc.isVerified) {
      return NextResponse.json({ error: 'Source is not verified by admin' }, { status: 403 });
    }

    if (sourceDoc.type !== data.type) {
      return NextResponse.json({ error: `Type Mismatch: Source is ${sourceDoc.type}, Job is ${data.type}` }, { status: 400 });
    }

    if (sourceDoc.integrationType !== 'API_Webhook' && sourceDoc.integrationType !== 'RSS') {
      return NextResponse.json({ error: `Source does not permit automated import (${sourceDoc.integrationType})` }, { status: 403 });
    }

    // Enforce forced workflow constraints
    const safeData = {
      ...data,
      status: 'draft', // Force to draft
      verificationStatus: 'Under Review', // Force to Under Review
      isArchived: false,
      sourceRegistry: sourceDoc.id,
      discoveredAt: new Date().toISOString(),
    };

    // Payload hooks will handle Duplicate Detection automatically
    const newJob = await payload.create({
      collection: 'jobs',
      data: safeData,
      overrideAccess: true, // System operation
    });

    return NextResponse.json({ success: true, jobId: newJob.id });

  } catch (err: any) {
    if (err.message?.includes('Strong Duplicate')) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
