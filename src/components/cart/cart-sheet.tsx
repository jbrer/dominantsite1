'use client'

// Корзина-«шторка»: список выбранных товаров + оформление заявки.
// Заявка уходит на POST /api/leads вместе с позициями (id + qty),
// сервер сам фиксирует актуальные названия и цены.
import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBasket,
  Trash2,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/lib/cart-store'
import {
  CATEGORY_MAP,
  formatPrice,
  lineTotal,
  type PublicProduct,
} from '@/lib/catalog'
import { site } from '@/lib/site'

const PHONE_RE = /^\+?[\d\s()-]{7,20}$/

interface Props {
  products: PublicProduct[]
}

export function CartSheet({ products }: Props) {
  const { items, isOpen, setOpen, setQty, remove, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [successId, setSuccessId] = useState<number | null>(null)
  const { toast } = useToast()

  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  )

  // Записи, для которых нашёлся живой товар в каталоге
  const rows = items
    .map((i) => ({ entry: i, product: productMap.get(i.id) }))
    .filter((r): r is { entry: { id: number; qty: number }; product: PublicProduct } =>
      Boolean(r.product),
    )

  const total = rows.reduce(
    (sum, r) => sum + (lineTotal(r.product.price, r.entry.qty) ?? 0),
    0,
  )
  const hasAskPrice = rows.some((r) => r.product.price == null)

  const valid =
    name.trim().length >= 2 && PHONE_RE.test(phone.trim()) && rows.length > 0

  function resetForm() {
    setName('')
    setPhone('')
    setComment('')
    setSuccessId(null)
  }

  async function submit() {
    if (!valid || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          ...(comment.trim() ? { message: comment.trim() } : {}),
          items: rows.map((r) => ({ id: r.product.id, qty: r.entry.qty })),
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Не удалось отправить заявку')
      }
      setSuccessId(json.id as number)
      // Корзина исполнена — очищаем (успешный экран при этом остаётся открытым)
      clear()
      toast({
        title: 'Заявка отправлена!',
        description: 'Менеджер перезвонит вам в ближайшее рабочее время.',
      })
    } catch (e) {
      toast({
        title: 'Ошибка',
        description:
          e instanceof Error ? e.message : 'Что-то пошло не так. Позвоните нам.',
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next && successId != null) resetForm()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-black/[0.08] bg-white p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-zinc-100 px-5 py-4">
          <SheetTitle className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-normal text-zinc-950">
            <ShoppingBasket className="h-5 w-5 text-orange-600" strokeWidth={2.2} />
            Ваша корзина
            {rows.length > 0 && (
              <span className="rounded-md bg-orange-50 px-2.5 py-1 text-[12px] font-bold text-orange-600">
                {rows.length}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {successId != null ? (
          /* ── Успешная отправка ── */
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <CheckCircle2 className="h-9 w-9 text-orange-600" strokeWidth={2} />
            </span>
            <h3 className="mt-5 font-display text-[22px] font-medium tracking-normal text-zinc-950">
              Заявка №{successId} принята!
            </h3>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-zinc-500">
              Перезвоним в течение рабочего дня, уточним наличие и рассчитаем
              доставку.
            </p>
            <a
              href={site.phoneHref}
              className="mt-6 inline-flex items-center gap-2 font-bold text-orange-600 transition-colors hover:text-orange-500"
              onClick={() => handleOpenChange(false)}
            >
              Или позвоните: {site.phone}
            </a>
          </div>
        ) : rows.length === 0 ? (
          /* ── Пустая корзина ── */
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50">
              <ShoppingBasket className="h-8 w-8 text-zinc-300" strokeWidth={1.8} />
            </span>
            <h3 className="mt-5 font-display text-[19px] font-medium text-zinc-950">
              Корзина пока пуста
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
              Выберите товары в каталоге — а мы соберём заказ и привезём.
            </p>
            <a
              href="#products"
              onClick={() => handleOpenChange(false)}
              className="mt-6 inline-flex h-12 items-center rounded-xl bg-orange-600 px-6 text-[15px] font-bold text-white transition-colors hover:bg-orange-500"
            >
              Перейти к товарам
            </a>
          </div>
        ) : (
          /* ── Товары + форма ── */
          <>
            <ul className="flex-1 divide-y divide-zinc-100 overflow-y-auto px-5">
              {rows.map(({ entry, product }) => (
                <li key={product.id} className="flex gap-3.5 py-4">
                  <img
                    src={product.imageUrl || CATEGORY_MAP[product.category]?.image}
                    alt={product.name}
                    className="h-14 w-14 shrink-0 rounded-lg border border-zinc-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold leading-snug text-zinc-950">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-zinc-500">
                      {formatPrice(product.price)} / {product.unit}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      {/* Степпер количества */}
                      <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-zinc-200">
                        <button
                          type="button"
                          aria-label={`Убавить «${product.name}»`}
                          onClick={() => setQty(entry.id, entry.qty - 1)}
                          className="grid h-full w-9 place-items-center text-zinc-600 transition-colors hover:bg-zinc-50 active:text-orange-600"
                        >
                          <Minus className="h-4 w-4" strokeWidth={2.4} />
                        </button>
                        <span className="w-8 text-center text-[14px] font-bold tabular-nums text-zinc-950">
                          {entry.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Прибавить «${product.name}»`}
                          onClick={() => setQty(entry.id, entry.qty + 1)}
                          className="grid h-full w-9 place-items-center text-zinc-600 transition-colors hover:bg-zinc-50 active:text-orange-600"
                        >
                          <Plus className="h-4 w-4" strokeWidth={2.4} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-bold tabular-nums text-zinc-950">
                          {formatPrice(lineTotal(product.price, entry.qty))}
                        </span>
                        <button
                          type="button"
                          aria-label={`Удалить «${product.name}» из корзины`}
                          onClick={() => remove(entry.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Оформление заявки */}
            <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400">
                  Итого
                </span>
                <span className="font-display text-[19px] font-semibold tracking-normal text-zinc-950">
                  {hasAskPrice && '> '}
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-1 text-right text-[12px] leading-snug text-zinc-400">
                Точную сумму с доставкой рассчитает менеджер
              </p>

              <div className="mt-4 space-y-2.5">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя *"
                  autoComplete="name"
                  maxLength={80}
                  className="h-[52px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-[15px] text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Номер телефона *"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  className="h-[52px] w-full rounded-xl border border-zinc-200 bg-white px-4 text-[15px] text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Комментарий: размеры, цвет, время звонка…"
                  rows={2}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[15px] leading-snug text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <button
                type="button"
                disabled={!valid || sending}
                onClick={submit}
                className="mt-3.5 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-orange-600 text-[15px] font-bold text-white transition-all hover:bg-orange-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                {sending ? 'Отправляем…' : 'Оставить заявку'}
              </button>
              <p className="mt-2.5 text-center text-[12px] leading-snug text-zinc-400">
                Никаких предоплат — просто перезвоним и всё уточним
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
