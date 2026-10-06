import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, Minus, Plus, ArrowRight, Truck, Leaf, RotateCw } from 'lucide-react';
import type { Product } from '../lib/types';
import { money } from '../lib/format';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import { fallbackProducts } from '../data/fallback';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string>('details');
  const [related, setRelated] = useState<Product[]>([]);
  const [adding, setAdding] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setQty(1);
    window.scrollTo(0, 0);

    const fallback = fallbackProducts.find(p => p.slug === slug) || fallbackProducts[0];

    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then((p: Product) => {
        const prod = p?.id ? p : fallback;
        setProduct(prod);
        setVariant(prod?.variants?.[0] || '');
        setRelated(fallbackProducts.filter(x => x.id !== prod.id).slice(0, 4));
        setLoading(false);
      })
      .catch(() => {
        setProduct(fallback);
        setVariant(fallback?.variants?.[0] || '');
        setRelated(fallbackProducts.filter(x => x.id !== fallback.id).slice(0, 4));
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[1560px] mx-auto px-6 lg:px-10 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="aspect-[4/5] bg-[color:var(--color-cream)] animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 w-32 bg-[color:var(--color-cream)] animate-pulse" />
          <div className="h-16 bg-[color:var(--color-cream)] animate-pulse" />
          <div className="h-32 bg-[color:var(--color-cream)] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-5xl">Not found</h1>
        <p className="mt-4 text-[color:var(--color-mud)]">That object has slipped from the catalogue.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 link-underline pb-1 text-[11px] uppercase tracking-[0.28em]">
          Return to shop <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image_url];

  const doAdd = async () => {
    setAdding(true);
    await add(product.id, qty, variant || null);
    setAdding(false);
  };

  const acc = (key: string, label: string, body: React.ReactNode) => (
    <div className="border-b border-[color:var(--color-sand)]">
      <button
        className="w-full flex justify-between items-center py-5 text-left group"
        onClick={() => setOpenAccordion(openAccordion === key ? '' : key)}
      >
        <span className="text-[11px] uppercase tracking-[0.28em] font-medium">{label}</span>
        <ChevronDown
          strokeWidth={1.5}
          className={`w-4 h-4 transition-transform ${openAccordion === key ? 'rotate-180' : ''}`}
        />
      </button>
      {openAccordion === key && <div className="pb-6 pr-6 text-[color:var(--color-espresso)]/85 leading-relaxed">{body}</div>}
    </div>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-[1560px] mx-auto px-6 lg:px-10 pt-8 text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-mud)] flex items-center gap-2">
        <Link to="/" className="hover:text-[color:var(--color-ink)]">Maison</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[color:var(--color-ink)]">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-[color:var(--color-ink)]">{product.category}</Link>
        <span>/</span>
        <span className="text-[color:var(--color-ink)]">{product.name}</span>
      </div>

      {/* Main */}
      <section className="max-w-[1560px] mx-auto px-6 lg:px-10 pt-8 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-4">
            <div className="order-2 lg:order-1 flex lg:flex-col gap-3">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 lg:w-20 lg:h-24 bg-[color:var(--color-cream)] overflow-hidden border transition ${
                    activeImage === i ? 'border-[color:var(--color-ink)]' : 'border-transparent hover:border-[color:var(--color-mist)]'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/5] bg-[color:var(--color-cream)] overflow-hidden">
              <img
                key={activeImage}
                src={gallery[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover animate-fade-up"
              />
              {product.edition && (
                <div className="absolute top-6 left-6 bg-[color:var(--color-bone)]/90 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-[0.24em]">
                  {product.edition}
                </div>
              )}
              <div className="absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-bone)] mix-blend-difference tabular">
                {(activeImage + 1).toString().padStart(2, '0')} / {gallery.length.toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-5 lg:pt-4 lg:sticky lg:top-24 self-start">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-4 flex items-center gap-3">
            <span>{product.category}</span>
            <span className="w-6 h-px bg-[color:var(--color-mist)]" />
            <span>{product.origin}</span>
          </div>
          <h1 className="font-display text-5xl lg:text-6xl leading-[0.95] tracking-tight">
            {product.name}
          </h1>
          <p className="mt-4 font-serif-italic text-lg text-[color:var(--color-mud)]">{product.short_description}</p>

          <div className="mt-8 flex items-baseline gap-4">
            <span className="font-display text-3xl tabular">{money(product.price)}</span>
            <span className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-mud)]">Incl. VAT</span>
          </div>

          <p className="mt-8 text-[color:var(--color-espresso)]/85 leading-[1.75]">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mt-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] uppercase tracking-[0.28em]">Variant</span>
                <span className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-mud)]">{variant}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`px-5 py-3 text-xs uppercase tracking-[0.16em] border transition ${
                      variant === v
                        ? 'border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-bone)]'
                        : 'border-[color:var(--color-sand)] hover:border-[color:var(--color-mud)]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + add */}
          <div className="mt-10 flex items-stretch gap-3">
            <div className="flex items-center border border-[color:var(--color-sand)]">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-14 flex items-center justify-center hover:bg-[color:var(--color-cream)]">
                <Minus className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <span className="w-10 text-center tabular">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-11 h-14 flex items-center justify-center hover:bg-[color:var(--color-cream)]">
                <Plus className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <button
              onClick={doAdd}
              disabled={adding || !product.in_stock}
              className="flex-1 h-14 bg-[color:var(--color-ink)] text-[color:var(--color-bone)] hover:bg-[color:var(--color-terracotta)] transition-colors text-[11px] uppercase tracking-[0.28em] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {adding ? 'Adding…' : product.in_stock ? `Add to cart — ${money(product.price * qty)}` : 'Sold out'}
            </button>
          </div>

          {/* Micro promises */}
          <div className="mt-8 pt-8 border-t border-[color:var(--color-sand)] grid grid-cols-3 gap-6 text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-mud)]">
            <div className="flex flex-col items-start gap-2">
              <Truck strokeWidth={1.25} className="w-4 h-4" />
              <span>Free ship ₹2,999+</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Leaf strokeWidth={1.25} className="w-4 h-4" />
              <span>Zero plastic</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <RotateCw strokeWidth={1.25} className="w-4 h-4" />
              <span>30-day return</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="mt-10">
            {acc(
              'details',
              'Composition & Details',
              <ul className="space-y-2">
                {product.details?.map((d, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[color:var(--color-terracotta)] tabular font-serif-italic">{(i + 1).toString().padStart(2, '0')}</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            )}
            {acc(
              'material',
              'Material & Dimensions',
              <div className="space-y-3">
                <div className="flex justify-between border-b border-[color:var(--color-sand)] pb-2">
                  <span className="text-[color:var(--color-mud)]">Materials</span>
                  <span>{product.materials}</span>
                </div>
                <div className="flex justify-between border-b border-[color:var(--color-sand)] pb-2">
                  <span className="text-[color:var(--color-mud)]">Dimensions</span>
                  <span>{product.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-mud)]">Craft Origin</span>
                  <span>{product.origin}</span>
                </div>
              </div>
            )}
            {acc('care', 'Care & Keeping',
              <p>
                Wipe gently with a dry cotton or linen cloth. Store away from harsh direct sunlight.
                Handcrafted objects breathe and mature gracefully with time — mindful care preserves their generational life.
              </p>
            )}
            {acc('shipping', 'Shipping & Returns',
              <p>
                Dispatched within 48 hours in handmade recycled paper and cotton string. Complimentary
                pan-India delivery on orders over ₹2,999. Easy returns within 30 days.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-[1560px] mx-auto px-6 lg:px-10 pb-24">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-3xl lg:text-5xl">
              You might also <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">consider</span>.
            </h2>
            <Link to={`/shop?category=${product.category}`} className="text-[11px] uppercase tracking-[0.28em] link-underline pb-1">
              More in {product.category}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
