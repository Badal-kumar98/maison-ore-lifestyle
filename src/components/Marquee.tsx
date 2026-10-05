export default function Marquee() {
  const items = [
    'Complimentary shipping on orders over $180',
    'New — Ourika Fragrance Collection',
    'Studio hours · Tues–Sat · 11–7',
    'Made slowly. Kept forever.',
    'Now shipping to 47 countries',
  ];
  const strip = [...items, ...items, ...items];
  return (
    <div className="bg-[color:var(--color-ink)] text-[color:var(--color-bone)] py-2 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {strip.map((t, i) => (
          <span key={i} className="px-8 text-[11px] uppercase tracking-[0.28em] font-medium">
            {t} <span className="ml-8 opacity-40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
