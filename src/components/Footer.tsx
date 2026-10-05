import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Instagram } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setStatus('err'); return; }
    setStatus('sending');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus('ok');
      setEmail('');
    } catch { setStatus('err'); }
  };

  return (
    <footer className="bg-[color:var(--color-ink)] text-[color:var(--color-bone)] mt-24">
      <div className="max-w-[1560px] mx-auto px-6 lg:px-10 pt-24 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Newsletter */}
          <div className="lg:col-span-6">
            <div className="text-[11px] uppercase tracking-[0.28em] opacity-60 mb-6">Correspondence — No. 07</div>
            <h3 className="font-display text-4xl lg:text-6xl leading-[0.95] tracking-tight max-w-[520px]">
              Letters from the <span className="font-display-wonk italic text-[color:var(--color-clay)]">atelier</span>.
            </h3>
            <p className="mt-6 max-w-md text-[color:var(--color-bone)]/70 leading-relaxed">
              A monthly dispatch on new arrivals, quiet essays on craft, and private previews before anyone else.
            </p>
            <form onSubmit={submit} className="mt-10 flex items-end gap-4 border-b border-[color:var(--color-bone)]/25 pb-2 max-w-md">
              <input
                type="email"
                required
                placeholder="your@correspondence.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                className="flex-1 bg-transparent outline-none py-2 placeholder:text-[color:var(--color-bone)]/40 text-[15px]"
              />
              <button type="submit" className="pb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em]">
                Subscribe <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-3 text-[11px] tracking-[0.16em] uppercase h-4">
              {status === 'sending' && <span className="opacity-60">Sending…</span>}
              {status === 'ok' && <span className="text-[color:var(--color-clay)]">Merci — check your inbox.</span>}
              {status === 'err' && <span className="text-[color:var(--color-clay)]">Please enter a valid email.</span>}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] opacity-60 mb-5">Shop</div>
              <ul className="space-y-3 font-display text-lg">
                <li><Link to="/shop?category=fragrance" className="link-underline">Fragrance</Link></li>
                <li><Link to="/shop?category=ceramics" className="link-underline">Ceramics</Link></li>
                <li><Link to="/shop?category=textiles" className="link-underline">Textiles</Link></li>
                <li><Link to="/shop?category=apothecary" className="link-underline">Apothecary</Link></li>
                <li><Link to="/shop?category=objects" className="link-underline">Objects</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] opacity-60 mb-5">Maison</div>
              <ul className="space-y-3 font-display text-lg">
                <li><Link to="/about" className="link-underline">Atelier</Link></li>
                <li><Link to="/journal" className="link-underline">Journal</Link></li>
                <li><a className="link-underline">Stockists</a></li>
                <li><a className="link-underline">Trade</a></li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] opacity-60 mb-5">Assistance</div>
              <ul className="space-y-3 font-display text-lg">
                <li><a className="link-underline">Care Guide</a></li>
                <li><a className="link-underline">Shipping</a></li>
                <li><a className="link-underline">Returns</a></li>
                <li><a className="link-underline">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-[color:var(--color-bone)]/15 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[64px] lg:text-[120px] leading-[0.8] tracking-[-0.05em]">Maison</span>
            <span className="font-display-wonk italic text-[64px] lg:text-[120px] leading-[0.8] tracking-[-0.06em] text-[color:var(--color-clay)]">Or&eacute;.</span>
          </div>
          <div className="flex flex-col gap-4">
            <a className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em]">
              <Instagram strokeWidth={1.5} className="w-4 h-4" /> @maison.ore
            </a>
            <div className="text-[11px] uppercase tracking-[0.24em] opacity-60">
              Paris · 14 rue de S&eacute;vign&eacute;
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between gap-4 text-[11px] uppercase tracking-[0.2em] opacity-50">
          <div>© MMXXVI Maison Or&eacute; — All rights reserved</div>
          <div className="flex gap-6">
            <a>Privacy</a>
            <a>Terms</a>
            <a>Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
