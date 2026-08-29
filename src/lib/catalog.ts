// Общие константы и утилиты каталога ДОМИНАНТ.

export type CategorySlug = 'doors' | 'tiles' | 'laminate' | 'kitchens'

export interface CategoryMeta {
  slug: CategorySlug
  label: string
  image: string
  alt: string
}

export const PRODUCT_CATEGORIES: CategoryMeta[] = [
  {
    slug: 'doors',
    label: 'Двери',
    image: '/images/category-doors.png',
    alt: 'Межкомнатные двери из каталога ДОМИНАНТ',
  },
  {
    slug: 'tiles',
    label: 'Плитка',
    image: '/images/category-tiles.png',
    alt: 'Керамическая плитка и керамогранит',
  },
  {
    slug: 'laminate',
    label: 'Ламинат',
    image: '/images/category-laminate.png',
    alt: 'Ламинат под дерево в интерьере',
  },
  {
    slug: 'kitchens',
    label: 'Кухни',
    image: '/images/category-kitchen.png',
    alt: 'Кухонные гарнитуры ДОМИНАНТ',
  },
]

export const CATEGORY_MAP: Record<string, CategoryMeta> = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.slug, c]),
)

export const UNITS = ['шт', 'м²', 'компл', 'м.п.'] as const

/** Товар, который уходит с сервера на клиент (без служебных полей). */
export interface PublicProduct {
  id: number
  name: string
  category: string
  price: number | null
  unit: string
  description: string | null
  imageUrl: string | null
}

const nf = new Intl.NumberFormat('ru-RU')

/** «1 250 руб.» либо «Цена по запросу». */
export function formatPrice(price: number | null | undefined): string {
  return price == null ? 'Цена по запросу' : `${nf.format(price)} руб.`
}

/** Итог позиции: «цена × кол-во». Для товаров без цены — null. */
export function lineTotal(
  price: number | null | undefined,
  qty: number,
): number | null {
  return price == null ? null : price * qty
}

export function formatDateRu(value: Date | string): string {
  const d = typeof value === 'string' ? new Date(value) : value
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
