'use client'

// Вход в админ-панель по паролю (MVP без NextAuth).
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { House, Loader2, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!passcode.trim() || sending) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Ошибка входа')
      router.replace('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа')
      setSending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-12 text-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 shadow-[0_16px_40px_-16px_rgba(234,88,12,0.8)]">
            <House className="h-7 w-7" strokeWidth={2.4} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold tracking-[-0.02em]">
            ДОМИНАНТ · Админка
          </h1>
          <p className="mt-2 max-w-[260px] text-[14px] leading-relaxed text-zinc-400">
            Управление товарами и заявками магазина
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
        >
          <label
            htmlFor="passcode"
            className="text-[13px] font-bold uppercase tracking-wide text-zinc-400"
          >
            Пароль доступа
          </label>
          <div className="relative mt-2">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              autoFocus
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-white/10 bg-zinc-900 pl-11 pr-4 text-[15px] text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25"
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-[13px] font-semibold text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!passcode.trim() || sending}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 text-[15px] font-bold text-white transition-all hover:bg-orange-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending && <Loader2 className="h-4 w-4 animate-spin" />}
            {sending ? 'Проверяем…' : 'Войти'}
          </button>

          <a
            href="/"
            className="mt-4 block text-center text-[13px] font-semibold text-zinc-500 transition-colors hover:text-orange-400"
          >
            ← Вернуться на сайт
          </a>
        </form>
      </div>
    </div>
  )
}
