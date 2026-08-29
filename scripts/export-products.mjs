// Экспорт активных товаров из SQLite в src/data/products.json.
// JSON коммитится в репозиторий и используется статической сборкой
// для GitHub Pages (EXPORT_MODE=1), где Prisma/БД недоступны.
// Запуск: node scripts/export-products.mjs
import { PrismaClient } from '@prisma/client'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const db = new PrismaClient()

const products = await db.product.findMany({
  where: { isActive: true },
  orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
})

const data = products.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  unit: p.unit,
  description: p.description,
  imageUrl: p.imageUrl,
}))

const outPath = join(root, 'src', 'data', 'products.json')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf8')

console.log(`Экспортировано товаров: ${data.length} → src/data/products.json`)
await db.$disconnect()
