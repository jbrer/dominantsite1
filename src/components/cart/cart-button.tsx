'use client'

// Кнопки вызова корзины: иконка в шапке + плавающая кнопка на мобильных.
import { ShoppingBasket } from 'lucide-react'
import { cartCount, useCart, useCartItems } from '@/lib/cart-store'

export function CartHeaderButton() {
  const setOpen = useCart((s) => s.setOpen)
  const count = cartCount(useCartItems())

  return (
    <button
      type="button"
      aria-label={`Открыть корзину${count > 0 ? `, товаров: ${count}` : ''}`}
      onClick={() => setOpen(true)}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 active:text-orange-600"
    >
      <ShoppingBasket className="h-5 w-5" strokeWidth={2} />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-orange-600 px-1 text-[10px] font-extrabold leading-none text-white"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}

export function CartFab() {
  const setOpen = useCart((s) => s.setOpen)
  const count = cartCount(useCartItems())

  if (count === 0) return null

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Открыть корзину, товаров: ${count}`}
      className="fixed bottom-[92px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-[0_10px_28px_-12px_rgba(0,0,0,0.5)] transition-transform active:scale-95 md:hidden"
    >
      <ShoppingBasket className="h-6 w-6" strokeWidth={2.2} />
      <span
        aria-hidden
        className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full border-2 border-white bg-zinc-950 px-1 text-[11px] font-extrabold leading-none text-white"
      >
        {count > 99 ? '99+' : count}
      </span>
    </button>
  )
}
