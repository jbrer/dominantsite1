import { MapPin } from 'lucide-react'
import { FadeIn } from './fade-in'
import { asset } from '@/lib/asset'

const MAIN_CITIES = ['Пинск', 'Иваново', 'Дрогичин']

export function Delivery() {
  return (
    <section
      id="delivery"
      className="scroll-mt-16 bg-zinc-950 py-20 text-white sm:py-24"
      aria-label="Доставка"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-orange-500">
            Доставка
          </p>
          <h2 className="mt-3 font-display text-[30px] font-medium leading-[1.12] sm:text-[38px]">
            Привезём по всей Брестской области
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-zinc-400 sm:text-[17px]">
            Купили в ДОМИНАНТ — и товар уже едет к вам. Доставим двери,
            плитку, ламинат и кухни бережно и точно в срок.
          </p>

          {/* Основные города — как табло маршрутов */}
          <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {MAIN_CITIES.map((city) => (
              <li key={city} className="flex items-center gap-3 py-4">
                <MapPin className="h-5 w-5 shrink-0 text-orange-500" strokeWidth={2.1} />
                <span className="font-display text-xl font-medium tracking-normal">{city}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-zinc-500">
            А также: Брест, Барановичи, Кобрин, Берёза, Лунинец, Столин,
            Ивацевичи, Ганцевичи, Пружаны, Малорита, Жабинка, Каменец
            и другие населённые пункты региона.
          </p>
          <p className="mt-4 text-[13.5px] italic text-zinc-600">
            Стоимость доставки подскажет продавец-консультант при покупке.
          </p>
        </FadeIn>

        {/* Фото с подписью */}
        <FadeIn delay={0.12}>
          <figure>
            <div className="overflow-hidden rounded-xl ring-1 ring-white/15">
              <img
                src={asset('/images/delivery-van.png')}
                alt="Фургон доставки ДОМИНАНТ с открытым багажником у дома клиента"
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between text-[13px] text-zinc-500">
              <span>От двери магазина — до двери вашего дома</span>
              <span>ДОМИНАНТ</span>
            </figcaption>
          </figure>
        </FadeIn>
      </div>
    </section>
  )
}
