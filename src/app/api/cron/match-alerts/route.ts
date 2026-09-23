import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { verifyCronAuth } from '@/lib/cron-auth';
import { NotificationService } from '@/services/NotificationService';

export const maxDuration = 300; // 5 minutes max duration on Vercel
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const isDryRun = request.nextUrl.searchParams.get('dryRun') === 'true';

    if (!isDryRun && !verifyCronAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await getPayload({ config: configPromise });

    // 1. Get Checkpoint
    // @ts-ignore
    const systemSettings = await payload.findGlobal({ slug: 'system-settings' });
    let lastJobMatchTimestamp = (systemSettings as any)?.lastJobMatchTimestamp;
    
    if (!lastJobMatchTimestamp) {
      // Default to 1 hour ago if not set, to prevent processing entire history
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      lastJobMatchTimestamp = oneHourAgo.toISOString();
    }

    const now = new Date().toISOString();

    // 2. Fetch Jobs to process
    const jobsRes = await payload.find({
      collection: 'jobs',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { isArchived: { not_equals: true } },
          { updatedAt: { greater_than: lastJobMatchTimestamp } },
          { updatedAt: { less_than_equal: now } },
        ]
      },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    });

    const jobsToProcess = jobsRes.docs;

    let stats = {
      jobsScanned: jobsToProcess.length,
      activeAlertsScanned: 0,
      matchingPairs: 0,
      duplicatesSkipped: 0,
      notificationsQueued: 0,
      checkpointBefore: lastJobMatchTimestamp,
      checkpointAfter: isDryRun ? lastJobMatchTimestamp : now,
    };

    if (jobsToProcess.length === 0) {
      if (!isDryRun) {
        // @ts-ignore
        await payload.updateGlobal({ slug: 'system-settings', data: { lastJobMatchTimestamp: now } });
      }
      return NextResponse.json({ message: 'No new jobs to process', stats });
    }

    // 3. Process each job
    for (const job of jobsToProcess) {
      // Find active alerts for this job type
      const alertsRes = await payload.find({
        collection: 'job-alerts' as any,
        where: {
          and: [
            { isActive: { equals: true } },
            { type: { equals: job.type } }
          ]
        },
        limit: 10000,
        depth: 0,
        overrideAccess: true,
      });

      stats.activeAlertsScanned += alertsRes.docs.length;

      // Track users matched for THIS job to ensure 1 notification per user/job
      const matchedUserIdsForJob = new Set<string>();

      for (const alert of alertsRes.docs) {
        if (NotificationService.isMatch(alert, job)) {
          const userId = typeof alert.user === 'object' ? alert.user?.id : alert.user;
          if (!userId) continue;

          stats.matchingPairs++;

          if (matchedUserIdsForJob.has(userId as string)) {
            // User already matched this job via another alert
            stats.duplicatesSkipped++;
            continue;
          }

          // Check if NotificationHistory already exists for this (user, job) pair
          const existingHistory = await payload.find({
            collection: 'notification-history' as any,
            where: {
              and: [
                { user: { equals: userId } },
                { job: { equals: job.id } }
              ]
            },
            limit: 1,
            overrideAccess: true,
          });

          if (existingHistory.totalDocs > 0) {
            stats.duplicatesSkipped++;
            continue;
          }

          // Safe to Queue!
          matchedUserIdsForJob.add(userId as string);

          if (!isDryRun) {
            try {
              await payload.create({
                collection: 'notification-history' as any,
                data: {
                  user: userId,
                  job: job.id,
                  alert: alert.id,
                  status: 'queued',
                  channels: ['in-app'], // Can be updated by Delivery later based on preferences
                  attempts: 0,
                  nextAttemptAt: new Date().toISOString(),
                },
                overrideAccess: true,
              });
              stats.notificationsQueued++;

              // Update JobAlert metadata
              await payload.update({
                collection: 'job-alerts' as any,
                id: alert.id,
                data: {
                  lastMatchedAt: new Date().toISOString(),
                },
                overrideAccess: true,
              });
            } catch (err) {
              console.error('Error creating notification history:', err);
              // Do not fail the entire batch if one insert fails
            }
          } else {
            // Dry run: just increment counter
            stats.notificationsQueued++;
          }
        }
      }
    }

    // 4. Update Checkpoint safely
    if (!isDryRun) {
      // @ts-ignore
      await payload.updateGlobal({ slug: 'system-settings', data: { lastJobMatchTimestamp: now } });
    }

    return NextResponse.json({
      message: isDryRun ? 'Dry run completed successfully' : 'Matcher completed successfully',
      stats
    });

  } catch (error: any) {
    console.error('Matcher Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
