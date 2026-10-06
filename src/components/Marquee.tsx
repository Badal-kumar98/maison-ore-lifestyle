export default function Marquee() {
  const items = [
    'Complimentary pan-India shipping on orders over ₹2,999',
    'New — Kannauj Mitti & Gulab Botanical Attar',
    'Studio hours · Tues–Sun · 11:00 AM – 8:00 PM',
    'Shuddh Karigari. Made slowly, kept forever.',
    'Handcrafted across 14 heritage craft clusters of India',
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
