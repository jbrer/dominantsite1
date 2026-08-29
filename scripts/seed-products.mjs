// Наполнение каталога ДОМИНАНТ демо-товарами.
// Запуск: bun scripts/seed-products.mjs [--force]
// По умолчанию скрипт ничего не делает, если товары уже есть.
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const PRODUCTS = [
  // ── Двери ────────────────────────────────────────────────
  {
    name: 'Дверь межкомнатная «Экошпон Дуб натуральный»',
    category: 'doors',
    price: 389,
    unit: 'шт',
    description:
      'Глухая или со стеклом. Размеры 600/700/800/900 × 2000 мм. Более 20 расцветок в зале.',
    sortOrder: 10,
  },
  {
    name: 'Дверь входная «Сталь-Люкс Т-2»',
    category: 'doors',
    price: 749,
    unit: 'шт',
    description:
      'Утеплённая, два замка, порошковое покрытие. Установка за один день.',
    sortOrder: 11,
  },
  {
    name: 'Ручка нажимная с магнитным замком',
    category: 'doors',
    price: 35,
    unit: 'шт',
    description: 'Тихое защёлкивание, цвет под золото / хром / брасс.',
    sortOrder: 12,
  },

  // ── Плитка ───────────────────────────────────────────────
  {
    name: 'Керамогранит Seranit Grey 60×60',
    category: 'tiles',
    price: 47,
    unit: 'м²',
    description: 'Матовый, ректифицированный край. Подходит для пола и стен.',
    sortOrder: 20,
  },
  {
    name: 'Плитка для ванной Cersanit White Gloss 25×40',
    category: 'tiles',
    price: 32,
    unit: 'м²',
    description: 'Глянцевая белая. Есть декор и бордюры в тон.',
    sortOrder: 21,
  },
  {
    name: 'Мозаика стеклянная «Микс» 30×30',
    category: 'tiles',
    price: 96,
    unit: 'м²',
    description: 'Лист на сетке 30×30 см. Для фартука и ванной.',
    sortOrder: 22,
  },

  // ── Ламинат ──────────────────────────────────────────────
  {
    name: 'Ламинат 32 класс «Дуб Кантри» 8 мм',
    category: 'laminate',
    price: 27,
    unit: 'м²',
    description: 'Фаска с четырёх сторон, замок Click. Укладка от одного дня.',
    sortOrder: 30,
  },
  {
    name: 'Ламинат влагостойкий Aqua «Дуб Сонома»',
    category: 'laminate',
    price: 34,
    unit: 'м²',
    description: 'Влагостойкая плита — подходит для кухни и прихожей.',
    sortOrder: 31,
  },
  {
    name: 'Подложка Изолон 3 мм',
    category: 'laminate',
    price: 3,
    unit: 'м²',
    description: 'Под любые виды ламината, рулон 30 м².',
    sortOrder: 32,
  },

  // ── Кухни ────────────────────────────────────────────────
  {
    name: 'Кухня прямая «Верона» 2,4 м',
    category: 'kitchens',
    price: 2190,
    unit: 'компл',
    description:
      'Фасады МДФ, столешница постформинг, доводчики Blum. Проект — бесплатно.',
    sortOrder: 40,
  },
  {
    name: 'Кухня угловая «Модена» 2,8 × 1,8 м',
    category: 'kitchens',
    price: 3490,
    unit: 'компл',
    description: '11 фасадов, ящики полного выдвижения. Замер по Брестской области.',
    sortOrder: 41,
  },
  {
    name: 'Столешница постформинг 3000 × 600 мм',
    category: 'kitchens',
    price: 149,
    unit: 'шт',
    description: 'Влагостойкая, закруглённый радиус. Более 15 декоров.',
    sortOrder: 42,
  },
]

async function main() {
  const count = await db.product.count()
  if (count > 0 && !process.argv.includes('--force')) {
    console.log(`Каталог уже содержит ${count} товаров — сид пропущен (--force для перезаписи).`)
    return
  }
  if (process.argv.includes('--force')) {
    await db.leadItem.deleteMany({})
    await db.product.deleteMany({})
  }

  for (const p of PRODUCTS) {
    await db.product.create({ data: p })
  }
  console.log(`Добавлено товаров: ${PRODUCTS.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
