'use client'

import Image from 'next/image'
import { ArrowRight, Phone } from 'lucide-react'
import { FadeIn } from './fade-in'
import { site } from '@/lib/site'
import { useCatalogFilter } from '@/lib/cart-store'

const CATEGORIES = [
  {
    title: 'Двери',
    specs: ['Межкомнатные и входные', 'Фурнитура и замки', 'Более 100 моделей в зале'],
    image: '/images/category-doors.png',
    alt: 'Каталог межкомнатных и входных дверей ДОМИНАНТ',
    position: 'object-[center_30%]',
  },
  {
    title: 'Плитка',
    specs: ['Для ванной, кухни и пола', 'Керамогранит', 'Мозаика и бордюры'],
    image: '/images/category-tiles.png',
    alt: 'Керамическая плитка и керамогранит для ванной и кухни',
    position: 'object-center',
  },
  {
    title: 'Ламинат',
    specs: ['Влагостойкий', 'Под дерево и под камень', 'Тёплый пол за один день'],
    image: '/images/category-laminate.png',
    alt: 'Ламинат под дерево в интерьере гостиной',
    position: 'object-center',
  },
  {
    title: 'Кухни',
    specs: ['Готовые гарнитуры', 'Проект под заказ', 'Столешницы и фурнитура'],
    image: '/images/category-kitchen.png',
    alt: 'Современная кухня с деревянными фасадами из каталога ДОМИНАНТ',
    position: 'object-center',
  },
]

export function Categories() {
  const setCategory = useCatalogFilter((s) => s.setCategory)

  return (
    <section
      id="catalog"
      className="scroll-mt-16 bg-zinc-50 py-20 sm:py-24"
      aria-label="Каталог товаров"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="max-w-xl font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950 sm:text-[40px]">
            Что вы найдёте в магазине
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-zinc-500">
            Основные направления. В зале — ещё больше товаров для дома
            и ремонта.
          </p>
        </FadeIn>

        {/* Каталожные карточки */}
        <div className="mt-11 grid grid-cols-1 gap-6 md:grid-cols-2">
          {CATEGORIES.map((cat, i) => (
            <FadeIn key={cat.title} delay={i * 0.06}>
              <a
                href="#products"
                onClick={() => {
                  const slug =
                    cat.title === 'Двери'
                      ? 'doors'
                      : cat.title === 'Плитка'
                        ? 'tiles'
                        : cat.title === 'Ламинат'
                          ? 'laminate'
                          : 'kitchens'
                  setCategory(slug)
                }}
                aria-label={`${cat.title} — смотреть товары в каталоге`}
                className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:border-orange-400 hover:shadow-[0_16px_40px_-24px_rgba(234,88,12,0.4)]"
              >
                <div className="overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    width={1152}
                    height={864}
                    className={`h-60 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-72 ${cat.position}`}
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-[24px] font-extrabold tracking-[-0.01em] text-zinc-950">
                      {cat.title}
                    </h3>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition-all duration-300 group-hover:border-orange-600 group-hover:bg-orange-600 group-hover:text-white">
                      <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  </div>
                  <ul className="mt-3.5 space-y-2">
                    {cat.specs.map((spec) => (
                      <li
                        key={spec}
                        className="flex items-center gap-2.5 text-[15px] text-zinc-600"
                      >
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 bg-orange-600"
                        />
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-orange-600 transition-colors group-hover:text-orange-500">
                    Смотреть товары
                  </p>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <p className="mt-10 text-center text-[15px] leading-relaxed text-zinc-500">
            А ещё — фурнитура, плинтусы и многое другое. Не нашли нужное?{' '}
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-1.5 font-bold text-orange-600 transition-colors hover:text-orange-500"
            >
              <Phone className="h-4 w-4" strokeWidth={2.2} />
              Позвоните — подскажем
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
