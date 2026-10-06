import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getSessionId } from '../lib/session';
import type { CartItem } from '../lib/types';

type CartCtx = {
  items: CartItem[];
  loading: boolean;
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (productId: number, quantity?: number, variant?: string | null) => Promise<void>;
  update: (id: number, quantity: number) => Promise<void>;
  remove: (id: number) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
  sessionId: string;
};

const Ctx = createContext<CartCtx | null>(null);

import { fallbackProducts } from '../data/fallback';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maison_ore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => { setSessionId(getSessionId()); }, []);

  const saveLocal = (next: CartItem[]) => {
    setItems(next);
    try { localStorage.setItem('maison_ore_cart', JSON.stringify(next)); } catch {}
  };

  const refresh = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/cart?session_id=${encodeURIComponent(sessionId)}`);
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
          try { localStorage.setItem('maison_ore_cart', JSON.stringify(data)); } catch {}
        }
      }
    } catch {
      // Keep existing local items
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => { if (sessionId) refresh(); }, [sessionId, refresh]);

  const add = async (productId: number, quantity = 1, variant: string | null = null) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, product_id: productId, quantity, variant }),
      });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        await refresh();
        setIsOpen(true);
        return;
      }
    } catch {}

    // Local fallback
    const p = fallbackProducts.find(x => x.id === productId);
    if (p) {
      setItems(prev => {
        const existing = prev.find(i => i.product.id === productId && i.variant === variant);
        let next: CartItem[];
        if (existing) {
          next = prev.map(i => i === existing ? { ...i, quantity: i.quantity + quantity } : i);
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            quantity,
            variant: variant || '',
            product: p,
          };
          next = [...prev, newItem];
        }
        try { localStorage.setItem('maison_ore_cart', JSON.stringify(next)); } catch {}
        return next;
      });
    }
    setIsOpen(true);
  };

  const update = async (id: number, quantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity }),
      });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        await refresh();
        return;
      }
    } catch {}

    setItems(prev => {
      let next: CartItem[];
      if (quantity <= 0) {
        next = prev.filter(i => i.id !== id);
      } else {
        next = prev.map(i => i.id === id ? { ...i, quantity } : i);
      }
      try { localStorage.setItem('maison_ore_cart', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const remove = async (id: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        await refresh();
        return;
      }
    } catch {}
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      try { localStorage.setItem('maison_ore_cart', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const clear = async () => {
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, clear: true }),
      });
    } catch {}
    setItems([]);
    try { localStorage.setItem('maison_ore_cart', JSON.stringify([])); } catch {}
  };

  const count = useMemo(() => items.reduce((a, b) => a + b.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((a, b) => a + (b.product?.price || 0) * b.quantity, 0),
    [items]
  );

  return (
    <Ctx.Provider
      value={{
        items, loading, count, subtotal, isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        add, update, remove, clear, refresh, sessionId,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
