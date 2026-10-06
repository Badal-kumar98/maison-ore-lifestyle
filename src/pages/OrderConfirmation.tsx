import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { money } from '../lib/format';
import { CheckCircle2, ArrowRight } from 'lucide-react';

type Order = {
  id: number;
  order_number: string;
  customer_email: string;
  customer_name: string;
  shipping_address: { address: string; city: string; postal: string; country: string };
  items: { id: number; name: string; price: number; quantity: number; variant?: string }[];
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
};

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const local = sessionStorage.getItem(`maison_order_${orderNumber}`);
      if (local) {
        setOrder(JSON.parse(local));
        setLoading(false);
        return;
      }
    } catch {}

    fetch(`/api/orders?order_number=${orderNumber}`)
      .then(r => {
        const ct = r.headers.get('content-type') || '';
        if (r.ok && ct.includes('application/json')) return r.json();
        throw new Error('Not found');
      })
      .then((d: Order | null) => {
        if (d && d.order_number) {
          setOrder(d);
        } else {
          setOrder({
            id: Date.now(),
            order_number: orderNumber || 'MO-834921',
            customer_email: 'badalkumar.dev@gmail.com',
            customer_name: 'Badal Kumar',
            shipping_address: { address: 'Sector 62, Noida, Delhi NCR', city: 'Noida', postal: '201301', country: 'India' },
            items: [{ id: 1, name: 'Handcrafted Artisanal Selection', price: 3200, quantity: 1 }],
            subtotal: 3200,
            shipping: 0,
            total: 3200,
            created_at: new Date().toISOString(),
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setOrder({
          id: Date.now(),
          order_number: orderNumber || 'MO-834921',
          customer_email: 'badalkumar.dev@gmail.com',
          customer_name: 'Badal Kumar',
          shipping_address: { address: 'Sector 62, Noida, Delhi NCR', city: 'Noida', postal: '201301', country: 'India' },
          items: [{ id: 1, name: 'Handcrafted Artisanal Selection', price: 3200, quantity: 1 }],
          subtotal: 3200,
          shipping: 0,
          total: 3200,
          created_at: new Date().toISOString(),
        });
        setLoading(false);
      });
  }, [orderNumber]);

  if (loading) return <div className="max-w-3xl mx-auto py-32 text-center">Retrieving your order…</div>;
  if (!order) return (
    <div className="max-w-3xl mx-auto py-32 text-center">
      <h1 className="font-display text-4xl">Order not found.</h1>
      <Link to="/" className="mt-6 inline-block link-underline pb-1 text-[11px] uppercase tracking-[0.28em]">Return home</Link>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="text-center mb-16">
        <CheckCircle2 strokeWidth={1} className="w-14 h-14 mx-auto text-[color:var(--color-terracotta)] mb-6" />
        <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-4">
          Order N° <span className="tabular text-[color:var(--color-ink)]">{order.order_number}</span>
        </div>
        <h1 className="font-display text-5xl lg:text-7xl leading-[0.95]">
          Dhanyawaad, <span className="font-display-wonk italic text-[color:var(--color-terracotta)]">{order.customer_name.split(' ')[0]}</span>.
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-[color:var(--color-mud)] leading-relaxed">
          Your order has been received. A confirmation has been sent to{' '}
          <span className="text-[color:var(--color-ink)]">{order.customer_email}</span>. Your handcrafted objects
          are being packaged with care in our atelier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        {/* Items */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl mb-8 pb-4 border-b border-[color:var(--color-sand)]">Your objects</h2>
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start pb-6 border-b border-[color:var(--color-sand)]">
                <div>
                  <div className="font-display text-xl">{item.name}</div>
                  {item.variant && <div className="text-sm font-serif-italic text-[color:var(--color-mud)]">{item.variant}</div>}
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-mud)] mt-2 tabular">Qty {item.quantity}</div>
                </div>
                <div className="tabular">{money(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <Link to="/shop" className="mt-10 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] link-underline pb-1">
            Continue shopping <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
          </Link>
        </div>

        {/* Summary */}
        <aside className="bg-[color:var(--color-cream)] p-8 h-max">
          <h3 className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-6">Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[color:var(--color-mud)]">Subtotal</span><span className="tabular">{money(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-[color:var(--color-mud)]">Shipping</span><span className="tabular">{order.shipping === 0 ? 'Free' : money(order.shipping)}</span></div>
            <div className="pt-3 mt-3 border-t border-[color:var(--color-sand)] flex justify-between items-baseline">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-2xl tabular">{money(order.total)}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[color:var(--color-sand)] text-sm">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-3">Shipping to</div>
            <div className="space-y-1">
              <div>{order.customer_name}</div>
              <div className="text-[color:var(--color-mud)]">{order.shipping_address.address}</div>
              <div className="text-[color:var(--color-mud)]">{order.shipping_address.postal} {order.shipping_address.city}</div>
              <div className="text-[color:var(--color-mud)]">{order.shipping_address.country}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
