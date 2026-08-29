'use client'

// Рабочая панель администратора: заявки + управление товарами.
import { useCallback, useEffect, useState } from 'react'
import { Box, House, LogOut, PackageCheck, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  api,
  type AdminLead,
  type AdminProduct,
} from './shared'
import { LeadsPanel } from './leads-panel'
import { ProductsPanel } from './products-panel'

type Tab = 'leads' | 'products'

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('leads')
  const [leads, setLeads] = useState<AdminLead[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const reload = useCallback(async () => {
    setError(null)
    try {
      const [leadsRes, productsRes] = await Promise.all([
        api<{ leads: AdminLead[] }>('/api/admin/leads'),
        api<{ products: AdminProduct[] }>('/api/admin/products'),
      ])
      setLeads(leadsRes.leads)
      setProducts(productsRes.products)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить данные')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    window.location.href = '/admin/login'
  }

  const newLeads = leads.filter((l) => l.status === 'new').length
  const activeProducts = products.filter((p) => p.isActive).length

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      {/* Верхняя панель */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-600">
              <House className="h-[19px] w-[19px] text-white" strokeWidth={2.4} />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-[16px] font-extrabold tracking-[-0.02em]">
                ДОМИНАНТ
              </p>
              <p className="text-[12px] font-semibold text-zinc-400">Админ-панель</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 items-center rounded-lg border border-zinc-200 px-4 text-[13px] font-bold text-zinc-600 transition-colors hover:border-orange-300 hover:text-orange-600 sm:inline-flex"
            >
              Открыть сайт
            </a>
            <button
              type="button"
              onClick={reload}
              aria-label="Обновить данные"
              className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-orange-300 hover:text-orange-600"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold text-zinc-500 transition-colors hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8">
        {/* Мини-статистика */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-zinc-400">
              <PackageCheck className="h-4 w-4 text-orange-600" />
              Новые заявки
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
              {newLeads}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-zinc-400">
              <Box className="h-4 w-4 text-orange-600" />
              Товаров в каталоге
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
              {activeProducts}
            </p>
          </div>
        </div>

        {/* Вкладки */}
        <div className="mt-6 inline-flex rounded-xl border border-zinc-200 bg-white p-1">
          {(
            [
              ['leads', `Заявки${newLeads > 0 ? ` · ${newLeads}` : ''}`],
              ['products', `Товары · ${products.length}`],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key}
              className={`relative h-9 rounded-lg px-4 text-[14px] font-bold transition-all ${
                tab === key
                  ? key === 'leads' && newLeads > 0
                    ? 'bg-orange-600 text-white'
                    : 'bg-zinc-950 text-white'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Контент */}
        {loading ? (
          <p className="mt-10 text-center text-[15px] font-semibold text-zinc-400">
            Загружаем данные…
          </p>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-red-500"
            >
              Попробовать снова
            </button>
          </div>
        ) : tab === 'leads' ? (
          <LeadsPanel leads={leads} onChange={setLeads} onNotify={toast} />
        ) : (
          <ProductsPanel products={products} onChange={setProducts} onNotify={toast} />
        )}
      </main>
    </div>
  )
}
