#!/usr/bin/env bash
# Статическая сборка витрины для GitHub Pages (EXPORT_MODE).
# Используется локально и в .github/workflows/deploy-pages.yml.
# Результат — каталог out/ с готовым статическим сайтом.
set -euo pipefail
cd "$(dirname "$0")/.."

export EXPORT_MODE=1
export NEXT_PUBLIC_STATIC=1
export NEXT_PUBLIC_BASE_PATH=/dominantsite1
# В CI базы нет: PrismaClient создаётся, но не используется (товары из JSON)
export DATABASE_URL="${DATABASE_URL:-file:./ci-placeholder.db}"

# 1) Серверные части несовместимы со статическим экспортом — временно убираем
mkdir -p .export-tmp
rm -rf .export-tmp/api .export-tmp/admin
mv src/app/api .export-tmp/api
mv src/app/admin .export-tmp/admin

# 2) force-dynamic запрещён в экспорте — временно комментируем
cp src/app/page.tsx src/app/page.tsx.bak
sed -i "s|^export const dynamic = 'force-dynamic'|// static export: страница prerenderится при сборке|" src/app/page.tsx

restore() {
  mv src/app/page.tsx.bak src/app/page.tsx 2>/dev/null || true
  [ -d .export-tmp/api ] && mv .export-tmp/api src/app/api
  [ -d .export-tmp/admin ] && mv .export-tmp/admin src/app/admin
  rm -rf .export-tmp
}
trap restore EXIT

# 3) Сборка (напрямую next build — npm run build заточен под standalone)
rm -rf out
npx next build
touch out/.nojekyll

echo "== Готово: статический сайт в out/ (basePath /dominantsite1)"
