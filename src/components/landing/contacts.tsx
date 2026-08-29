'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Loader2, MapPin, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { FadeIn } from './fade-in'
import { site } from '@/lib/site'

export function Contacts() {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }

      if (!res.ok || !data.ok) {
        toast({
          title: 'Не получилось отправить',
          description: data.error ?? 'Проверьте поля и попробуйте ещё раз.',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Заявка отправлена',
        description: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
      })
      setName('')
      setPhone('')
      setMessage('')
    } catch {
      toast({
        title: 'Ошибка соединения',
        description: 'Проверьте интернет или позвоните нам напрямую.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="contacts"
      className="scroll-mt-16 bg-white py-16 sm:py-20"
      aria-label="Контакты"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Контактная информация */}
        <div>
          <FadeIn>
            <h2 className="font-display text-[30px] font-medium leading-[1.12] text-zinc-950 sm:text-[38px]">
              Ждём вас в магазине
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-zinc-600 sm:text-[17px]">
              Заходите, звоните или оставьте заявку — ответим на вопросы,
              подскажем наличие и цены, рассчитаем доставку до вашего дома.
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="mt-9 border-t border-zinc-200">
              {/* Адрес */}
              <div className="border-b border-zinc-200 py-5">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-zinc-400">
                  Адрес
                </p>
                <p className="mt-1.5 text-[17px] font-bold text-zinc-950">
                  {site.addressFull}
                </p>
                <a
                  href={site.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-[14px] font-bold text-orange-600 transition-colors hover:text-orange-500"
                >
                  <MapPin className="h-4 w-4" strokeWidth={2.1} />
                  Открыть на карте
                </a>
              </div>

              {/* Телефон */}
              <div className="border-b border-zinc-200 py-5">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-zinc-400">
                  Телефон
                </p>
                <a
                  href={site.phoneHref}
                  className="mt-1.5 inline-flex items-center gap-2.5 font-display text-[24px] font-semibold tracking-normal text-zinc-950 transition-colors hover:text-orange-600"
                >
                  <Phone className="h-6 w-6 text-orange-600" strokeWidth={2.1} />
                  {site.phone}
                </a>
                <p className="mt-0.5 text-[14px] text-zinc-500">
                  Подскажем по наличию и ценам
                </p>
              </div>

              {/* Режим работы */}
              <div className="border-b border-zinc-200 py-5">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-zinc-400">
                  Режим работы
                </p>
                <dl className="mt-2 max-w-[280px] space-y-1.5">
                  {site.hours.map((row) => (
                    <div
                      key={row.days}
                      className="flex items-baseline justify-between gap-4 text-[15.5px]"
                    >
                      <dt className="text-zinc-500">{row.days}</dt>
                      <dd className="font-bold tabular-nums text-zinc-950">
                        {row.time}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Форма */}
        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div aria-hidden className="h-1 bg-orange-600" />
            <div className="p-7 sm:p-9">
              <h3 className="font-display text-[22px] font-medium tracking-normal text-zinc-950">
                Оставьте заявку
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
                Напишите, что вас интересует — перезвоним, проконсультируем
                и всё рассчитаем. Это ни к чему не обязывает.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4.5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="lead-name"
                    className="text-[13px] font-bold text-zinc-700"
                  >
                    Ваше имя
                  </Label>
                  <Input
                    id="lead-name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="Например, Александр"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-lg border-zinc-300 bg-white text-[16px] focus-visible:border-orange-600 focus-visible:ring-orange-600/25"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="lead-phone"
                    className="text-[13px] font-bold text-zinc-700"
                  >
                    Телефон
                  </Label>
                  <Input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+375 (__) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 rounded-lg border-zinc-300 bg-white text-[16px] focus-visible:border-orange-600 focus-visible:ring-orange-600/25"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="lead-message"
                    className="text-[13px] font-bold text-zinc-700"
                  >
                    Комментарий
                  </Label>
                  <Textarea
                    id="lead-message"
                    name="message"
                    rows={4}
                    maxLength={500}
                    placeholder="Например: интересуют двери и ламинат, доставка в Пинск"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="resize-none rounded-lg border-zinc-300 bg-white text-[16px] focus-visible:border-orange-600 focus-visible:ring-orange-600/25"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 text-[16px] font-bold text-white transition-all hover:bg-orange-500 active:scale-[0.99] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Отправляем...
                    </>
                  ) : (
                    <>
                      Отправить заявку
                      <ArrowRight className="h-5 w-5" strokeWidth={2.3} />
                    </>
                  )}
                </button>

                <p className="text-[12.5px] leading-relaxed text-zinc-400">
                  Нажимая «Отправить заявку», вы соглашаетесь на обработку
                  персональных данных. Мы не передаём ваши данные третьим лицам.
                </p>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
