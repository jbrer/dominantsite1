# AGENTS.md — контекст проекта «ДОМИНАНТ» для ИИ-агента

Прочитай этот файл целиком перед любой работой с кодом. Он описывает, что это за проект,
как его запустить, где что лежит, какие решения уже приняты и почему, и какие есть грабли.

---

## 1. Что это

Одностраничный сайт + MVP-каталог магазина стройматериалов **«ДОМИНАНТ»**
(«у нас есть всё и даже больше!», слоган «Помогаем создать дом мечты 🏠»).

- **Города**: Пинск – Иваново – Дрогичин (доставка по Брестской области)
- **Адрес**: г. Дрогичин, ул. Ленина 2А
- **Категории**: Двери ▪️ Плитка ▪️ Ламинат ▪️ Кухни
- **Преимущества**: 🚚 Доставка по Брестской области, 📂 Любые виды кредитования,
  💳 Рассрочки, 🔝 Гарантия
- **Аудитория**: люди 25–70 лет → стиль «тёплый премиум», а не стерильный минимализм
- **Палитра СТРОГО**: чёрный / белый / оранжевый (orange-500/600 как единственный акцент)
- Весь контент на русском языке

Статус: лендинг полностью готов и проверен (клиент одобрил: «вот, это уже прикольно»).
MVP «Каталог → Корзина → Заявка» + админка реализованы и верифицированы E2E.

---

## 2. Быстрый старт

```bash
# 1) зависимости (проект использует bun; npm тоже подойдёт)
bun install        # или npm install

# 2) Prisma-клиент
npx prisma generate          # или: npm run db:generate / bun run db:generate

# 3) База SQLite уже в архиве: db/custom.db (12 демо-товаров + демо-заявка).
#    Если её нет или нужна чистая:
npm run db:push              # создаст схему; сид товаров ниже
node scripts/seed-products.mjs            # наполнить товарами (idempotent)
node scripts/seed-products.mjs --force    # удалить все товары и засеять заново

# 4) .env — база прописана АБСОЛЮТНЫМ путём! После распаковки архива
#    в другое место поправь DATABASE_URL в .env на свой путь, например:
#    DATABASE_URL=file:/home/user/dominant/db/custom.db
#    Там же лежит ADMIN_PASSCODE (пароль админки).

# 5) запуск и проверки
npm run dev        # дев-сервер на :3000 (логи → dev.log)
npm run lint       # eslint по всему проекту (должен быть чистым)
npx tsc --noEmit   # типы (тоже чисто)
```

⚠️ Скрипты `scripts/verify-*.sh` рассчитаны на эту песочницу (сервер убивается между
bash-вызовами, поэтому всё делается одним скриптом). На обычной машине просто запусти
`npm run dev` и открой сайт.

---

## 3. Стек

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** (через `@tailwindcss/postcss`) + shadcn/ui (`src/components/ui/`)
- **Prisma 6 + SQLite** (`db/custom.db`, схема `prisma/schema.prisma`)
- **zustand v5** — корзина с persist в localStorage
- **framer-motion** — staggered-анимации (ease `[0.22, 1, 0.36, 1]`)
- **zod** — валидация API
- lucide-react (иконки), sonner/react-toast (тосты)

---

## 4. Карта проекта

