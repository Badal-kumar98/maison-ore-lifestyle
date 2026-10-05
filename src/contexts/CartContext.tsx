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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => { setSessionId(getSessionId()); }, []);

  const refresh = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/cart?session_id=${encodeURIComponent(sessionId)}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => { if (sessionId) refresh(); }, [sessionId, refresh]);

  const add = async (productId: number, quantity = 1, variant: string | null = null) => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, product_id: productId, quantity, variant }),
    });
    await refresh();
    setIsOpen(true);
  };

  const update = async (id: number, quantity: number) => {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity }),
    });
    await refresh();
  };

  const remove = async (id: number) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await refresh();
  };

  const clear = async () => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, clear: true }),
    });
    await refresh();
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
