const WORDS = [
  'Доставка по области',
  'Кредит',
  'Рассрочка',
  'Гарантия',
  'Двери',
  'Плитка',
  'Ламинат',
  'Кухни',
  'Всё для дома',
]

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {WORDS.map((word) => (
        <span key={word} className="flex items-center whitespace-nowrap">
          <span className="px-5 text-[14px] font-extrabold uppercase tracking-[0.08em] text-zinc-950 sm:px-6 sm:text-[15px]">
            {word}
          </span>
          <span aria-hidden className="text-black/35">
            /
          </span>
        </span>
      ))}
    </div>
  )
}

export function Ticker() {
  return (
    <div
      className="overflow-hidden bg-orange-500 py-3"
      role="marquee"
      aria-label="Ассортимент и условия магазина"
    >
      <div className="animate-ticker flex w-max">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  )
}