```
prisma/schema.prisma          Product / Lead / LeadItem (описание полей внутри)
db/custom.db                  готовая SQLite-база (сид товаров сделан)
src/lib/site.ts               ⚠️ КОНФИГ САЙТА: телефон-ЗАГЛУШКА, часы работы-ЗАГЛУШКИ,
                              адрес, города, mapUrl — владелец должен заменить!
src/lib/admin-auth.ts         авторизация админки: env ADMIN_PASSCODE || 'dominant2026',
                              sha256-токен в cookie 'dominant_admin', timingSafeEqual
src/lib/db.ts                 singleton PrismaClient
src/lib/cart-store.ts         zustand-корзина (persist localStorage), SSR-safe через
                              useSyncExternalStore — паттерн mounted() запрещён линтом!
src/lib/catalog.ts            фильтр каталога (zustand): бенто-категории скроллят к
                              секции #products с предустановленным фильтром
src/app/page.tsx              порядок секций лендинга
src/app/layout.tsx            шрифт Manrope (latin+cyrillic), SEO на русском, lang="ru"
src/components/landing/       hero, ticker, benefits, categories(bento), why-us,
                              delivery, contacts(форма лидов), site-header(с кнопкой
                              корзины), site-footer, mobile-cta(панель внизу мобилки)
src/components/catalog/catalog-section.tsx   витрина #products: чипы-фильтры,
                              карточки товаров, степпер «в корзине», force-dynamic
src/components/cart/          cart-sheet (drawer со списком, +/-, формой заявки и
                              success-экраном «Заявка №N»), cart-button (badge в шапке;
                              на мобилке отдельный FAB)
src/components/admin/         admin-dashboard (статистика + вкладки Заявки/Товары),
                              products-panel (CRUD-диалог, тумблер «На витрине»),
                              leads-panel (снапшот состава, статусы новая→в работе→выполнена)
src/app/admin/login/page.tsx  вход по паролю
src/app/api/leads/route.ts         POST заявки (форма ИЛИ корзина c items[{id,qty}];
                                   цены/названия фиксируются НА СЕРВЕРЕ — антиподделка)
src/app/api/admin/*           login/logout/products/[id]/leads/[id] — всё под cookie-
                              авторизацией (см. isAdminRequest)
public/images/                фирменные AI-фото: hero, category-doors/tiles/laminate/
                              kitchen, delivery-van (+ favicon.svg, logo.svg)
scripts/seed-products.mjs     сид 12 демо-товаров
scripts/gen-images.mjs, gen-delivery.mjs   генерация фото через z-ai-web-dev-sdk
scripts/verify-catalog.sh     полный E2E-прогон (методология проверок)
worklog.md                    журнал всех итераций разработки (4 задачи)
```

Скриншоты текущего дизайна (**смотри только эти**, остальные — старые отвергнутые версии):
- `scripts/v3-*.png` — лендинг «тёплый премиум» (hero, catalog, whyus, delivery, contacts…)
- `scripts/v4-*.png` — каталог/корзина/админка: `v4-01-home`, `v4-02-catalog`,
  `v4-03-filter-tiles`, `v4-04-added-badge`, `v4-05-cart`, `v4-06-success`,
  `v4-07..08-admin-login`, `v4-09-admin-leads`, `v4-10-lead-inprogress`,
  `v4-11-admin-products`, `v4-12-admin-newproduct`, `v4-m1/m2/m3-*` — мобильные.

НЕ ориентироваться на `redesign*.png`, `v2-*.png`, `verify-*.png` — это предыдущие
отвергнутые клиентом версии дизайна.

---

## 5. Модель данных (SQLite через Prisma)

- **Product**: name, category (`doors|tiles|laminate|kitchens`), price Int? (null = «цена
  по запросу»), unit (шт/м²/пог.м…), description?, imageUrl? (если пусто — фото категории),
  isActive («На витрине»), sortOrder, createdAt.
- **Lead**: name, phone, message?, source (`form|cart`), status (`new|in_progress|done`),
  items[] .
- **LeadItem** — снапшот позиции на момент покупки (name/price/unit/qty), productId
  SetNull, leadId Cascade. История заявок не ломается при изменении/удалении товара.

Демо-данные: 12 товаров из сида; заявка «Ольга Петрова» (source=cart) оставлена
СПЕЦИАЛЬНО как демо для владельца — не удалять без необходимости.

---

## 6. Ключевые продуктовые решения (не ломать без нужды)

1. **Оплата не предусмотрена** — это MVP: посетитель кладёт товары в корзину и оставляет
   заявку (имя + телефон + комментарий); менеджер перезванивает.
