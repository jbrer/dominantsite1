// Префикс статических путей для обычных <img> (next/image префиксует сам).
// На GitHub Pages витрина живёт под /dominantsite1, поэтому пути к картинкам
// в статической сборке должны начинаться с этого префикса. Значение
// NEXT_PUBLIC_BASE_PATH инлайнится на этапе сборки (EXPORT_MODE).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string): string {
  if (!path || !path.startsWith('/')) return path
  return `${BASE_PATH}${path}`
}
