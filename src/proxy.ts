import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only active when Upstash env vars are present (same pattern as src/lib/rate-limit.ts)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

// Strict limiter for auth endpoints: 5 attempts per 10 minutes per IP
const authRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      analytics: false,
      prefix: 'ratelimit:auth',
    })
  : null;

// Paths that require strict rate limiting
const AUTH_PATHS = [
  '/api/users/login',
  '/api/users/forgot-password',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to Payload auth endpoints
  const isAuthPath = AUTH_PATHS.some((p) => pathname === p);

  if (isAuthPath) {
    if (!authRateLimit) {
      if (process.env.NODE_ENV === 'production') {
        console.error('Rate limiting unavailable (missing credentials). Failing closed.');
        return NextResponse.json(
          { errors: [{ message: 'Service temporarily unavailable.' }] },
          { status: 503 }
        );
      }
      // Allow development without credentials
      return NextResponse.next();
    }

    const ip =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '127.0.0.1';

    try {
      const { success } = await authRateLimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { errors: [{ message: 'Too many requests. Please try again later.' }] },
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '600',
            },
          }
        );
      }
    } catch (error) {
      console.error('Rate limiting error:', error instanceof Error ? error.message : 'Unknown error');
      
      // Do not fail open on unexpected rate limit failure
      return NextResponse.json(
        { errors: [{ message: 'Service temporarily unavailable.' }] },
        { status: 503 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run proxy on Payload REST API auth paths — no interference with admin UI or other routes
  matcher: ['/api/users/login', '/api/users/forgot-password'],
};
