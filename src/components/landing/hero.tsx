'use client'

import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { site } from '@/lib/site'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// Компактная вводная полоса вместо большого «лендинг-хиро»:
// короткий фактический заголовок + два тихих действия, ниже сразу каталог.
export function Hero() {
  return (
    <section id="top" className="border-b border-zinc-200 bg-white" aria-label="О магазине">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-24 sm:px-8 sm:pb-14 sm:pt-32">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          <motion.p
            variants={fadeUp}
            className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-zinc-400"
          >
            Магазин товаров для дома · {site.address}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-4 max-w-3xl font-display text-[34px] font-medium leading-[1.12] text-zinc-950 sm:text-5xl sm:leading-[1.08]"
          >
            Двери, плитка, ламинат и кухни —{' '}
            <span className="italic text-orange-600">всё для дома</span> в одном
            месте
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-[16px] leading-relaxed text-zinc-600 sm:text-[17.5px]"
          >
            Покажем в зале, поможем подобрать и привезём покупку по всей
            Брестской области. Кредит и рассрочка оформляются на месте.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3.5">
            <a
              href="#products"
              className="inline-flex h-12 items-center rounded-lg bg-zinc-950 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Смотреть каталог
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-zinc-950 transition-colors hover:text-orange-600"
            >
              <Phone className="h-[17px] w-[17px] text-orange-600" strokeWidth={2.1} />
              {site.phone}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
