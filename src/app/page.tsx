import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { FactsStrip } from '@/components/landing/facts-strip'
import { CatalogSection } from '@/components/catalog/catalog-section'
import { CartSheet } from '@/components/cart/cart-sheet'
import { CartFab } from '@/components/cart/cart-button'
import { WhyUs } from '@/components/landing/why-us'
import { Delivery } from '@/components/landing/delivery'
import { Contacts } from '@/components/landing/contacts'
import { SiteFooter } from '@/components/landing/site-footer'
import { MobileCtaBar } from '@/components/landing/mobile-cta'
import { db } from '@/lib/db'
import type { PublicProduct } from '@/lib/catalog'

// Витрина должна мгновенно отражать изменения из админки
export const dynamic = 'force-dynamic'

async function getProducts(): Promise<PublicProduct[]> {
  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  })
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    unit: p.unit,
    description: p.description,
    imageUrl: p.imageUrl,
  }))
}

// Структура «магазин, а не лендинг»: шапка → короткая вводная полоса →
// полоса фактов → каталог (главный блок) → о магазине → доставка → контакты.
export default async function Home() {
  const products = await getProducts()

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FactsStrip />
        <CatalogSection products={products} />
        <WhyUs />
        <Delivery />
        <Contacts />
      </main>
      <div className="mt-auto">
        <SiteFooter />
      </div>
      {/* Отступ под фиксированную мобильную панель CTA */}
      <div aria-hidden className="h-[76px] md:hidden" />
      <MobileCtaBar />
      {/* Корзина доступна с любой точки страницы */}
      <CartSheet products={products} />
      <CartFab />
    </div>
  )
}
