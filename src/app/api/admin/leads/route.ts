import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin-auth';

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const leads = await db.lead.findMany({
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    include: { items: true },
    take: 300,
  });
  return NextResponse.json({ ok: true, leads });
}
