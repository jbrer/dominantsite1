import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ДОМИНАНТ — всё для дома в Дрогичине | Двери, плитка, ламинат, кухни",
  description:
    "Магазин ДОМИНАНТ в Дрогичине: двери, плитка, ламинат, кухни. Помогаем создать дом мечты! Доставка по Брестской области, любые виды кредитования, рассрочка, гарантия. Ждём вас: г. Дрогичин, ул. Ленина, 2А.",
  keywords: [
    "ДОМИНАНТ",
    "двери Дрогичин",
    "плитка Дрогичин",
    "ламинат Дрогичин",
    "кухни Дрогичин",
    "стройматериалы Брестская область",
    "рассрочка на ремонт",
  ],
  icons: {
    // В статическом экспорте сайт живёт под basePath (GitHub Pages)
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg`,
  },
  openGraph: {
    title: "ДОМИНАНТ — помогаем создать дом мечты",
    description:
      "Двери, плитка, ламинат, кухни. Доставка по Брестской области, кредит и рассрочка, гарантия. г. Дрогичин, ул. Ленина, 2А.",
    siteName: "ДОМИНАНТ",
    type: "website",
    locale: "ru_BY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${playfair.variable} font-sans antialiased bg-white text-zinc-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
