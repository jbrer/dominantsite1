'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { site } from '@/lib/site'

const USPS = [
  'Доставка по Брестской области',
  'Любые виды кредитования',
  'Рассрочка',
  'Гарантия',
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function Hero() {
  return (
    <section id="top" className="bg-white" aria-label="Главный экран">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-28 sm:px-8 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* Текстовая колонка */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.p
            variants={fadeUp}
            className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-zinc-400"
          >
            Магазин товаров для дома · {site.address}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-zinc-950 sm:text-6xl lg:text-[72px]"
          >
            Помогаем создать{' '}
            <span className="inline-block -rotate-1 rounded-lg bg-orange-600 px-3 text-white">
              дом мечты
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-[17px] leading-relaxed text-zinc-600 sm:text-[19px]"
          >
            У нас есть всё и даже больше: двери, плитка, ламинат и кухни.
            Подберём под ваш бюджет, поможем с оплатой и доставим к дому.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href="#catalog"
              className="inline-flex h-[54px] items-center gap-2 rounded-lg bg-orange-600 px-7 text-[16px] font-bold text-white transition-colors hover:bg-orange-500 active:scale-[0.98]"
            >
              Смотреть каталог
              <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex h-[54px] items-center gap-2 rounded-lg border border-zinc-300 px-6 text-[16px] font-bold text-zinc-900 transition-colors hover:border-orange-600 hover:text-orange-600"
            >
              <Phone className="h-[18px] w-[18px] text-orange-600" strokeWidth={2.2} />
              {site.phone}
            </a>
          </motion.div>

          {/* УТП списком, по-простому */}
          <motion.ul
            variants={fadeUp}
            className="mt-9 flex max-w-lg flex-wrap gap-x-6 gap-y-2.5"
          >
            {USPS.map((usp) => (
              <li
                key={usp}
                className="flex items-center gap-2.5 text-[14.5px] font-semibold text-zinc-700"
              >
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-orange-600" />
                {usp}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Фото с биркой */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
            <Image
              src="/images/hero.png"
              alt="Интерьер дома мечты: деревянная дверь, плитка на стене, ламинат на полу — ассортимент магазина ДОМИНАНТ"
              width={1344}
              height={768}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Бирка как ценник в магазине */}
          <div className="absolute -bottom-7 left-4 -rotate-2 rounded-xl border-2 border-dashed border-orange-600 bg-white p-3.5 pr-5 shadow-md sm:left-8 sm:p-4 sm:pr-6">
            <p className="text-[15px] font-extrabold leading-tight text-zinc-950 sm:text-base">
              Кредит и рассрочка
            </p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-zinc-500 sm:text-[13px]">
              оформляем прямо в магазине
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
