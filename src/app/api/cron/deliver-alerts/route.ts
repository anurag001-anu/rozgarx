import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { sql } from 'drizzle-orm';
import { verifyCronAuth } from '@/lib/cron-auth';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || 'alerts@rozgarx.com';
const resend = resendApiKey ? new Resend(resendApiKey) : null;


export const maxDuration = 300; // 5 minutes max duration on Vercel
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!verifyCronAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await getPayload({ config: configPromise });
    
    let stats = {
      stuckRecovered: 0,
      claimed: 0,
      sent: 0,
      failedAndRequeued: 0,
      failedPermanently: 0,
    };

    // 1. Recover stuck 'processing' records (older than 15 minutes)
    try {
      const recoverRes = await payload.db.drizzle.execute(sql`
        UPDATE notification_history
        SET status = 'queued', updated_at = NOW()
        WHERE status = 'processing' 
          AND updated_at < NOW() - INTERVAL '15 minutes'
        RETURNING id;
      `);
      stats.stuckRecovered = recoverRes.rows.length;
    } catch (err) {
      console.error('Error recovering stuck records:', err);
    }

    // 2. Atomic Claim via FOR UPDATE SKIP LOCKED
    // We only process queued notifications where next_attempt_at is in the past or null.
    let claimedRows: any[] = [];
    try {
      const claimRes = await payload.db.drizzle.execute(sql`
        UPDATE notification_history
        SET status = 'processing', updated_at = NOW()
        WHERE id IN (
          SELECT id FROM notification_history
          WHERE status = 'queued' 
            AND (next_attempt_at IS NULL OR next_attempt_at <= NOW())
          ORDER BY created_at ASC
          LIMIT 50
          FOR UPDATE SKIP LOCKED
        )
        RETURNING *;
      `);
      claimedRows = claimRes.rows;
      stats.claimed = claimedRows.length;
    } catch (err) {
      console.error('Error claiming records:', err);
      return NextResponse.json({ error: 'Database claim failed', details: err }, { status: 500 });
    }

    if (claimedRows.length === 0) {
      return NextResponse.json({ message: 'No queued notifications to process', stats });
    }

    // 3. Process Claimed Notifications
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    for (const record of claimedRows) {
      const id = record.id;
      let currentAttempts = record.attempts || 0;
      currentAttempts++;
      
      const now = new Date();
      let resultStatus: 'sent' | 'skipped' | 'failed' | 'queued' = 'queued';
      let errorLog = record.error_log || '';

      try {
        const user = await payload.findByID({ collection: 'users', id: record.user_id }) as any;
        const job = await payload.findByID({ collection: 'jobs', id: record.job_id }) as any;

        // Check if user has valid email and preferences
        if (!user.email || user.preferences?.emailAlerts === false) {
          resultStatus = 'skipped';
          errorLog = 'Skipped: User unsubscribed or missing email';
        } else if (resend) {
          // Generate Unsubscribe links
          const unsubAlertUrl = `${baseUrl}/api/alerts/unsubscribe?token=${user.alertUnsubscribeToken}&type=alert&alertId=${record.job_alert_id}`;
          const unsubAllUrl = `${baseUrl}/api/alerts/unsubscribe?token=${user.globalUnsubscribeToken}&type=all`;
          
          // Job URL
          const jobUrl = `${baseUrl}/jobs/${job.id}`;
          
          let orgName = job.type === 'government' ? job.organization : (typeof job.company === 'object' ? job.company?.name : 'Company');
          
          // Basic extract logic for richText
          const extractText = (nodes: any[]): string => {
            let str = '';
            for (const n of nodes) {
              if (n.text) str += n.text + ' ';
              if (n.children) str += extractText(n.children);
            }
            return str;
          };
          const rawDescription = extractText(job.description?.root?.children || []).substring(0, 150) + '...';

          const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Job Alert Matching Your Preferences</h2>
              <p><strong>Job Title:</strong> ${job.title}</p>
              <p><strong>Type:</strong> ${job.type === 'government' ? 'Government' : 'Private'}</p>
              <p><strong>Organization:</strong> ${orgName}</p>
              <p><strong>Location:</strong> ${job.location || 'N/A'}</p>
              ${job.lastDate ? `<p><strong>Last Date:</strong> ${new Date(job.lastDate).toLocaleDateString()}</p>` : ''}
              
              <p><strong>Description:</strong></p>
              <p>${rawDescription}</p>

              <div style="margin: 30px 0;">
                <a href="${jobUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Job on RozgarX</a>
                ${job.applyUrl ? `<br/><br/><a href="${job.applyUrl}" style="color: #0070f3; text-decoration: underline;">Apply on Official Website</a>` : ''}
              </div>

              <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #666;">
                <p><em>RozgarX does not submit applications. Apply on the official website.</em></p>
                <p>
                  <a href="${unsubAlertUrl}">Unsubscribe from this alert</a> | 
                  <a href="${unsubAllUrl}">Unsubscribe from all job-alert emails</a>
                </p>
              </div>
            </div>
          `;

          const { error } = await resend.emails.send({
            from: emailFrom,
            to: user.email,
            subject: `Job Alert: ${job.title}`,
            html: htmlContent,
          });

          if (error) {
            resultStatus = 'failed'; // We handle retry logic below if currentAttempts < 3
            errorLog = error.message;
          } else {
            resultStatus = 'sent';
          }
        } else {
          // Test mode simulation when no RESEND_API_KEY
          await new Promise(resolve => setTimeout(resolve, 50));
          resultStatus = 'sent';
          errorLog = 'Test Mode: No Resend API Key';
        }
      } catch (err: any) {
        resultStatus = 'failed';
        errorLog = err.message;
      }

      // 4. Update Database based on result
      if (resultStatus === 'sent' || resultStatus === 'skipped') {
        await payload.update({
          collection: 'notification-history' as any,
          id: id,
          data: {
            status: resultStatus,
            attempts: currentAttempts,
            lastAttemptAt: now.toISOString(),
            errorLog: errorLog,
          },
          overrideAccess: true,
        });
        if (resultStatus === 'sent') stats.sent++;
      } else {
        // Handle Failure
        if (currentAttempts >= 3) {
          // Permanent failure
          await payload.update({
            collection: 'notification-history' as any,
            id: id,
            data: {
              status: 'failed',
              attempts: currentAttempts,
              lastAttemptAt: now.toISOString(),
              errorLog: errorLog,
            },
            overrideAccess: true,
          });
          stats.failedPermanently++;
        } else {
          // Requeue with exponential backoff (e.g. 5 mins -> 25 mins)
          const backoffMinutes = Math.pow(5, currentAttempts); 
          const nextAttempt = new Date(now.getTime() + backoffMinutes * 60000);
          
          await payload.update({
            collection: 'notification-history' as any,
            id: id,
            data: {
              status: 'queued',
              attempts: currentAttempts,
              lastAttemptAt: now.toISOString(),
              nextAttemptAt: nextAttempt.toISOString(),
              errorLog: errorLog,
            },
            overrideAccess: true,
          });
          stats.failedAndRequeued++;
        }
      }
    }

    return NextResponse.json({
      message: 'Delivery batch processed',
      stats
    });

  } catch (error: any) {
    console.error('Deliver Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
