// Простейшая MVP-авторизация админки ДОМИНАНТ:
// пароль из env ADMIN_PASSCODE (по умолчанию «dominant2026»),
// в cookie кладём sha256-токен. Stateless — без сессий в БД.
import crypto from 'crypto'

export const ADMIN_COOKIE = 'dominant_admin'
const SALT = 'dominant-admin-v1'

export function getPasscode(): string {
  return process.env.ADMIN_PASSCODE || 'dominant2026'
}

function tokenFor(passcode: string): string {
  return crypto
    .createHash('sha256')
    .update(`${SALT}:${passcode}`)
    .digest('hex')
    .slice(0, 32)
}

/** Ожидаемый токен для текущего пароля. */
export function expectedToken(): string {
  return tokenFor(getPasscode())
}

/** Пароль совпадает? */
export function checkPasscode(input: string): boolean {
  const a = Buffer.from(tokenFor(input.trim()))
  const b = Buffer.from(expectedToken())
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/** Достаёт значение cookie по имени из заголовка запроса. */
export function getCookie(req: Request, name: string): string | null {
  const header = req.headers.get('cookie')
  if (!header) return null
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

/** Авторизован ли запрос (для API-роутов админки). */
export function isAdminRequest(req: Request): boolean {
  const value = getCookie(req, ADMIN_COOKIE)
  if (!value) return false
  const expected = expectedToken()
  const a = Buffer.from(value)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
