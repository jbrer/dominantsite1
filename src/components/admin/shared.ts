// Общие типы и утилиты админ-панели ДОМИНАНТ.

export interface AdminLeadItem {
  id: number
  name: string
  price: number | null
  unit: string
  qty: number
}

export interface AdminLead {
  id: number
  name: string
  phone: string
  message: string | null
  source: string // form | cart
  status: string // new | in_progress | done
  createdAt: string
  items: AdminLeadItem[]
}

export interface AdminProduct {
  id: number
  name: string
  category: string
  price: number | null
  unit: string
  description: string | null
  imageUrl: string | null
  isActive: boolean
  sortOrder: number
}

/** Формат цены для карточек в панели. */
const nf = new Intl.NumberFormat('ru-RU')
export function priceRu(price: number | null): string {
  return price == null ? 'по запросу' : `${nf.format(price)} руб.`
}

export function formatDateRu(value: string): string {
  const d = new Date(value)
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Мета статусов заявки: подпись + классы бейджа (оранжево-цинковая палитра). */
export const STATUS_META: Record<
  string,
  { label: string; badge: string }
> = {
  new: {
    label: 'Новая',
    badge: 'bg-orange-600 text-white shadow-[0_6px_16px_-8px_rgba(234,88,12,0.8)]',
  },
  in_progress: {
    label: 'В работе',
    badge: 'bg-orange-100 text-orange-700 border border-orange-200',
  },
  done: {
    label: 'Выполнена',
    badge: 'bg-zinc-100 text-zinc-500 border border-zinc-200',
  },
}

/** fetch c JSON и понятной ошибкой. */
export async function api<T>(
  url: string,
  init?: RequestInit,
): Promise<T & { ok: true }> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const json = await res.json().catch(() => ({ ok: false }))
  if (!res.ok || !json.ok) {
    throw new Error(json.error || `Ошибка ${res.status}`)
  }
  return json as T & { ok: true }
}

/** tel:-ссылка из сырого номера. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
