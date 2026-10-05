import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import { money } from '../lib/format';
import { fallbackProducts } from '../data/fallback';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>(() => fallbackProducts.filter(p => p.featured));
  const [latest, setLatest] = useState<Product[]>(() => fallbackProducts.slice(0, 8));

  useEffect(() => {
    fetch('/api/products?featured=true&limit=4')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) setFeatured(d); })
      .catch(() => {});
    fetch('/api/products?limit=8')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) setLatest(d); })
      .catch(() => {});
  }, []);

  const hero = featured[0] || fallbackProducts[0];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1560px] mx-auto px-6 lg:px-10 pt-8 lg:pt-14 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-4 mb-8 text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)]">
                <span className="w-8 h-px bg-[color:var(--color-mud)]" />
                Volume XII &middot; Autumn Edit
              </div>
              <h1 className="font-display text-[52px] sm:text-[68px] lg:text-[104px] leading-[0.88] tracking-[-0.035em] font-normal">
                Objects for a <br />
                <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">slower</span> life,
                <br />
                <span className="text-[color:var(--color-mud)]">kept for longer.</span>
              </h1>
              <p className="mt-8 lg:mt-10 max-w-md text-[15px] leading-[1.7] text-[color:var(--color-espresso)]/85">
                A small, considered catalogue of ceramics, fragrance and textiles —
                composed with fifty-three artisans across France, Japan and Morocco.
                Made in intentionally small volumes. Sent with a handwritten note.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-[color:var(--color-ink)] text-[color:var(--color-bone)] px-8 py-4 text-[11px] uppercase tracking-[0.28em] hover:bg-[color:var(--color-terracotta)] transition-colors"
                >
                  Discover the collection <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
                </Link>
                <Link
                  to="/journal"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] link-underline pb-1"
                >
                  Read the journal <ArrowUpRight strokeWidth={1.5} className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-14 pt-8 border-t border-[color:var(--color-sand)] grid grid-cols-3 gap-6">
                {[
                  ['53', 'Artisans'],
                  ['12', 'Materials'],
                  ['∞', 'Guarantee'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display text-4xl lg:text-5xl tabular">{n}</div>
                    <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-mud)] mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-cream)]">
                <img src="/hero-interior.jpg" alt="" className="w-full h-full object-cover" />
                <div className="absolute left-6 top-6 flex flex-col gap-1 text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-bone)] mix-blend-difference">
                  <span>Composition N° IV</span>
                  <span className="opacity-70">Livingroom, Paris studio</span>
                </div>
              </div>
              {hero && (
                <Link
                  to={`/product/${hero.slug}`}
                  className="absolute -bottom-8 -left-4 lg:-left-16 w-52 lg:w-64 bg-[color:var(--color-bone)] p-4 shadow-[0_20px_60px_-20px_rgba(28,24,21,0.35)] hidden md:block group"
                >
                  <div className="aspect-square overflow-hidden mb-3">
                    <img src={hero.image_url} className="w-full h-full object-cover img-hover" alt={hero.name} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-mud)]">Featured</div>
                  <div className="font-display text-lg leading-tight mt-1">{hero.name}</div>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="font-serif-italic text-xs text-[color:var(--color-mud)]">Shop the object</span>
                    <span className="font-display tabular">{money(hero.price)}</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="border-y border-[color:var(--color-sand)] mt-10">
        <div className="max-w-[1560px] mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-5 divide-x divide-[color:var(--color-sand)]">
          {[
            ['Fragrance', 'fragrance', 'Ⅰ'],
            ['Ceramics', 'ceramics', 'Ⅱ'],
            ['Textiles', 'textiles', 'Ⅲ'],
            ['Apothecary', 'apothecary', 'Ⅳ'],
            ['Objects', 'objects', 'Ⅴ'],
          ].map(([label, slug, num]) => (
            <Link
              key={slug}
              to={`/shop?category=${slug}`}
              className="group px-4 py-8 lg:py-12 flex flex-col items-start hover:bg-[color:var(--color-cream)] transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-mud)]">Chapitre {num}</span>
              <span className="font-display text-2xl lg:text-3xl mt-3 group-hover:italic group-hover:text-[color:var(--color-terracotta)] transition-all">
                {label}
              </span>
              <ArrowUpRight strokeWidth={1.25} className="w-4 h-4 mt-4 text-[color:var(--color-mud)] group-hover:text-[color:var(--color-terracotta)]" />
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
        <div className="flex items-end justify-between mb-12 lg:mb-16 gap-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-5">
              — Chosen this season
            </div>
            <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] tracking-tight">
              The house <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">favourites</span>.
            </h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] link-underline pb-1">
            View all <ArrowUpRight strokeWidth={1.5} className="w-4 h-4" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[color:var(--color-cream)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="bg-[color:var(--color-espresso)] text-[color:var(--color-bone)] relative overflow-hidden">
        <div className="max-w-[1560px] mx-auto px-6 lg:px-10 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="aspect-[3/4] overflow-hidden">
              <img src="/craft-workshop.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] uppercase tracking-[0.28em] opacity-60">
              <span>Plate 03 — The Wheel</span>
              <span>Kyoto, 04:12</span>
            </div>
          </div>
          <div className="lg:col-span-7 lg:pl-12 order-1 lg:order-2">
            <div className="text-[11px] uppercase tracking-[0.28em] opacity-60 mb-6">Essay N° 03</div>
            <h2 className="font-display text-4xl lg:text-6xl leading-[1] tracking-tight">
              On the quiet dignity of things <br />
              <span className="font-display-wonk italic text-[color:var(--color-clay)]">made by hand.</span>
            </h2>
            <p className="mt-8 max-w-xl text-[15px] leading-[1.75] opacity-80">
              Our ceramics are formed at a wheel in a small studio outside Kyoto by
              Nao Matsumoto, whose family has worked clay for four generations. Each
              vessel is a little different from the last — which is, we think, the point.
              Perfection belongs to machines. Character belongs to us.
            </p>
            <blockquote className="mt-12 pl-6 border-l border-[color:var(--color-clay)]/50 max-w-lg">
              <p className="font-display italic text-xl lg:text-2xl leading-snug">
                “What we make with the hand carries the hand within it — you can feel the maker
                after the maker has gone.”
              </p>
              <footer className="mt-4 text-[11px] uppercase tracking-[0.28em] opacity-70">
                — Nao Matsumoto, Ceramicist
              </footer>
            </blockquote>
            <Link to="/journal" className="mt-10 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] link-underline pb-1">
              Read the essay <ArrowUpRight strokeWidth={1.5} className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST GRID */}
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
        <div className="flex items-end justify-between mb-12 lg:mb-16 gap-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-5">
              — Newly composed
            </div>
            <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] tracking-tight">
              Latest <span className="font-display-wonk italic">arrivals</span>.
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)]">
            <span>Updated weekly</span>
            <span className="w-12 h-px bg-[color:var(--color-mist)]" />
            <Link to="/shop" className="link-underline pb-1 text-[color:var(--color-ink)]">All objects</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {latest.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* PROMISE */}
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 pb-24">
        <div className="bg-[color:var(--color-cream)] px-8 lg:px-16 py-16 lg:py-24 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {[
            {
              n: '01',
              t: 'Slowly Made',
              d: 'Every piece is produced in editions of fewer than 400 — often much fewer. No mass-market, ever.',
            },
            {
              n: '02',
              t: 'Carefully Sent',
              d: 'Wrapped in unbleached tissue, tied with linen ribbon, and delivered carbon-neutral within four days.',
            },
            {
              n: '03',
              t: 'Kept Forever',
              d: 'A lifetime repair promise on every object. If it breaks, we mend it. If we cannot, we replace it.',
            },
          ].map((x) => (
            <div key={x.n}>
              <div className="font-display text-6xl tabular text-[color:var(--color-terracotta)] leading-none">{x.n}</div>
              <h3 className="font-display text-2xl mt-6">{x.t}</h3>
              <p className="mt-3 text-[color:var(--color-mud)] leading-relaxed max-w-xs">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
