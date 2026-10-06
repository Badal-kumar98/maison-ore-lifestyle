import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { money } from '../lib/format';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  card: string;
  exp: string;
  cvc: string;
};

export default function Checkout() {
  const { items, subtotal, sessionId } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'info' | 'shipping' | 'payment'>('info');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: '', firstName: '', lastName: '', address: '', city: 'Noida', postal: '201301', country: 'India',
    card: '', exp: '', cvc: '',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const shipping = subtotal >= 2999 ? 0 : 199;
  const total = subtotal + shipping;

  const set = (k: keyof FormState, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = (fields: (keyof FormState)[]) => {
    const errs: Partial<FormState> = {};
    fields.forEach(f => {
      if (!form[f]?.trim()) errs[f] = 'Required';
    });
    if (fields.includes('email') && form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (fields.includes('card') && form.card && form.card.replace(/\s/g, '').length < 12) errs.card = 'Invalid card';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (step === 'info' && validate(['email', 'firstName', 'lastName'])) setStep('shipping');
    else if (step === 'shipping' && validate(['address', 'city', 'postal', 'country'])) setStep('payment');
  };

  const submit = async () => {
    if (!validate(['card', 'exp', 'cvc'])) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          customer_email: form.email,
          customer_name: `${form.firstName} ${form.lastName}`,
          shipping_address: {
            address: form.address, city: form.city, postal: form.postal, country: form.country,
          },
          items: items.map(i => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            variant: i.variant,
          })),
          subtotal, shipping, total,
        }),
      });
      const order = await res.json();
      navigate(`/order/${order.order_number}`);
    } catch (e) {
      console.error(e);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-5xl">Nothing to check out.</h1>
        <p className="mt-4 text-[color:var(--color-mud)]">Your cart is empty. Compose a selection first.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 link-underline pb-1 text-[11px] uppercase tracking-[0.28em]">
          Browse the shop
        </Link>
      </div>
    );
  }

  const steps = ['info', 'shipping', 'payment'] as const;

  const input = (name: keyof FormState, label: string, type = 'text', placeholder = '') => (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-mud)]">{label}</span>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => set(name, e.target.value)}
        placeholder={placeholder}
        className={`mt-2 w-full bg-transparent border-b py-3 outline-none transition-colors text-[15px] placeholder:text-[color:var(--color-mist)] ${
          errors[name] ? 'border-[color:var(--color-terracotta)]' : 'border-[color:var(--color-sand)] focus:border-[color:var(--color-ink)]'
        }`}
      />
      {errors[name] && <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-terracotta)] mt-1 block">{errors[name]}</span>}
    </label>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px]">
        {/* Form column */}
        <div className="px-6 lg:px-16 py-12 lg:py-20">
          <Link to="/" className="inline-flex items-baseline gap-1 mb-12">
            <span className="font-display text-2xl">Maison</span>
            <span className="font-display-wonk italic text-2xl text-[color:var(--color-terracotta)]">Or&eacute;</span>
          </Link>

          <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-8 hover:text-[color:var(--color-ink)]">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} /> Continue shopping
          </Link>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs tabular ${
                    steps.indexOf(step) >= i
                      ? 'bg-[color:var(--color-ink)] text-[color:var(--color-bone)] border-[color:var(--color-ink)]'
                      : 'border-[color:var(--color-sand)] text-[color:var(--color-mud)]'
                  }`}
                >
                  {steps.indexOf(step) > i ? <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} /> : i + 1}
                </div>
                <span className="text-[11px] uppercase tracking-[0.24em] capitalize hidden sm:inline">
                  {s}
                </span>
                {i < 2 && <span className="w-8 h-px bg-[color:var(--color-sand)]" />}
              </div>
            ))}
          </div>

          {step === 'info' && (
            <div className="space-y-8 animate-fade-up">
              <div>
                <h2 className="font-display text-4xl">Your <span className="font-display-wonk italic">details</span>.</h2>
                <p className="text-[color:var(--color-mud)] mt-2">Where should we send confirmation?</p>
              </div>
              {input('email', 'Email', 'email', 'you@correspondence.com')}
              <div className="grid grid-cols-2 gap-6">
                {input('firstName', 'First name')}
                {input('lastName', 'Last name')}
              </div>
              <button onClick={next} className="bg-[color:var(--color-ink)] text-[color:var(--color-bone)] px-8 py-4 text-[11px] uppercase tracking-[0.28em] hover:bg-[color:var(--color-terracotta)] transition-colors">
                Continue to shipping
              </button>
            </div>
          )}

          {step === 'shipping' && (
            <div className="space-y-8 animate-fade-up">
              <div>
                <h2 className="font-display text-4xl">Delivery <span className="font-display-wonk italic">address</span>.</h2>
                <p className="text-[color:var(--color-mud)] mt-2">Dispatched via insured, climate-conscious pan-India courier.</p>
              </div>
              {input('address', 'Street address / Locality', 'text', 'Sector 62, Noida, Delhi NCR')}
              <div className="grid grid-cols-2 gap-6">
                {input('city', 'City', 'text', 'Noida')}
                {input('postal', 'PIN Code (6 digits)', 'text', '201301')}
              </div>
              {input('country', 'Country', 'text', 'India')}
              <div className="flex gap-3">
                <button onClick={() => setStep('info')} className="px-6 py-4 text-[11px] uppercase tracking-[0.28em] border border-[color:var(--color-sand)]">
                  Back
                </button>
                <button onClick={next} className="flex-1 bg-[color:var(--color-ink)] text-[color:var(--color-bone)] px-8 py-4 text-[11px] uppercase tracking-[0.28em] hover:bg-[color:var(--color-terracotta)] transition-colors">
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-8 animate-fade-up">
              <div>
                <h2 className="font-display text-4xl">Secure <span className="font-display-wonk italic">payment</span>.</h2>
                <p className="text-[color:var(--color-mud)] mt-2 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" strokeWidth={1.5} /> 256-bit encrypted transaction · UPI / RuPay / Cards
                </p>
              </div>
              <div className="flex gap-3 p-3 bg-[color:var(--color-cream)] border border-[color:var(--color-sand)] rounded-sm text-xs font-medium text-[color:var(--color-mud)]">
                <span className="px-3 py-1.5 bg-white text-[color:var(--color-ink)] rounded shadow-xs font-semibold">UPI / GPay / PhonePe</span>
                <span className="px-3 py-1.5 bg-white text-[color:var(--color-ink)] rounded shadow-xs font-semibold">RuPay / Visa / MC</span>
                <span className="px-3 py-1.5 bg-white text-[color:var(--color-ink)] rounded shadow-xs font-semibold">NetBanking</span>
              </div>
              {input('card', 'Card number / UPI ID', 'text', '4242 •••• •••• 4242 or user@upi')}
              <div className="grid grid-cols-2 gap-6">
                {input('exp', 'Expiry (MM / YY)', 'text', '12 / 28')}
                {input('cvc', 'CVC', 'text', '•••')}
              </div>
              <div className="bg-[color:var(--color-cream)] p-5 text-sm text-[color:var(--color-mud)] leading-relaxed">
                This is a demonstration craft checkout. No card or UPI is charged.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('shipping')} className="px-6 py-4 text-[11px] uppercase tracking-[0.28em] border border-[color:var(--color-sand)]">
                  Back
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex-1 bg-[color:var(--color-terracotta)] text-[color:var(--color-bone)] px-8 py-4 text-[11px] uppercase tracking-[0.28em] hover:bg-[color:var(--color-ink)] transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Placing order…' : `Place order — ${money(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary column */}
        <aside className="bg-[color:var(--color-cream)] px-6 lg:px-12 py-12 lg:py-20 border-l border-[color:var(--color-sand)]">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-mud)] mb-6">Order summary</div>
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-20 bg-[color:var(--color-bone)] overflow-hidden shrink-0">
                  <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[color:var(--color-ink)] text-[color:var(--color-bone)] text-[10px] flex items-center justify-center tabular">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-mud)]">{item.product.category}</div>
                  <div className="font-display text-base leading-tight mt-0.5 truncate">{item.product.name}</div>
                  {item.variant && <div className="text-xs font-serif-italic text-[color:var(--color-mud)] mt-0.5">{item.variant}</div>}
                </div>
                <div className="text-sm tabular shrink-0">{money(item.product.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-[color:var(--color-sand)] space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[color:var(--color-mud)]">Subtotal</span>
              <span className="tabular">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[color:var(--color-mud)]">Shipping</span>
              <span className="tabular">{shipping === 0 ? 'Complimentary' : money(shipping)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[color:var(--color-sand)] flex justify-between items-baseline">
            <span className="font-display text-lg">Total</span>
            <span className="font-display text-3xl tabular">{money(total)}</span>
          </div>

          <div className="mt-10 space-y-4 text-[11px] uppercase tracking-[0.24em] text-[color:var(--color-mud)]">
            <div>— Estimated delivery in 3–5 days</div>
            <div>— Wrapped in unbleached tissue &amp; linen ribbon</div>
            <div>— A handwritten note enclosed</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
