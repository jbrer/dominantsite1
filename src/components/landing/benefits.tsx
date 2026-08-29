import { FadeIn } from './fade-in'

const BENEFITS = [
  {
    title: 'Доставка',
    text: 'по Брестской области — привезём в Пинск, Иваново, Дрогичин и любой населённый пункт региона, бережно и в срок.',
  },
  {
    title: 'Кредитование',
    text: 'любые виды — оформим кредит на выгодных условиях и подберём программу под вашу ситуацию.',
  },
  {
    title: 'Рассрочка',
    text: 'платите частями — ремонтируйтесь сейчас, а оплату вносите постепенно, без лишней нагрузки на бюджет.',
  },
  {
    title: 'Гарантия',
    text: 'на всю продукцию — работаем с проверенными поставщиками и уверенно отвечаем за качество.',
  },
]

export function Benefits() {
  return (
    <section
      className="bg-white py-20 sm:py-24"
      aria-label="Наши преимущества"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <h2 className="max-w-xl font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950 sm:text-[40px]">
            Почему с нами удобно
          </h2>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <FadeIn key={b.title} delay={i * 0.06}>
              {/* Номер + жёсткая линия сверху — редакционный стиль */}
              <div className="border-t-2 border-zinc-950 pt-5">
                <span className="text-[13px] font-extrabold tabular-nums tracking-wide text-orange-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2.5 font-display text-[20px] font-extrabold tracking-[-0.01em] text-zinc-950">
                  {b.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
                  {b.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