2. Цены в заявке фиксируются сервером из БД (клиент присылает только {id, qty}).
3. Корзина живёт в localStorage (zustand persist) — переживает перезагрузку.
4. Витрина показывает только isActive=true, сортировка sortOrder.
5. Админка сознательно простая: один пароль из env, sha256-cookie, без сессий в БД.
   Для продакшена стоит заменить на настоящую auth — сейчас этого НЕ требуется.
6. Дизайн прошёл 4 итерации отбора; текущий утверждён клиентом. Менять внешний вид можно
   только точечно, сохраняя палитру ч/б/оранж и уровень детализации («не ИИ-шно»):
   сплошные цвета вместо градиентов/свечений, радиусы 8–16px, редакционные макеты
   с номерами и линиями, оранжевый дозированно (~5 акцентов на экран), фото без людей.

---

## 7. Что владелец должен заменить (плейсхолдеры)

- Телефон `+375 (29) 123-45-67` — заглушка → `src/lib/site.ts`
- Часы работы (3 блока days/time) — заглушки → там же
- Пароль админки: поменять `ADMIN_PASSCODE` в `.env`
- При продакшене: DATABASE_URL на постоянный путь + бэкапы `db/custom.db`

---

## 8. Известные грабли

- **Генерация изображений**: `import ZAI from 'z-ai-web-dev-sdk'` (ТОЛЬКО default import,
  named `{ ZAI }` не существует); вызов `const zai = await ZAI.create()` ОДИН раз;
  размеры кратны 32px (например 1152×864, 1344×768). Референс: scripts/gen-images.mjs.
- **Кастомные CSS-классы в globals.css могут не попасть в сборку** после правок —
  помогает рестарт дев-сервера с удалением `.next`.
- **next/image кэширует по URL**: если заменил файл картинки, переименуй URL (так
  delivery.png стал delivery-van.png).
- **ESLint строгий**: правило `react-hooks/set-state-in-effect` запрещает паттерн
  «mounted-стейт» — SSR-safe значения делать через useSyncExternalStore
  (референс: src/lib/cart-store.ts). `npm run lint` и
  `npx tsc --noEmit` обязаны быть чистыми после любых правок.
- Корзина чистится ТОЛЬКО после успешной отправки заявки (был баг — не забывать clear()).
- Zod-схема товаров: description/imageUrl nullish, sortOrder default(0) — пустые поля
  формы админки валидны.

---

## 9. Возможные следующие шаги (ничего из этого не требовано, идеи)

- Загрузка реальных фото товаров вместо AI-генерации (нужен upload-endpoint в админке).
- Изменение цены/остатков пачкой, экспорт заявок в CSV/XLSX.
- Уведомление владельца о новой заявке (Telegram-бот или SMS/e-mail).
- Реальная карта проезда вместо ссылки, отзывы, блок акций.
- SEO: sitemap.xml, Open Graph изображения, микроразметка Organization/Product.

---

## 10. Git и GitHub

- Git-репозиторий лежит в корне проекта, ветка `main`.
- **Песочница может сбрасываться к старому состоянию** (случилось 29.08: потеряли
  правки нескольких итераций). Поэтому после КАЖДОЙ значимой итерации — коммит,
  а если remote настроен — ещё и push. Журнал итераций — `worklog.md`.
- Загрузка на GitHub: `GITHUB_TOKEN=... GITHUB_USER=... bash scripts/github-setup.sh`
  (создаёт приватный репозиторий и пушит main; нужен токен с scope `repo`).
- В git НЕ хранятся: `.env` (только `.env.example`), `node_modules`, `.next`,
  скриншоты в `scripts/`, каталоги песочницы (`upload`, `download`, `tests`,
  `examples`, `mini-services`, `.zscripts`).
- В git ХРАНЯТСЯ: `db/custom.db` (демо-база: 12 товаров + демо-заявка) — после
  клонирования проект сразу рабочий; `bun.lock`; `AGENTS.md`; `worklog.md`.
- Восстановление последней версии после сброса: архив, скачанный владельцем
  (`dominant-showroom-site-*.zip`), распаковать поверх проекта, затем коммит.
