import { X, Minus, Plus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { money } from '../lib/format';
import { useEffect } from 'react';

export default function CartDrawer() {
  const { isOpen, close, items, subtotal, update, remove } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const handleCheckout = () => {
    close();
    navigate('/checkout');
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-[opacity,visibility] duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100 visible' : 'pointer-events-none opacity-0 invisible'
      }`}
    >
      <div
        className={`absolute inset-0 bg-[color:var(--color-ink)]/50 transition-opacity duration-300 cursor-pointer ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
        aria-label="Close cart"
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[480px] bg-[color:var(--color-bone)] flex flex-col pointer-events-auto shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between px-8 py-6 border-b border-[color:var(--color-sand)]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)]">Your selection</div>
            <h2 className="font-display text-2xl mt-1">The Cart</h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="p-2 -mr-2 cursor-pointer hover:text-[color:var(--color-terracotta)] transition-colors"
            aria-label="Close"
          >
            <X strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
            <div className="w-16 h-16 rounded-full border border-[color:var(--color-sand)] flex items-center justify-center mb-6">
              <span className="font-display italic text-[color:var(--color-mud)]">Ø</span>
            </div>
            <h3 className="font-display text-3xl mb-3">Your cart is quiet.</h3>
            <p className="text-[color:var(--color-mud)] max-w-xs mb-8">
              A small selection thoughtfully composed awaits. Begin with something you would keep for years.
            </p>
            <Link
              to="/shop"
              onClick={close}
              className="inline-flex items-center gap-3 border-b border-[color:var(--color-ink)] pb-1 text-[11px] uppercase tracking-[0.28em] cursor-pointer"
            >
              Browse the shop <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5">
                  <Link
                    to={`/product/${item.product.slug}`}
                    onClick={close}
                    className="block w-24 h-32 bg-[color:var(--color-cream)] overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-mud)]">
                          {item.product.category}
                        </div>
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={close}
                          className="font-display text-lg leading-tight mt-1 block hover:text-[color:var(--color-terracotta)] transition-colors cursor-pointer"
                        >
                          {item.product.name}
                        </Link>
                        {item.variant && (
                          <div className="text-xs text-[color:var(--color-mud)] mt-1 font-serif-italic">
                            — {item.variant}
                          </div>
                        )}
                      </div>
                      <div className="text-sm tabular">{money(item.product.price * item.quantity)}</div>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-[color:var(--color-sand)]">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-[color:var(--color-cream)] cursor-pointer"
                          onClick={() => update(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm tabular">{item.quantity}</span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-[color:var(--color-cream)] cursor-pointer"
                          onClick={() => update(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-mud)] hover:text-[color:var(--color-terracotta)] cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-[color:var(--color-sand)] p-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--color-mud)]">Subtotal</span>
                <span className="tabular">{money(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[color:var(--color-mud)]">Shipping</span>
                <span className="tabular">
                  {subtotal >= 2999 ? 'Complimentary' : money(199)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-[color:var(--color-sand)]">
                <span className="font-display text-lg">Total</span>
                <span className="font-display text-2xl tabular">
                  {money(subtotal + (subtotal >= 2999 ? 0 : 199))}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="mt-4 w-full flex items-center justify-center gap-3 bg-[color:var(--color-ink)] text-[color:var(--color-bone)] py-4 text-[11px] uppercase tracking-[0.28em] hover:bg-[color:var(--color-terracotta)] transition-colors cursor-pointer"
              >
                Proceed to checkout <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-mud)]">
                Free pan-India shipping over ₹2,999 · 30-day returns
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
