import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { userRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('payload-token')?.value;

  if (!token) return null;

  try {
    const secret = process.env.PAYLOAD_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userSession = await getAuthenticatedUser();
    
    // Auth Check
    if (!userSession || !userSession.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate Limiting by User ID
    if (userRateLimit) {
      const { success } = await userRateLimit.limit(`user_${userSession.id}`);
      if (!success) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }
    }

    // Role Check
    const userRole = userSession.collection === 'users' ? userSession.role : null;
    if (userRole !== 'jobseeker') {
      return NextResponse.json({ error: 'Forbidden: Employers cannot access recommendation engine' }, { status: 403 });
    }

    const payload = await getPayload({ config: configPromise });
    const userId = userSession.id;

    // 1. Gather User Signals
    // Saved Jobs (Strongest)
    const savedJobsRes = await payload.db.drizzle.execute(sql`
      SELECT j.id, j.title, j.type, j.govt_category, j.private_category, j.location, j.skills
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      WHERE sj.user_id = ${userId}
      LIMIT 10
    `);
    const savedJobs = savedJobsRes.rows;

    // Active Job Alerts (Explicit)
    const jobAlertsRes = await payload.db.drizzle.execute(sql`
      SELECT name, type, govt_category, private_category, location, keywords
      FROM job_alerts
      WHERE user_id = ${userId} AND is_active = true
      LIMIT 10
    `);
    const jobAlerts = jobAlertsRes.rows;

    // External Applications (Weak Behavioral)
    const appsRes = await payload.db.drizzle.execute(sql`
      SELECT j.id, j.title, j.type, j.govt_category, j.private_category, j.location
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.applicant_id = ${userId}
      LIMIT 10
    `);
    const apps = appsRes.rows;

    // Determine Ecosystem Priority (Govt vs Private)
    let govtCount = 0;
    let privateCount = 0;
    [...savedJobs, ...jobAlerts, ...apps].forEach((signal: any) => {
      if (signal.type === 'government') govtCount++;
      if (signal.type === 'private') privateCount++;
    });

    const hasSufficientSignals = (savedJobs.length + jobAlerts.length + apps.length) > 0;
    
    // Base filter conditions
    // 1. _status = 'published'
    // 2. status IN ('open', 'closing soon')
    // 3. is_archived IS NOT TRUE
    
    let candidateQueryStr = `
      SELECT 
        j.id, j.title, j.type, j.govt_category as "govtCategory", j.private_category as "privateCategory",
        j.organization, j.location, j.salary, j.last_date as "lastDate", j.status, j.created_at as "createdAt",
        j.application_method as "applicationMethod", j.apply_url as "applyUrl",
        COALESCE(j.ranking_score, 0) as ranking_score
      FROM jobs j
      WHERE j._status = 'published' 
         
        AND (j.is_archived IS NULL OR j.is_archived = false)
    `;

    // Strategy: We will fetch candidates from DB and then apply our scoring and reasoning in code
    // since we need exact tracebility for the reason string which is hard to do cleanly in pure SQL.
    // To avoid overfiltering, if user likes Govt, we fetch top fresh Govt jobs, if Private, top Private.
    
    if (govtCount > privateCount) {
      candidateQueryStr += ` AND j.type = 'government'`;
    } else if (privateCount > govtCount) {
      candidateQueryStr += ` AND j.type = 'private'`;
    } // else mixed

    candidateQueryStr += ` ORDER BY j.created_at DESC, j.ranking_score DESC LIMIT 100`;

    const candidatesRes = await payload.db.drizzle.execute(sql.raw(candidateQueryStr));
    const candidates = candidatesRes.rows;

    // Exclude already saved or applied jobs
    const excludedJobIds = new Set([
      ...savedJobs.map(sj => sj.id),
      ...apps.map(a => a.id)
    ]);

    const scoredCandidates = candidates
      .filter((c: any) => !excludedJobIds.has(c.id))
      .map((c: any) => {
        let score = c.ranking_score / 100.0; // Base score
        let reason = "Fresh jobs you may be interested in"; // Default generic

        if (hasSufficientSignals) {
          reason = "Based on your recent job activity"; // Weak fallback

          // Match Saved Jobs
          const matchingSavedJob = savedJobs.find((sj: any) => {
            const isGovt = c.type === 'government';
            const catMatch = isGovt 
              ? c.govtCategory && sj.govt_category === c.govtCategory
              : c.privateCategory && sj.private_category === c.privateCategory;
            return catMatch || (sj.location && c.location === sj.location);
          });

          if (matchingSavedJob) {
            score += 5.0;
            const category = c.type === 'government' ? c.govtCategory : c.privateCategory;
            if (category) {
              reason = `Because you saved jobs in ${category}`;
            } else if (matchingSavedJob.location && c.location === matchingSavedJob.location) {
              reason = "Matches your saved-job location";
            }
          }

          // Match Job Alerts (Overrides Saved Jobs reason if stronger)
          const matchingAlert = jobAlerts.find((alert: any) => {
            const isGovt = c.type === 'government';
            const catMatch = isGovt 
              ? c.govtCategory && alert.govt_category === c.govtCategory
              : c.privateCategory && alert.private_category === c.privateCategory;
            
            const keywordMatch = alert.keywords && c.title && (c.title as string).toLowerCase().includes((alert.keywords as string).toLowerCase());
            
            if (keywordMatch) score += 10.0;
            if (catMatch) score += 3.0;

            return keywordMatch || catMatch;
          });

          if (matchingAlert) {
            if (matchingAlert.keywords && c.title && (c.title as string).toLowerCase().includes((matchingAlert.keywords as string).toLowerCase())) {
              reason = `Matches your alert for ${matchingAlert.keywords}`;
            } else if (matchingAlert.name) {
              reason = `Matches your alert: ${matchingAlert.name}`;
            }
          }
        } else {
          // Insufficient signals: keep generic reason, just rely on ranking_score and recency.
          // Force it back just in case
          reason = "Fresh jobs you may be interested in";
        }

        return { job: c, score, reason };
      });

    // Sort by score
    scoredCandidates.sort((a, b) => b.score - a.score);

    const topRecommendations = scoredCandidates.slice(0, 10).map(sc => ({
      job: sc.job,
      reason: sc.reason
    }));

    return NextResponse.json(
      { recommendations: topRecommendations, hasSufficientSignals },
      { 
        status: 200, 
        headers: { 
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' // Never cache globally
        } 
      }
    );

  } catch (error: any) {
    console.error('Recommended Jobs API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
