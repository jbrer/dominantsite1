'use client'

// Вкладка «Заявки»: карточки лидов с товарами корзины и сменой статуса.
import { useState } from 'react'
import {
  ArrowRight,
  MessageSquareText,
  Phone,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import {
  api,
  formatDateRu,
  priceRu,
  STATUS_META,
  telHref,
  type AdminLead,
} from './shared'

type ToastFn = ReturnType<typeof import('@/hooks/use-toast').useToast>['toast']

interface Props {
  leads: AdminLead[]
  onChange: (leads: AdminLead[]) => void
  onNotify: ToastFn
}

export function LeadsPanel({ leads, onChange, onNotify }: Props) {
  const [busyId, setBusyId] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  async function setStatus(lead: AdminLead, status: string) {
    setBusyId(lead.id)
    try {
      const res = await api<{ lead: AdminLead }>(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      onChange(leads.map((l) => (l.id === lead.id ? res.lead : l)))
    } catch (e) {
      onNotify({
        title: 'Ошибка',
        description: e instanceof Error ? e.message : 'Не удалось обновить заявку',
        variant: 'destructive',
      })
    } finally {
      setBusyId(null)
    }
  }

  async function removeLead(id: number) {
    setBusyId(id)
    try {
      await api(`/api/admin/leads/${id}`, { method: 'DELETE' })
      onChange(leads.filter((l) => l.id !== id))
      setDeleteConfirmId(null)
      onNotify({ title: 'Заявка удалена' })
    } catch (e) {
      onNotify({
        title: 'Ошибка',
        description: e instanceof Error ? e.message : 'Не удалось удалить заявку',
        variant: 'destructive',
      })
    } finally {
      setBusyId(null)
    }
  }

  if (leads.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <MessageSquareText className="h-10 w-10 text-zinc-300" strokeWidth={1.6} />
        <h3 className="mt-4 font-display text-xl font-extrabold">Заявок пока нет</h3>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-zinc-500">
          Как только покупатель оставит заявку на сайте или из корзины — она
          сразу появится здесь.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {leads.map((lead) => {
        const meta = STATUS_META[lead.status] ?? STATUS_META.new
        const total = lead.items.reduce(
          (sum, i) => sum + (i.price == null ? 0 : i.price * i.qty),
          0,
        )
        const hasAskPrice = lead.items.some((i) => i.price == null)
        const busy = busyId === lead.id

        return (
          <article
            key={lead.id}
            className={`rounded-2xl border bg-white p-5 transition-opacity ${
              lead.status === 'new'
                ? 'border-orange-200 shadow-[0_10px_36px_-24px_rgba(234,88,12,0.5)]'
                : 'border-zinc-200'
            } ${busy ? 'opacity-60' : ''}`}
          >
            {/* Шапка карточки */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-display text-[15px] font-extrabold">
                Заявка №{lead.id}
              </span>
              <span className="text-[13px] font-semibold text-zinc-400">
                {formatDateRu(lead.createdAt)}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold ${
                  lead.source === 'cart'
                    ? 'bg-zinc-950 text-white'
                    : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {lead.source === 'cart' && (
                  <ShoppingCart className="h-3 w-3" strokeWidth={2.4} />
                )}
                {lead.source === 'cart' ? 'Из корзины' : 'Форма'}
              </span>
              <span className={`ml-auto rounded-full px-3 py-1 text-[12px] font-extrabold ${meta.badge}`}>
                {meta.label}
              </span>
            </div>

            {/* Клиент */}
            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="text-[16px] font-bold">{lead.name}</p>
              <a
                href={telHref(lead.phone)}
                className="inline-flex items-center gap-1.5 font-bold text-orange-600 transition-colors hover:text-orange-500"
              >
                <Phone className="h-4 w-4" strokeWidth={2.2} />
                {lead.phone}
              </a>
            </div>

            {lead.message && (
              <blockquote className="mt-2.5 rounded-lg bg-zinc-50 px-3.5 py-2.5 text-[14px] leading-relaxed text-zinc-600">
                «{lead.message}»
              </blockquote>
            )}

            {/* Товары */}
            {lead.items.length > 0 && (
              <div className="mt-3 overflow-hidden rounded-xl border border-zinc-100">
                <table className="w-full text-[13.5px]">
                  <tbody className="divide-y divide-zinc-100">
                    {lead.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3.5 py-2 font-semibold">
                          {item.qty} × {item.name}
                        </td>
                        <td className="whitespace-nowrap px-3.5 py-2 text-right font-bold tabular-nums text-zinc-500">
                          {item.price == null
                            ? 'по запросу'
                            : `${priceRu(item.price * item.qty)}`}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-zinc-50/70">
                      <td className="px-3.5 py-2 font-extrabold">Итого</td>
                      <td className="whitespace-nowrap px-3.5 py-2 text-right font-extrabold tabular-nums">
                        {hasAskPrice && '> '}
                        {priceRu(total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Действия */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {lead.status === 'new' && (
                <>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setStatus(lead, 'in_progress')}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-orange-300 px-4 text-[13px] font-bold text-orange-600 transition-colors hover:bg-orange-50"
                  >
                    Взять в работу
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setStatus(lead, 'done')}
                    className="inline-flex h-10 items-center rounded-lg px-3 text-[13px] font-bold text-zinc-500 transition-colors hover:text-zinc-900"
                  >
                    Сразу выполнить
                  </button>
                </>
              )}
              {lead.status === 'in_progress' && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setStatus(lead, 'done')}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-orange-600 px-4 text-[13px] font-bold text-white transition-colors hover:bg-orange-500"
                >
                  Выполнена
                </button>
              )}
              {lead.status === 'done' && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setStatus(lead, 'in_progress')}
                  className="inline-flex h-10 items-center rounded-lg px-3 text-[13px] font-bold text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  Вернуть в работу
                </button>
              )}

              <div className="ml-auto">
                {deleteConfirmId === lead.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-red-500">
                      Удалить безвозвратно?
                    </span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => removeLead(lead.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-[12px] font-bold text-white hover:bg-red-500"
                    >
                      Да
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-bold text-zinc-500 hover:text-zinc-900"
                    >
                      Нет
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label={`Удалить заявку №${lead.id}`}
                    disabled={busy}
                    onClick={() => setDeleteConfirmId(lead.id)}
                    className="grid h-10 w-10 place-items-center rounded-lg text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
