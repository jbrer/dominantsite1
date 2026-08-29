'use client'

import { useEffect, useState } from 'react'
import { House, Menu, Phone } from 'lucide-react'
import { CartHeaderButton } from '@/components/cart/cart-button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { site } from '@/lib/site'

const NAV_LINKS = [
  { href: '#products', label: 'Каталог' },
  { href: '#why-us', label: 'Почему мы' },
  { href: '#delivery', label: 'Доставка' },
  { href: '#contacts', label: 'Контакты' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/95 text-zinc-950 backdrop-blur transition-shadow duration-300 ${
        scrolled ? 'border-b border-zinc-200 shadow-[0_1px_0_rgba(0,0,0,0.02)]' : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Основная навигация"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        {/* Логотип */}
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

        {/* Ссылки (десктоп) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-semibold text-zinc-600 transition-colors hover:text-orange-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Телефон (десктоп) */}
          <a
            href={site.phoneHref}
            className="hidden items-center gap-1.5 text-[14px] font-bold tracking-tight transition-colors hover:text-orange-600 lg:flex"
          >
            <Phone className="h-4 w-4 text-orange-600" strokeWidth={2.2} />
            {site.phone}
          </a>

          {/* Корзина */}
          <CartHeaderButton />

          {/* CTA */}
          <a
            href="#contacts"
            className="hidden h-10 items-center rounded-lg bg-orange-600 px-5 text-[14px] font-bold text-white transition-colors hover:bg-orange-500 active:scale-[0.98] sm:inline-flex"
          >
            Оставить заявку
          </a>

          {/* Мобильное меню */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Открыть меню"
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 md:hidden"
              >
                <Menu className="h-5 w-5" strokeWidth={2} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-black/[0.08] bg-white">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-[-0.02em] text-zinc-950">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
                    <House className="h-4 w-4 text-white" strokeWidth={2.4} />
                  </span>
                  ДОМИНАНТ
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Мобильная навигация" className="mt-2 flex flex-col">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-zinc-100 py-4 font-display text-[20px] font-bold tracking-[-0.02em] text-zinc-950 transition-colors hover:text-orange-600"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 space-y-1.5 px-1 text-sm text-zinc-500">
                <a
                  href={site.phoneHref}
                  className="block text-base font-bold text-zinc-950"
                >
                  {site.phone}
                </a>
                <p>{site.address}</p>
              </div>
              <a
                href="#contacts"
                onClick={() => setOpen(false)}
                className="mt-6 flex h-12 items-center justify-center rounded-lg bg-orange-600 text-[15px] font-bold text-white transition-colors hover:bg-orange-500"
              >
                Оставить заявку
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
