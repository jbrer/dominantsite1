import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Укажите ваше имя (минимум 2 символа)')
    .max(80, 'Имя слишком длинное'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, 'Укажите корректный номер телефона'),
  message: z.string().trim().max(500, 'Сообщение слишком длинное').optional(),
  // Позиции из корзины каталога: присылаем только id и количество,
  // название/цену/единицу берём из БД сами (снапшот на момент заявки).
  items: z
    .array(
      z.object({
        id: z.number().int().positive(),
        qty: z.number().int().min(1).max(99),
      }),
    )
    .max(50)
    .optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { ok: false, error: 'Некорректный запрос' },
        { status: 400 }
      );
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? 'Проверьте заполнение полей',
        },
        { status: 400 }
      );
    }

    const { name, phone, message } = parsed.data;
    const rawItems = parsed.data.items;

    // Заявка из корзины: собираем снапшот позиций по актуальным товарам.
    let itemRows: {
      productId: number;
      name: string;
      price: number | null;
      unit: string;
      qty: number;
    }[] = [];

    if (rawItems && rawItems.length > 0) {
      const ids = [...new Set(rawItems.map((i) => i.id))];
      const products = await db.product.findMany({
        where: { id: { in: ids }, isActive: true },
      });
      const byId = new Map(products.map((p) => [p.id, p]));

      for (const item of rawItems) {
        const product = byId.get(item.id);
        // Неактивные/удалённые товары молча пропускаем
        if (!product) continue;
        itemRows.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          qty: item.qty,
        });
      }

      if (itemRows.length === 0) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Выбранные товары больше недоступны. Обновите корзину или позвоните нам.',
          },
          { status: 400 }
        );
      }
    }

    const lead = await db.lead.create({
      data: {
        name,
        phone,
        message: message || null,
        source: itemRows.length > 0 ? 'cart' : 'form',
        ...(itemRows.length > 0
          ? { items: { create: itemRows } }
          : {}),
      },
      include: { items: true },
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (error) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json(
      { ok: false, error: 'Ошибка сервера. Пожалуйста, позвоните нам.' },
      { status: 500 }
    );
  }
}
