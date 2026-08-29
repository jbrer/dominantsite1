import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkPasscode, ADMIN_COOKIE, expectedToken } from '@/lib/admin-auth';

const schema = z.object({ passcode: z.string().min(1, 'Введите пароль') });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Ошибка' },
        { status: 400 }
      );
    }

    // Небольшая задержка против перебора пароля
    await new Promise((r) => setTimeout(r, 400));

    if (!checkPasscode(parsed.data.passcode)) {
      return NextResponse.json(
        { ok: false, error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, expectedToken(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (error) {
    console.error('POST /api/admin/login error:', error);
    return NextResponse.json(
      { ok: false, error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
