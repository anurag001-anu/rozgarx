'use server'

import { getPayload } from '@/lib/payload'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import jwt from 'jsonwebtoken'

async function getUserIdFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('payload-token')?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = process.env.PAYLOAD_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as any;
    return decoded.id || null;
  } catch (error) {
    return null;
  }
}

export async function toggleSaveJob(jobId: string | number) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized', redirect: '/login' };
  }

  const payload = await getPayload();

  try {
    // Check if it's already saved
    const existing = await payload.find({
      collection: 'saved-jobs' as any,
      where: {
        and: [
          { user: { equals: userId } },
          { job: { equals: jobId } }
        ]
      },
      limit: 1,
    });

    if (existing.totalDocs > 0) {
      // Unsave
      await payload.delete({
        collection: 'saved-jobs' as any,
        id: existing.docs[0].id,
      });
      revalidatePath('/'); // Revalidate everywhere to update UI states
      return { success: true, saved: false, message: 'Job removed from saved jobs' };
    } else {
      // Save
      await payload.create({
        collection: 'saved-jobs' as any,
        data: {
          user: userId,
          job: jobId,
        } as any,
      });
      revalidatePath('/'); // Revalidate everywhere
      return { success: true, saved: true, message: 'Job saved' };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function getSavedJobsIds() {
  const userId = await getUserIdFromCookie();
  if (!userId) return [];

  const payload = await getPayload();
  try {
    const savedJobs = await payload.find({
      collection: 'saved-jobs' as any,
      where: { user: { equals: userId } },
      limit: 1000,
    });
    
    // Return array of job IDs
    return savedJobs.docs.map((doc: any) => typeof doc.job === 'object' ? doc.job.id : doc.job);
  } catch (error) {
    return [];
  }
}
