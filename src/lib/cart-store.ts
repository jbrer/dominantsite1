// Корзина ДОМИНАНТ — MVP без личных кабинетов:
// храним только { id, qty } и подхватываем актуальные данные товара
// из каталога на момент рендера/отправки.
import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartEntry {
  id: number
  qty: number
}

interface CartState {
  items: CartEntry[]
  isOpen: boolean
  add: (id: number) => void
  setQty: (id: number, qty: number) => void
  remove: (id: number) => void
  clear: () => void
  setOpen: (open: boolean) => void
}

const MAX_QTY = 99

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (id) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === id)
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === id ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i,
              ),
            }
          }
          return { items: [...s.items, { id, qty: 1 }] }
        }),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) =>
                  i.id === id ? { ...i, qty: Math.min(qty, MAX_QTY) } : i,
                ),
        })),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'dominant-cart',
      partialize: (s) => ({ items: s.items }),
    },
  ),
)

/** Выбранная категория в секции каталога (общая для бенто-карточек и чипов). */
interface FilterState {
  category: string // 'all' | CategorySlug
  setCategory: (c: string) => void
}

export const useCatalogFilter = create<FilterState>()((set) => ({
  category: 'all',
  setCategory: (category) => set({ category }),
}))

/** Общее количество единиц товара в корзине. */
export function cartCount(items: CartEntry[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0)
}

const SERVER_ITEMS: CartEntry[] = []
const getServerItems = (): CartEntry[] => SERVER_ITEMS

/**
 * SSR-safe подписка на содержимое корзины: на сервере и при гидрации
 * возвращаем пустой снимок, после монтирования — реальное состояние
 * (localStorage). Не требует setState в useEffect.
 */
export function useCartItems(): CartEntry[] {
  return useSyncExternalStore(
    useCart.subscribe,
    () => useCart.getState().items,
    getServerItems,
  )
}

/** Количество конкретного товара в корзине (для карточек каталога). */
export function useCartQty(id: number): number {
  const items = useCartItems()
  return items.find((i) => i.id === id)?.qty ?? 0
}
