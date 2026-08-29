import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { ADMIN_COOKIE, expectedToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Админ-панель — ДОМИНАНТ',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const store = await cookies()
  if (store.get(ADMIN_COOKIE)?.value !== expectedToken()) {
    redirect('/admin/login')
  }
  return <AdminDashboard />
}
