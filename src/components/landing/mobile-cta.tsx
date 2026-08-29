'use client'

import { useEffect, useState } from 'react'
import { CalendarCheck, Phone } from 'lucide-react'
import { site } from '@/lib/site'

export function MobileCtaBar() {
  const [hidden, setHidden] = useState(false)

  // Прячем панель, пока видна секция контактов (там уже форма и телефон)
  useEffect(() => {
    const contacts = document.getElementById('contacts')
    if (!contacts || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.08 },
    )
    observer.observe(contacts)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-transform duration-300 md:hidden ${
        hidden ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex gap-2.5">
        <a
          href={site.phoneHref}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white text-[15px] font-bold text-zinc-950 active:scale-[0.98]"
          aria-label={`Позвонить: ${site.phone}`}
        >
          <Phone className="h-[18px] w-[18px] text-orange-600" strokeWidth={2.2} />
          Позвонить
        </a>
        <a
          href="#contacts"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 text-[15px] font-bold text-white active:scale-[0.98]"
        >
          <CalendarCheck className="h-[18px] w-[18px]" strokeWidth={2.2} />
          Заявка
        </a>
      </div>
    </div>
  )
}
