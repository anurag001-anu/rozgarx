'use server';

import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';

async function getUserIdFromCookie(): Promise<string | number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('payload-token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.id || null;
  } catch {
    return null;
  }
}

export async function createJobAlert(formData: any) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const payload = await getPayload({ config: configPromise });

  try {
    await payload.create({
      collection: 'job-alerts' as any,
      data: {
        ...formData,
        user: userId,
      } as any,
    });
    revalidatePath('/profile');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create alert' };
  }
}

export async function updateJobAlert(alertId: string | number, formData: any) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const payload = await getPayload({ config: configPromise });

  try {
    // Ensure ownership
    const alert = await payload.findByID({
      collection: 'job-alerts' as any,
      id: alertId,
    });

    const alertOwner = typeof alert.user === 'object' ? alert.user.id : alert.user;
    if (alertOwner !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await payload.update({
      collection: 'job-alerts' as any,
      id: alertId,
      data: formData,
    });
    revalidatePath('/profile');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update alert' };
  }
}

export async function toggleJobAlert(alertId: string | number, isActive: boolean) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const payload = await getPayload({ config: configPromise });

  try {
    // Ensure ownership
    const alert = await payload.findByID({
      collection: 'job-alerts' as any,
      id: alertId,
    });
    
    const alertOwner = typeof alert.user === 'object' ? alert.user.id : alert.user;
    if (alertOwner !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await payload.update({
      collection: 'job-alerts' as any,
      id: alertId,
      data: { isActive },
    });
    revalidatePath('/profile');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: 'Failed to toggle alert' };
  }
}

export async function deleteJobAlert(alertId: string | number) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const payload = await getPayload({ config: configPromise });

  try {
    // Ensure ownership
    const alert = await payload.findByID({
      collection: 'job-alerts' as any,
      id: alertId,
    });
    
    const alertOwner = typeof alert.user === 'object' ? alert.user.id : alert.user;
    if (alertOwner !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await payload.delete({
      collection: 'job-alerts' as any,
      id: alertId,
    });
    revalidatePath('/profile');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: 'Failed to delete alert' };
  }
}
