import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin-auth';

const patchSchema = z.object({
  name: z.string().trim().min(2).max(140).optional(),
  category: z.enum(['doors', 'tiles', 'laminate', 'kitchens']).optional(),
  price: z.number().int().min(0).max(10000000).nullable().optional(),
  unit: z.enum(['шт', 'м²', 'компл', 'м.п.']).optional(),
  description: z.string().trim().max(500).nullable().optional(),
  imageUrl: z
    .union([z.string().trim().url('Некорректный URL'), z.literal('')])
    .nullable()
    .optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId)) {
      return NextResponse.json({ ok: false, error: 'Некорректный id' }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Проверьте поля' },
        { status: 400 }
      );
    }

    const product = await db.product.update({
      where: { id: productId },
      data: parsed.data,
    });
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    console.error('PATCH /api/admin/products/[id] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Товар не найден или ошибка сервера' },
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
    const productId = Number(id);
    if (!Number.isInteger(productId)) {
      return NextResponse.json({ ok: false, error: 'Некорректный id' }, { status: 400 });
    }
    await db.product.delete({ where: { id: productId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/admin/products/[id] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Товар не найден или ошибка сервера' },
      { status: 500 }
    );
  }
}
