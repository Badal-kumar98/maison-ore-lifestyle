import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { Product } from '../lib/types';
import { money, num } from '../lib/format';
import { useCart } from '../contexts/CartContext';

type Props = { product: Product; index?: number };

export default function ProductCard({ product, index = 0 }: Props) {
  const { add } = useCart();

  return (
    <div className="group">
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden bg-[color:var(--color-cream)]">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover img-hover"
          />
        </div>
        {product.edition && (
          <span className="absolute top-4 left-4 bg-[color:var(--color-bone)]/90 backdrop-blur-sm px-3 py-1.5 text-[10px] uppercase tracking-[0.24em]">
            {product.edition}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            add(product.id, 1, product.variants?.[0] || null);
          }}
          className="absolute bottom-4 right-4 w-11 h-11 bg-[color:var(--color-bone)] hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-bone)] transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full"
          aria-label="Add to cart"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </Link>
      <div className="pt-5 flex justify-between items-baseline gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--color-mud)] mb-1.5 flex items-center gap-2">
            <span className="tabular">N°{num(index + 1)}</span>
            <span className="w-4 h-px bg-[color:var(--color-mist)]" />
            <span>{product.category}</span>
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="font-display text-xl lg:text-2xl leading-tight tracking-[-0.01em] block truncate hover:text-[color:var(--color-terracotta)] transition-colors"
          >
            {product.name}
          </Link>
          <div className="text-xs text-[color:var(--color-mud)] mt-1 font-serif-italic">
            {product.short_description}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-lg tabular">{money(product.price)}</div>
        </div>
      </div>
    </div>
  );
}
