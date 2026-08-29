import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin-auth';

const patchSchema = z.object({
  status: z.enum(['new', 'in_progress', 'done']).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const { id } = await params;
    const leadId = Number(id);
    if (!Number.isInteger(leadId)) {
      return NextResponse.json({ ok: false, error: 'Некорректный id' }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Некорректный статус' },
        { status: 400 }
      );
    }

    const lead = await db.lead.update({
      where: { id: leadId },
      data: parsed.data,
      include: { items: true },
    });
    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    console.error('PATCH /api/admin/leads/[id] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Заявка не найдена или ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const { id } = await params;
    const leadId = Number(id);
    if (!Number.isInteger(leadId)) {
      return NextResponse.json({ ok: false, error: 'Некорректный id' }, { status: 400 });
    }
    await db.lead.delete({ where: { id: leadId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/admin/leads/[id] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Заявка не найдена или ошибка сервера' },
      { status: 500 }
    );
  }
}
