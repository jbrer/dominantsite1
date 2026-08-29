'use client'

// Секция «Каталог товаров»: товары из БД + фильтр по категориям.
// Кнопка «В корзину» кладёт товар в корзину (zustand + localStorage),
// после чего в шапке и на плавающей кнопке появляется счётчик.
import { Minus, Plus, ShoppingBasket } from 'lucide-react'
import { FadeIn } from '@/components/landing/fade-in'
import { useCart, useCartQty, useCatalogFilter } from '@/lib/cart-store'
import {
  CATEGORY_MAP,
  PRODUCT_CATEGORIES,
  formatPrice,
  type PublicProduct,
} from '@/lib/catalog'

export function CatalogSection({ products }: { products: PublicProduct[] }) {
  const category = useCatalogFilter((s) => s.category)
  const setCategory = useCatalogFilter((s) => s.setCategory)

  const filtered =
    category === 'all' ? products : products.filter((p) => p.category === category)

  const chips = [
    { slug: 'all', label: 'Все товары' },
    ...PRODUCT_CATEGORIES.map((c) => ({ slug: c.slug as string, label: c.label })),
  ]

  return (
    <section
      id="products"
      className="scroll-mt-16 bg-zinc-950 py-20 text-white sm:py-24"
      aria-label="Каталог товаров с ценами"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-orange-400">
              Каталог
            </span>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[40px]">
              Выбирайте товары —{' '}
              <span className="text-gradient-orange">мы привезём</span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-zinc-400">
            Кладите нужное в корзину и оставляйте заявку — перезвоним, всё
            уточним и рассчитаем доставку.
          </p>
        </FadeIn>

        {/* Фильтр по категориям */}
        <FadeIn delay={0.05}>
          <div
            role="tablist"
            aria-label="Фильтр каталога по категориям"
            className="mt-9 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {chips.map((chip) => {
              const active = category === chip.slug
              return (
                <button
                  key={chip.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(chip.slug)}
                  className={`inline-flex h-11 shrink-0 items-center rounded-xl px-5 text-[14px] font-bold transition-all active:scale-[0.98] ${
                    active
                      ? 'bg-orange-600 text-white shadow-[0_8px_24px_-10px_rgba(234,88,12,0.7)]'
                      : 'border border-white/15 text-zinc-300 hover:border-orange-500/50 hover:text-white'
                  }`}
                >
                  {chip.label}
                </button>
              )
            })}
          </div>
        </FadeIn>

        {/* Сетка товаров */}
        {filtered.length > 0 ? (
          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, i) => (
              <FadeIn key={product.id} delay={(i % 3) * 0.06}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn delay={0.1}>
            <div className="mt-9 flex flex-col items-center rounded-3xl border border-dashed border-white/15 px-6 py-16 text-center">
              <ShoppingBasket className="h-10 w-10 text-zinc-600" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-xl font-extrabold">
                Здесь пока пусто
              </h3>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-zinc-400">
                Товары этой категории скоро появятся. Позвоните нам — наверняка
                найдём то, что нужно!
              </p>
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.12}>
          <p className="mt-10 text-center text-[14px] leading-relaxed text-zinc-500">
            Это витрина основных товаров — в зале ассортимент шире. Цены
            указаны ориентировочно и могут отличаться от актуальных.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: PublicProduct }) {
  const add = useCart((s) => s.add)
  const setQty = useCart((s) => s.setQty)
  const inCart = useCartQty(product.id)
  const meta = CATEGORY_MAP[product.category]

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white text-zinc-950 shadow-[0_2px_16px_-8px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-20px_rgba(234,88,12,0.45)]">
      {/* Фото товара (или фото категории как заглушка) */}
      <div className="relative h-44 overflow-hidden sm:h-48">
        <img
          src={product.imageUrl || meta?.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-zinc-950/70 px-3 py-1 text-[12px] font-bold text-white backdrop-blur">
          {meta?.label ?? product.category}
        </span>
        {inCart > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-[12px] font-extrabold text-white shadow-lg">
            <ShoppingBasket className="h-3.5 w-3.5" strokeWidth={2.4} />
            {inCart}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[16px] font-bold leading-snug">{product.name}</h3>
        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-zinc-500">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p className="font-display text-[19px] font-extrabold tracking-tight">
              {formatPrice(product.price)}
            </p>
            {product.price != null && (
              <p className="text-[12px] text-zinc-400">за {product.unit}</p>
            )}
          </div>

          {inCart === 0 ? (
            <button
              type="button"
              onClick={() => add(product.id)}
              aria-label={`Добавить «${product.name}» в корзину`}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-4 text-[14px] font-bold text-white transition-all hover:bg-orange-500 active:scale-[0.97]"
            >
              <ShoppingBasket className="h-4 w-4" strokeWidth={2.4} />
              В корзину
            </button>
          ) : (
            <div className="inline-flex h-11 shrink-0 items-center overflow-hidden rounded-xl bg-orange-600 text-white">
              <button
                type="button"
                onClick={() => setQty(product.id, inCart - 1)}
                aria-label={`Убавить «${product.name}»`}
                className="grid h-full w-10 place-items-center transition-colors hover:bg-orange-700/60 active:bg-orange-700"
              >
                <Minus className="h-4 w-4" strokeWidth={2.6} />
              </button>
              <span className="w-7 text-center text-[15px] font-extrabold tabular-nums">
                {inCart}
              </span>
              <button
                type="button"
                onClick={() => setQty(product.id, inCart + 1)}
                aria-label={`Прибавить «${product.name}»`}
                className="grid h-full w-10 place-items-center transition-colors hover:bg-orange-700/60 active:bg-orange-700"
              >
                <Plus className="h-4 w-4" strokeWidth={2.6} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
