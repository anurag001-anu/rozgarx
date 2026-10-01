import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    if (!type || (type !== 'government' && type !== 'private')) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const { user } = await payload.auth({ headers: await headers() });
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (type === 'government' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate cryptographically signed token
    const token = jwt.sign(
      { type, userId: user.id }, 
      process.env.PAYLOAD_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    // Redirect to payload create page with token and jobType
    return NextResponse.redirect(new URL(`/admin/collections/jobs/create?jobType=${type}&token=${token}`, req.url));
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
