'use client';

import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { add } = useCart();

  // 🚀 FIXED ARCHITECTURE MAPS: Fallback directly to real database columns
  const finalPrice = product.price; 
  const isAvailable = product.stock_quantity > 0;

  return (
    <div className="card group relative flex flex-col overflow-hidden bg-white">
      <div className="relative block aspect-square w-full overflow-hidden bg-bloom-blue/40">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">🍼</div>
        )}
        
        {!isAvailable && (
          <span className="absolute right-3 top-3 rounded-full bg-bloom-charcoal/80 px-3 py-1 text-xs font-bold text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-bloom-mintDark">
          {product.category_name || "Atelier Core"}
        </span>
        <h3 className="font-display font-semibold leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-1 flex items-center gap-1 text-sm text-bloom-charcoal/70">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {product.view_count > 0 ? `Popular (${product.view_count} views)` : 'New Arrival'}
        </div>

        <div className="mt-4 flex items-center justify-between mt-auto">
          <span className="font-display text-lg font-bold text-bloom-pinkDark">
            ₹{Number(finalPrice).toFixed(0)}
          </span>
          <button
            onClick={() => add(product.id, 1)}
            disabled={!isAvailable}
            className="rounded-full bg-bloom-pink p-2.5 text-bloom-pinkDark transition hover:bg-bloom-pinkDark hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add item to basket array"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}