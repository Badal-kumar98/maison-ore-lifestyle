import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product, Category } from '../lib/types';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { fallbackProducts, fallbackCategories } from '../data/fallback';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get('category') || 'all';
  const [products, setProducts] = useState<Product[]>(() =>
    activeCategory === 'all' ? fallbackProducts : fallbackProducts.filter(p => p.category === activeCategory)
  );
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) setCategories(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const url = activeCategory === 'all' ? '/api/products' : `/api/products?category=${activeCategory}`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d) && d.length) setProducts(d);
        else {
          setProducts(
            activeCategory === 'all' ? fallbackProducts : fallbackProducts.filter(p => p.category === activeCategory)
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts(
          activeCategory === 'all' ? fallbackProducts : fallbackProducts.filter(p => p.category === activeCategory)
        );
        setLoading(false);
      });
  }, [activeCategory]);

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === 'price-asc') arr.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') arr.sort((a, b) => b.price - a.price);
    if (sort === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [products, sort]);

  const activeCat = categories.find(c => c.slug === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-14">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-[color:var(--color-mud)]" />
          {activeCategory === 'all' ? 'The Complete Catalogue' : `Chapter — ${activeCat?.name || activeCategory}`}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <h1 className="lg:col-span-8 font-display text-6xl md:text-7xl lg:text-[128px] leading-[0.85] tracking-[-0.035em]">
            {activeCategory === 'all' ? (
              <>Every <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">object.</span></>
            ) : activeCategory === 'fragrance' ? (
              <><span className="font-display-wonk italic text-[color:var(--color-terracotta)]">Fragrance</span>, bottled.</>
            ) : activeCategory === 'ceramics' ? (
              <>Formed in <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">clay.</span></>
            ) : activeCategory === 'textiles' ? (
              <>Woven, softly. <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">Slowly.</span></>
            ) : activeCategory === 'apothecary' ? (
              <>The daily <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">apothecary.</span></>
            ) : activeCategory === 'objects' ? (
              <>Objects for the <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">room.</span></>
            ) : (
              activeCat?.name
            )}
          </h1>
          <p className="lg:col-span-4 text-[color:var(--color-mud)] max-w-sm leading-relaxed">
            {activeCat?.description ||
              'The whole of Maison Oré in one composition. Filter by category, sort by whim, and take your time.'}
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 lg:top-20 z-30 bg-[color:var(--color-bone)]/90 backdrop-blur-md border-y border-[color:var(--color-sand)]">
        <div className="max-w-[1560px] mx-auto px-6 lg:px-10 flex items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none -mx-2 px-2">
            {[{ slug: 'all', name: 'All' }, ...categories].map((c) => (
              <button
                key={c.slug}
                onClick={() => {
                  const next = new URLSearchParams(params);
                  if (c.slug === 'all') next.delete('category');
                  else next.set('category', c.slug);
                  setParams(next);
                }}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.24em] whitespace-nowrap transition-colors ${
                  activeCategory === c.slug
                    ? 'text-[color:var(--color-terracotta)] border-b border-[color:var(--color-terracotta)]'
                    : 'text-[color:var(--color-mud)] hover:text-[color:var(--color-ink)]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <span className="hidden md:inline text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-mud)] tabular">
              {loading ? '—' : `${sorted.length.toString().padStart(2, '0')} objects`}
            </span>
            <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] cursor-pointer">
              <SlidersHorizontal strokeWidth={1.25} className="w-4 h-4" />
              <span className="hidden md:inline">Sort</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'default' | 'price-asc' | 'price-desc' | 'name')}
                  className="appearance-none bg-transparent pr-6 text-[11px] uppercase tracking-[0.24em] outline-none cursor-pointer"
                >
                  <option value="default">Curator's</option>
                  <option value="price-asc">Price — low</option>
                  <option value="price-desc">Price — high</option>
                  <option value="name">A — Z</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" strokeWidth={1.5} />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 py-14 lg:py-20">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[color:var(--color-cream)] animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-display text-3xl">Nothing here yet.</div>
            <p className="mt-4 text-[color:var(--color-mud)]">This chapter is being composed. Try another.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-x-8 lg:gap-y-16">
            {sorted.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
