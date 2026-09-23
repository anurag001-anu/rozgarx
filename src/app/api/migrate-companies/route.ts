import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production' }, { status: 403 });
  }

  try {
    const payload = await getPayload();
    const cookieStore = await cookies();
    const token = cookieStore.get("payload-token")?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`
      })
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const companies = await payload.find({
      collection: 'companies',
      limit: 1000,
    });

    let migratedCount = 0;
    const errors = [];

    for (const doc of companies.docs) {
      const company = doc as any;
      
      if (company.owner) {
        const ownerId = typeof company.owner === 'object' ? company.owner.id : company.owner;
        const members = company.members || [];
        const memberIds = members.map((m: any) => typeof m === 'object' ? m.id : m);
        
        if (!memberIds.includes(ownerId)) {
          const newMembers = [...memberIds, ownerId];
          try {
            await payload.update({
              collection: 'companies' as any,
              id: company.id,
              data: {
                members: newMembers,
              } as any,
            });
            migratedCount++;
          } catch (err: any) {
            errors.push(`Failed to update company ${company.id}: ${err.message}`);
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Migration completed',
      migratedCount,
      totalCompanies: companies.docs.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
