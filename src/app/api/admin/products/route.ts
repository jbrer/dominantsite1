import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin-auth';

const productSchema = z.object({
  name: z.string().trim().min(2, 'Укажите название').max(140),
  category: z.enum(['doors', 'tiles', 'laminate', 'kitchens']),
  // null/undefined = «цена по запросу»
  price: z.number().int().min(0).max(10000000).nullish(),
  unit: z.enum(['шт', 'м²', 'компл', 'м.п.']),
  description: z.string().trim().max(500).nullish(),
  imageUrl: z.union([z.string().trim().url('Некорректный URL'), z.literal('')]).nullish(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(9999).default(0),
});

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const products = await db.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
  return NextResponse.json({ ok: true, products });
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => null);
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Проверьте поля' },
        { status: 400 }
      );
    }
    const product = await db.product.create({ data: parsed.data });
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    console.error('POST /api/admin/products error:', error);
    return NextResponse.json(
      { ok: false, error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
