import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div>
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-16">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-[color:var(--color-mud)]" />
          The Atelier — Handcrafted in India · Studio Delhi NCR
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <h1 className="lg:col-span-8 font-display text-5xl md:text-7xl lg:text-[112px] leading-[0.9] tracking-[-0.035em]">
            A small house for <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">honest</span> objects <br />
            made by <span className="font-display-wonk italic">quiet</span> hands.
          </h1>
          <p className="lg:col-span-4 text-[color:var(--color-mud)] leading-relaxed">
            Maison Oré was conceived in an artisan studio in Delhi NCR as a sanctuary
            for slow Indian craft. We work in direct partnership with fifty-three
            generational Karigars across Uttar Pradesh, Gujarat, Kashmir and Bengal.
          </p>
        </div>
      </section>

      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-24">
        <div className="aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
          <img src="./craft-workshop.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
          <img src="./editorial-bedroom.jpg" alt="" className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="bg-[color:var(--color-cream)]">
        <div className="max-w-[1560px] mx-auto px-6 lg:px-10 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)]">Our principles</div>
            <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] mt-4">Four things we <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">believe</span>.</h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              ['Fewer, Better', 'Small editions of honest Indian objects worth keeping — nothing hurried, nothing disposable.'],
              ['Shuddh Materials', 'Only indigenous Kala cotton, handspun wool, alluvial stoneware, mouth-blown glass and raw brass. Zero plastic.'],
              ['Fair to the Karigar', 'Our master craftsmen are named, credited and paid dignified craft compensation. The pride sits with the maker.'],
              ['Kept Forever', 'Heirloom endurance on every object. Longevity and parampara is our sustainability promise.'],
            ].map(([t, d], i) => (
              <div key={t}>
                <div className="font-display text-4xl tabular text-[color:var(--color-terracotta)]">{(i + 1).toString().padStart(2, '0')}</div>
                <h3 className="font-display text-2xl mt-4">{t}</h3>
                <p className="mt-3 text-[color:var(--color-mud)] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-4">The Curators</div>
          <h2 className="font-display text-4xl lg:text-6xl leading-[0.95]">Badal Kumar &amp; Guild.</h2>
          <p className="mt-6 text-[color:var(--color-mud)] leading-relaxed max-w-md">
            Maison Oré is curated by Badal Kumar alongside an atelier team devoted to
            preserving and elevating India's indigenous craft traditions. Together we
            compose each seasonal edition in intimate collaboration with master craftspeople.
          </p>
          <blockquote className="mt-10 pl-5 border-l-2 border-[color:var(--color-terracotta)] font-display italic text-xl lg:text-2xl max-w-md leading-snug">
            “We wanted a maison that honors the timeless dignity of Indian handcraft — slow,
            honest, deeply rooted in the soil, and made for mindful living.”
          </blockquote>
          <Link to="/shop" className="mt-10 inline-flex items-center gap-3 bg-[color:var(--color-ink)] text-[color:var(--color-bone)] px-8 py-4 text-[11px] uppercase tracking-[0.28em] hover:bg-[color:var(--color-terracotta)] transition-colors">
            Enter the shop <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] overflow-hidden bg-[color:var(--color-cream)]">
            <img src="./editorial-bedroom.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-[3/4] overflow-hidden bg-[color:var(--color-cream)] mt-12">
            <img src="./craft-workshop.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
