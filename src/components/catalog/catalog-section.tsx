'use client'

// Секция «Каталог»: плитки категорий (работают как фильтр) + сетка товаров.
// Товары из БД, кнопка «В корзину» кладёт товар в корзину (zustand + localStorage).
import { Minus, Phone, Plus, ShoppingBasket, X } from 'lucide-react'
import { FadeIn } from '@/components/landing/fade-in'
import { useCart, useCartQty, useCatalogFilter } from '@/lib/cart-store'
import {
  CATEGORY_MAP,
  PRODUCT_CATEGORIES,
  formatPrice,
  type PublicProduct,
} from '@/lib/catalog'
import { site } from '@/lib/site'
import { asset } from '@/lib/asset'

export function CatalogSection({ products }: { products: PublicProduct[] }) {
  const category = useCatalogFilter((s) => s.category)
  const setCategory = useCatalogFilter((s) => s.setCategory)

  const filtered =
    category === 'all' ? products : products.filter((p) => p.category === category)

  return (
    <section
      id="products"
      className="scroll-mt-16 bg-white py-16 sm:py-20"
      aria-label="Каталог товаров с ценами"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Каталог
            </p>
            <h2 className="mt-2.5 font-display text-[30px] font-medium leading-[1.12] text-zinc-950 sm:text-[38px]">
              Товары магазина
            </h2>
          </div>
          <p className="max-w-sm text-[14.5px] leading-relaxed text-zinc-500">
            Это витрина основных позиций — в зале ассортимент шире. Кладите
            нужное в корзину и оставляйте заявку: перезвоним и рассчитаем
            доставку.
          </p>
        </FadeIn>

        {/* Плитки категорий — визуальный фильтр */}
        <FadeIn delay={0.05}>
          <div
            role="tablist"
            aria-label="Фильтр каталога по категориям"
            className="mt-9 grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4"
          >
            {PRODUCT_CATEGORIES.map((cat) => {
              const active = category === cat.slug
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(active ? 'all' : cat.slug)}
                  className="group text-left"
                >
                  <span
                    className={`block overflow-hidden rounded-lg transition-all ${
                      active
                        ? 'ring-2 ring-zinc-950 ring-offset-2'
                        : 'ring-1 ring-zinc-200 group-hover:ring-zinc-400'
                    }`}
                  >
                    <img
                      src={asset(cat.image)}
                      alt={cat.alt}
                      className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-32"
                    />
                  </span>
                  <span className="mt-2.5 flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 shrink-0 transition-colors ${
                        active ? 'bg-orange-600' : 'bg-zinc-300 group-hover:bg-zinc-400'
                      }`}
                    />
                    <span
                      className={`text-[14.5px] transition-colors ${
                        active
                          ? 'font-bold text-zinc-950'
                          : 'font-medium text-zinc-600 group-hover:text-zinc-950'
                      }`}
                    >
                      {cat.label}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </FadeIn>

        {/* Строка состояния фильтра */}
        {category !== 'all' && (
          <div className="mt-6 flex items-center justify-between border-b border-zinc-200 pb-4">
            <p className="text-[14px] font-semibold text-zinc-950">
              Показаны товары:{' '}
              <span className="text-orange-600">
                {CATEGORY_MAP[category as keyof typeof CATEGORY_MAP]?.label ?? category}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setCategory('all')}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-zinc-500 transition-colors hover:text-zinc-950"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
              Сбросить
            </button>
          </div>
        )}

        {/* Сетка товаров */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, i) => (
              <FadeIn key={product.id} delay={(i % 3) * 0.05}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="mt-10 border-y border-zinc-200 py-14 text-center">
            <p className="font-display text-[20px] font-medium text-zinc-950">
              В этой категории пока пусто
            </p>
            <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-zinc-500">
              Товары скоро появятся на витрине. Позвоните нам — в зале наверняка
              найдётся то, что нужно.
            </p>
            <a
              href={site.phoneHref}
              className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-zinc-950 transition-colors hover:text-orange-600"
            >
              <Phone className="h-4 w-4 text-orange-600" strokeWidth={2.1} />
              {site.phone}
            </a>
          </div>
        )}

        <FadeIn delay={0.1}>
          <p className="mt-9 border-t border-zinc-200 pt-5 text-[13px] leading-relaxed text-zinc-400">
            Цены на витрине ориентировочные и могут отличаться от актуальных в
            магазине. Точное наличие и стоимость подскажет продавец-консультант.
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
    <article className="group flex h-full flex-col overflow-hidden rounded-lg bg-white ring-1 ring-zinc-200 transition-shadow duration-300 hover:shadow-[0_10px_32px_-20px_rgba(0,0,0,0.35)]">
      {/* Фото товара (или фото категории как заглушка) */}
      <div className="relative h-44 overflow-hidden sm:h-48">
        <img
          src={asset(product.imageUrl || meta?.image || '')}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 bg-white/90 px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-zinc-700 backdrop-blur-sm">
          {meta?.label ?? product.category}
        </span>
        {inCart > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 bg-zinc-950 px-2 py-1 text-[11px] font-bold text-white">
            <ShoppingBasket className="h-3.5 w-3.5" strokeWidth={2.2} />
            {inCart}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15.5px] font-semibold leading-snug text-zinc-950">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-zinc-500">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p className="font-display text-[18px] font-semibold leading-tight text-zinc-950">
              {formatPrice(product.price)}
            </p>
            {product.price != null && (
              <p className="mt-0.5 text-[12px] text-zinc-400">за {product.unit}</p>
            )}
          </div>

          {inCart === 0 ? (
            <button
              type="button"
              onClick={() => add(product.id)}
              aria-label={`Добавить «${product.name}» в корзину`}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-orange-600 active:scale-[0.98]"
            >
              <ShoppingBasket className="h-4 w-4" strokeWidth={2.2} />
              В корзину
            </button>
          ) : (
            <div className="inline-flex h-10 shrink-0 items-center overflow-hidden rounded-lg bg-zinc-950 text-white">
              <button
                type="button"
                onClick={() => setQty(product.id, inCart - 1)}
                aria-label={`Убавить «${product.name}»`}
                className="grid h-full w-10 place-items-center transition-colors hover:bg-orange-600 active:bg-orange-700"
              >
                <Minus className="h-4 w-4" strokeWidth={2.4} />
              </button>
              <span className="w-7 text-center text-[14px] font-bold tabular-nums">
                {inCart}
              </span>
              <button
                type="button"
                onClick={() => setQty(product.id, inCart + 1)}
                aria-label={`Прибавить «${product.name}»`}
                className="grid h-full w-10 place-items-center transition-colors hover:bg-orange-600 active:bg-orange-700"
              >
                <Plus className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
