const FACTS = [
  'Доставка по всей Брестской области',
  'Кредит и рассрочка — оформим на месте',
  'Гарантия на всю продукцию',
  'Пинск — Иваново — Дрогичин и весь регион',
]

// Тонкая полоса фактов вместо бегущей строки и блока «преимуществ»:
// магазин сообщает условия, а не продаёт их.
export function FactsStrip() {
  return (
    <section
      className="border-b border-white/10 bg-zinc-950 text-white"
      aria-label="Условия магазина"
    >
      <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact) => (
            <li
              key={fact}
              className="flex items-center gap-2.5 text-[13.5px] font-medium leading-snug text-zinc-300"
            >
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-orange-600" />
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
