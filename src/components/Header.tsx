import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { count, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[12px] uppercase tracking-[0.24em] font-medium transition-colors ${
      isActive ? 'text-[color:var(--color-ink)]' : 'text-[color:var(--color-mud)] hover:text-[color:var(--color-ink)]'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md transition-all ${
        scrolled ? 'bg-[color:var(--color-bone)]/85 border-b border-[color:var(--color-sand)]' : 'bg-[color:var(--color-bone)]/50'
      }`}
    >
      <div className="max-w-[1560px] mx-auto px-6 lg:px-10">
        <div className="h-16 lg:h-20 grid grid-cols-3 items-center">
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink to="/shop" className={linkClass}>Shop</NavLink>
            <NavLink to="/shop?category=fragrance" className={linkClass}>Sugandh</NavLink>
            <NavLink to="/shop?category=ceramics" className={linkClass}>Mitti</NavLink>
            <NavLink to="/shop?category=textiles" className={linkClass}>Hathkargha</NavLink>
            <NavLink to="/journal" className={linkClass}>Journal</NavLink>
            <NavLink to="/about" className={linkClass}>Atelier</NavLink>
          </nav>
          <button
            className="lg:hidden justify-self-start p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Menu strokeWidth={1.25} className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="justify-self-center flex items-baseline gap-1">
            <span className="font-display text-[26px] lg:text-[30px] font-medium tracking-[-0.03em] leading-none">
              Maison
            </span>
            <span className="font-display-wonk text-[26px] lg:text-[30px] italic font-medium leading-none text-[color:var(--color-terracotta)]">
              Or&eacute;
            </span>
          </Link>

          {/* Right actions */}
          <div className="justify-self-end flex items-center gap-1 lg:gap-3">
            <button className="hidden lg:inline-flex p-2 hover:text-[color:var(--color-terracotta)] transition-colors" aria-label="Search">
              <Search strokeWidth={1.25} className="w-[18px] h-[18px]" />
            </button>
            <button className="hidden lg:inline-flex p-2 hover:text-[color:var(--color-terracotta)] transition-colors" aria-label="Account">
              <User strokeWidth={1.25} className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={open}
              className="relative p-2 hover:text-[color:var(--color-terracotta)] transition-colors flex items-center gap-2"
              aria-label="Cart"
            >
              <ShoppingBag strokeWidth={1.25} className="w-[18px] h-[18px]" />
              <span className="text-[11px] tabular tracking-[0.2em] uppercase">
                ({count.toString().padStart(2, '0')})
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[color:var(--color-ink)]/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[86%] max-w-sm bg-[color:var(--color-bone)] p-8">
            <div className="flex justify-between items-center mb-12">
              <span className="font-display text-2xl">Menu</span>
              <button onClick={() => setMobileOpen(false)}><X strokeWidth={1.25} /></button>
            </div>
            <nav className="flex flex-col gap-6">
              {[
                ['/shop', 'Shop All'],
                ['/shop?category=fragrance', 'Sugandh & Attar'],
                ['/shop?category=ceramics', 'Mitti & Ceramics'],
                ['/shop?category=textiles', 'Hathkargha Textiles'],
                ['/shop?category=lighting', 'Prakash & Brass'],
                ['/shop?category=decor', 'Karigari & Objects'],
                ['/journal', 'Journal'],
                ['/about', 'The Atelier'],
              ].map(([to, label]) => (
                <NavLink key={to} to={to} className="font-display text-3xl tracking-tight">
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-16 text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-mud)]">
              Delhi NCR — Mehrauli — Jaipur
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
