import type { NextConfig } from "next";

// Два режима сборки из одной кодовой базы:
//
// 1) Обычная сборка (по умолчанию): серверное приложение Next.js + SQLite
//    (витрина читает товары из БД, работают /api/leads и админка).
//
// 2) EXPORT_MODE=1 — статический экспорт витрины для GitHub Pages:
//    товары берутся из src/data/products.json (запекаются при сборке),
//    basePath = имя репозитория, картинки без оптимизатора.
const isExport = process.env.EXPORT_MODE === "1";
const basePath = "/dominantsite1";

const shared = {
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};

const nextConfig: NextConfig = isExport
  ? {
      ...shared,
      output: "export",
      basePath,
      images: { unoptimized: true },
    }
  : {
      ...shared,
      output: "standalone",
    };

export default nextConfig;
