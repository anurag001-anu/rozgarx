import { NextRequest } from 'next/server';

export function verifyCronAuth(request: NextRequest): boolean {
  // If in local development and no secret is configured, allow it for ease of dev.
  // In production, require strict auth.
  const isProduction = process.env.NODE_ENV === 'production';
  const cronSecret = process.env.CRON_SECRET;

  if (isProduction && !cronSecret) {
    console.error('CRITICAL: CRON_SECRET is missing in production environment');
    return false;
  }

  // Allow local bypass ONLY if no secret is defined in .env
  if (!isProduction && !cronSecret) {
    return true; 
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return false;
  }

  return true;
}
