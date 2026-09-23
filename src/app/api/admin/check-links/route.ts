import { getPayload } from "@/lib/payload";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const urlParams = new URL(req.url);
  const secret = urlParams.searchParams.get('secret');
  
  const payload = await getPayload();
  const { user } = await payload.auth({ headers: req.headers });

  if (process.env.NODE_ENV === 'production' && secret !== process.env.CRON_SECRET) {
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  
  try {
    const { url, collection, id } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      
      const dns = await import('dns/promises');
      const lookupResult = await dns.lookup(hostname);
      const resolvedIp = lookupResult.address;

      if (
        resolvedIp === '127.0.0.1' || 
        resolvedIp === '::1' ||
        resolvedIp.startsWith('10.') || 
        resolvedIp.startsWith('192.168.') ||
        resolvedIp.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
      ) {
        return NextResponse.json({ error: 'Internal/Private URLs are not allowed' }, { status: 403 });
      }
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return NextResponse.json({ error: 'Only HTTP/HTTPS allowed' }, { status: 403 });
      }
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    let isHealthy = false;
    let fallbackUsed = false;

    // Try HEAD request first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const headResponse = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
      });
      clearTimeout(timeoutId);

      // Many servers reject HEAD with 405 or 403, we only count 200-399 as success here
      if (headResponse.ok || headResponse.status < 400) {
        isHealthy = true;
      }
    } catch (e) {
      // Ignore head fetch errors, we will fallback to GET
    }

    // Fallback to GET if HEAD failed
    if (!isHealthy) {
      fallbackUsed = true;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const getResponse = await fetch(url, { 
          method: 'GET',
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        clearTimeout(timeoutId);

        if (getResponse.ok || getResponse.status < 400) {
          isHealthy = true;
        }
      } catch (e) {
        // Completely failed
      }
    }

    const healthStatus = isHealthy ? 'Healthy' : 'Broken';

    // Update the record if collection and id are provided
    if (collection && id) {
      await payload.update({
        collection: collection as any,
        id,
        data: {
          linkHealth: healthStatus,
          lastCheckedAt: new Date().toISOString(),
        } as any,
      });
    }

    return NextResponse.json({ 
      success: true, 
      status: healthStatus, 
      fallbackUsed,
      lastCheckedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking link:', error);
    return NextResponse.json({ error: 'Failed to check link' }, { status: 500 });
  }
}
