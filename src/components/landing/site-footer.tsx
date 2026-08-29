import { Clock, House, MapPin, Phone } from 'lucide-react'
import { site } from '@/lib/site'

const NAV = [
  { href: '#catalog', label: 'Каталог' },
  { href: '#why-us', label: 'Почему мы' },
  { href: '#delivery', label: 'Доставка' },
  { href: '#contacts', label: 'Контакты' },
]

const CATEGORIES = ['Двери', 'Плитка', 'Ламинат', 'Кухни']

export function SiteFooter() {
  return (
    <footer className="bg-zinc-950 text-white" aria-label="Подвал сайта">
      {/* Сплошная оранжевая линия */}
      <div aria-hidden className="h-1 bg-orange-600" />

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Бренд */}
          <div>
            <a
              href="#top"
              aria-label="ДОМИНАНТ — наверх"
              className="flex items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600">
                <House className="h-[19px] w-[19px] text-white" strokeWidth={2.4} />
              </span>
              <span className="font-display text-[18px] font-extrabold tracking-[-0.02em]">
                ДОМИНАНТ
              </span>
            </a>
            <p className="mt-4 max-w-[240px] text-[13.5px] leading-relaxed text-zinc-400">
              Магазин товаров для дома. У нас есть всё и даже больше —{' '}
              {site.tagline.toLowerCase()}.
            </p>
          </div>

          {/* Разделы */}
          <nav aria-label="Разделы сайта">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
              Разделы
            </p>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Каталог */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
              Каталог
            </p>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <a
                    href="#catalog"
                    className="text-zinc-300 transition-colors hover:text-white"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
              Контакты
            </p>
            <ul className="mt-4 space-y-3 text-[14px] text-zinc-300">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                  strokeWidth={2}
                />
                {site.addressFull}
              </li>
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-2.5 font-bold text-white transition-colors hover:text-orange-400"
                >
                  <Phone
                    className="h-4 w-4 shrink-0 text-zinc-500"
                    strokeWidth={2}
                  />
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                  strokeWidth={2}
                />
                <span>
                  Пн–Пт {site.hours[0]?.time} · Сб {site.hours[1]?.time} · Вс{' '}
                  {site.hours[2]?.time}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-[12.5px] text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ДОМИНАНТ. Все права защищены.</p>
          <p>{site.cities.join(' — ')} · доставка по Брестской области</p>
        </div>
      </div>
    </footer>
  )
}
