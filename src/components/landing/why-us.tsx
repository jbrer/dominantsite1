import { Check, MapPin } from 'lucide-react'
import { FadeIn } from './fade-in'
import { site } from '@/lib/site'

const REASONS = [
  'Честные цены и помощь в подборе под любой бюджет',
  'Внимательные консультанты — подскажем, что подойдёт именно вам',
  'Всё для дома в одном месте: не нужно ехать в несколько магазинов',
  'Кредит и рассрочка оформляются прямо на месте, за один визит',
  'Работаем с частными покупателями и организациями',
]

const STEPS = [
  {
    title: 'Приезжаете в магазин',
    text: `Ждём вас по адресу: ${site.address}`,
    link: { href: site.mapUrl, label: 'Построить маршрут' },
  },
  {
    title: 'Выбираете с консультантом',
    text: 'Покажем варианты, поможем сравнить и подобрать под ваш интерьер и бюджет.',
  },
  {
    title: 'Оформляете оплату',
    text: 'Наличные, карта, кредит или рассрочка — как вам удобно.',
  },
  {
    title: 'Получаете доставку',
    text: 'Привезём покупку бережно и в срок в любую точку Брестской области.',
  },
]

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="scroll-mt-16 bg-white py-20 sm:py-24"
      aria-label="Почему выбирают нас"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Заголовок */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <FadeIn>
              <h2 className="font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950 sm:text-[40px]">
                Почему выбирают{' '}
                <span className="text-orange-600">ДОМИНАНТ</span>
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-zinc-600 sm:text-[17px]">
                Мы знаем, как важен каждый шаг в создании дома. Поэтому рядом
                с вами есть магазин, где всё для ремонта — под одной крышей,
                а покупка проста, выгодна и с гарантией.
              </p>
              {/* Факты одной строкой */}
              <p className="mt-6 max-w-md text-[14.5px] font-semibold leading-relaxed text-zinc-400">
                <span className="text-orange-600">4</span> направления товаров ·{' '}
                <span className="text-orange-600">15+</span> городов доставки ·{' '}
                <span className="text-orange-600">4</span> способа оплаты
              </p>
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-zinc-950 px-6 text-[15px] font-bold text-white transition-colors hover:bg-zinc-800"
              >
                <MapPin className="h-[18px] w-[18px] text-orange-500" strokeWidth={2.1} />
                Построить маршрут
              </a>
            </FadeIn>
          </div>

          {/* Чек-лист */}
          <div>
            <ul className="divide-y divide-zinc-200 border-y border-zinc-200">
              {REASONS.map((reason, i) => (
                <FadeIn key={reason} delay={i * 0.05}>
                  <li className="flex items-start gap-3.5 py-5">
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-orange-600"
                      strokeWidth={2.6}
                    />
                    <span className="text-[16px] font-semibold leading-relaxed text-zinc-800">
                      {reason}
                    </span>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </div>
        </div>

        {/* Шаги покупки */}
        <FadeIn>
          <div className="mt-16 sm:mt-20">
            <h3 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-zinc-950 sm:text-[30px]">
              Как купить
            </h3>
            <ol className="mt-9 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="border-t border-zinc-200 pt-5">
                  <span className="font-display text-[38px] font-extrabold leading-none tabular-nums text-orange-600">
                    {i + 1}
                  </span>
                  <p className="mt-3 font-display text-[17px] font-bold tracking-[-0.01em] text-zinc-950">
                    {step.title}
                  </p>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-zinc-500">
                    {step.text}
                  </p>
                  {step.link && (
                    <a
                      href={step.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-0.5 text-[14px] font-bold text-orange-600 transition-colors hover:text-orange-500"
                    >
                      <MapPin className="h-4 w-4" strokeWidth={2.1} />
                      {step.link.label}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
