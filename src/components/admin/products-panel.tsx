'use client'

// Вкладка «Товары»: добавление, редактирование, скрытие и удаление позиций.
import { useState } from 'react'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  PRODUCT_CATEGORIES,
  UNITS,
  CATEGORY_MAP,
  formatPrice,
} from '@/lib/catalog'
import { api, type AdminProduct } from './shared'

type ToastFn = ReturnType<typeof import('@/hooks/use-toast').useToast>['toast']

interface Props {
  products: AdminProduct[]
  onChange: (products: AdminProduct[]) => void
  onNotify: ToastFn
}

const CATEGORY_LABELS = Object.fromEntries(
  PRODUCT_CATEGORIES.map((c) => [c.slug, c.label]),
)

interface FormState {
  name: string
  category: string
  price: string // '' = по запросу
  unit: string
  description: string
  imageUrl: string
}

const EMPTY_FORM: FormState = {
  name: '',
  category: 'doors',
  price: '',
  unit: 'шт',
  description: '',
  imageUrl: '',
}

export function ProductsPanel({ products, onChange, onNotify }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [busyRow, setBusyRow] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setDialogOpen(true)
  }

  function openEdit(p: AdminProduct) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      category: p.category,
      price: p.price == null ? '' : String(p.price),
      unit: p.unit,
      description: p.description ?? '',
      imageUrl: p.imageUrl ?? '',
    })
    setFormError(null)
    setDialogOpen(true)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return

    const trimmedPrice = form.price.trim()
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: trimmedPrice === '' ? null : Number(trimmedPrice),
      unit: form.unit,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      isActive: editingId == null ? true : undefined,
    }
    if (!Number.isNaN(Number(trimmedPrice)) && Number(trimmedPrice) < 0) {
      setFormError('Цена не может быть отрицательной')
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      if (editingId == null) {
        const res = await api<{ product: AdminProduct }>('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        onChange([res.product, ...products])
        onNotify({ title: 'Товар добавлен', description: res.product.name })
      } else {
        const res = await api<{ product: AdminProduct }>(
          `/api/admin/products/${editingId}`,
          { method: 'PATCH', body: JSON.stringify(payload) },
        )
        onChange(products.map((p) => (p.id === editingId ? res.product : p)))
        onNotify({ title: 'Изменения сохранены' })
      }
      setDialogOpen(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(p: AdminProduct) {
    setBusyRow(p.id)
    try {
      const res = await api<{ product: AdminProduct }>(`/api/admin/products/${p.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !p.isActive }),
      })
      onChange(products.map((x) => (x.id === p.id ? res.product : x)))
    } catch (e) {
      onNotify({
        title: 'Ошибка',
        description: e instanceof Error ? e.message : 'Не удалось изменить товар',
        variant: 'destructive',
      })
    } finally {
      setBusyRow(null)
    }
  }

  async function remove(id: number) {
    setBusyRow(id)
    try {
      await api(`/api/admin/products/${id}`, { method: 'DELETE' })
      onChange(products.filter((p) => p.id !== id))
      setDeleteConfirmId(null)
      onNotify({ title: 'Товар удалён' })
    } catch (e) {
      onNotify({
        title: 'Ошибка',
        description: e instanceof Error ? e.message : 'Не удалось удалить товар',
        variant: 'destructive',
      })
    } finally {
      setBusyRow(null)
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] font-semibold text-zinc-500">
          Скрытые товары не видны покупателям, но остаются в списке.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-5 text-[14px] font-bold text-white transition-colors hover:bg-orange-500 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.6} />
          Добавить товар
        </button>
      </div>

      {/* Список товаров */}
      <div className="mt-4 space-y-3">
        {products.map((p) => {
          const busy = busyRow === p.id
          return (
            <article
              key={p.id}
              className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border bg-white p-4 sm:flex-nowrap ${
                p.isActive ? 'border-zinc-200' : 'border-dashed border-zinc-300 opacity-70'
              } ${busy ? 'opacity-60' : ''}`}
            >
              <img
                src={p.imageUrl || CATEGORY_MAP[p.category]?.image}
                alt={p.name}
                className="h-14 w-14 shrink-0 rounded-lg border border-zinc-100 object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className={`truncate text-[15px] font-bold ${p.isActive ? '' : 'line-through decoration-zinc-400'}`}>
                  {p.name}
                </p>
                <p className="mt-0.5 text-[13px] text-zinc-500">
                  {CATEGORY_LABELS[p.category] ?? p.category} ·{' '}
                  {formatPrice(p.price)}
                  {p.price != null && ` / ${p.unit}`}
                </p>
              </div>

              {/* Переключатель «на витрине» */}
              <label className="flex cursor-pointer select-none items-center gap-2.5">
                <span className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">
                  {p.isActive ? 'На витрине' : 'Скрыт'}
                </span>
                <input
                  type="checkbox"
                  checked={p.isActive}
                  onChange={() => toggleActive(p)}
                  disabled={busy}
                  aria-label={`${p.isActive ? 'Скрыть' : 'Показать'} «${p.name}»`}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-orange-600 peer-checked:after:translate-x-5"
                />
              </label>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  disabled={busy}
                  aria-label={`Редактировать «${p.name}»`}
                  className="grid h-10 w-10 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-orange-600"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} />
                </button>

                {deleteConfirmId === p.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => remove(p.id)}
                      className="rounded-lg bg-red-600 px-2.5 py-2 text-[12px] font-bold text-white hover:bg-red-500"
                    >
                      Удалить?
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      aria-label="Отмена удаления"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setDeleteConfirmId(p.id)}
                    aria-label={`Удалить «${p.name}»`}
                    className="grid h-10 w-10 place-items-center rounded-lg text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            </article>
          )
        })}

        {products.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
            <p className="font-display text-xl font-extrabold">Товаров пока нет</p>
            <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-zinc-500">
              Добавьте первый товар — он сразу появится в каталоге на сайте.
            </p>
          </div>
        )}
      </div>

      {/* Диалог добавления/редактирования */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold tracking-[-0.02em]">
              {editingId == null ? 'Новый товар' : `Редактирование товара`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={save} className="mt-1 space-y-3.5">
            <Field label="Название *">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                minLength={2}
                maxLength={140}
                placeholder="Например: Дверь межкомнатная «Дуб»"
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Категория *">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputCls}
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Единица измерения">
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className={inputCls}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Цена, руб. (оставьте пустым — «по запросу»)">
              <input
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value.replace(/[^\d]/g, '') })
                }
                inputMode="numeric"
                placeholder="390"
                className={inputCls}
              />
            </Field>

            <Field label="Описание (кратко, что важно знать покупателю)">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                maxLength={500}
                placeholder="Материал, размеры, цвета…"
                className={`${inputCls} h-auto py-3`}
              />
            </Field>

            <Field label="Ссылка на фото (необязательно — иначе фото категории)">
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                inputMode="url"
                placeholder="https://…"
                className={inputCls}
              />
            </Field>

            {formError && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-600">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="inline-flex h-11 items-center rounded-xl border border-zinc-200 px-4 text-[14px] font-bold text-zinc-600 transition-colors hover:border-zinc-300"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={saving || form.name.trim().length < 2}
                className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-[14px] font-bold text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId == null ? 'Добавить' : 'Сохранить'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const inputCls =
  'h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-[14px] text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  )
}

