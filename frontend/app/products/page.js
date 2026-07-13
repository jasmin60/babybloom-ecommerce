'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    getProducts()
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.product_tags && p.product_tags.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 w-full">
        <input 
          type="text" 
          placeholder="Search master clothing logs, lookbooks, and database tags..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border-4 border-bloom-blue bg-white px-6 py-5 text-xl font-medium outline-none transition focus:border-bloom-pinkDark shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-center py-10 text-bloom-charcoal/60">Polling catalog indices...</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <div key={product.id} className="card relative flex flex-col overflow-hidden bg-white p-4">
              <img src={product.image} alt="" className="h-48 w-full object-cover rounded-xl" />
              <h3 className="font-display font-bold mt-3 text-lg truncate">{product.name}</h3>
              
              <div className="mt-2 text-xs font-extrabold px-3 py-1.5 rounded bg-bloom-cream text-bloom-charcoal/80">
                STOCK: {product.stock_quantity > 0 ? (
                  <span className="text-green-600">{product.stock_quantity} PIECES RESTOCK SYNCED</span>
                ) : (
                  <span className="text-red-500">OUT OF STOCK METRIC</span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between mt-auto pt-2">
                <span className="font-display font-bold text-bloom-pinkDark text-lg">₹{product.price}</span>
                
                {/* 🚀 THE FIX: Check stock_quantity instead of in_stock */}
                <button 
                  onClick={() => add(product.id, 1)} 
                  disabled={product.stock_quantity <= 0}
                  className="btn-primary text-xs px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {product.stock_quantity > 0 ? 'Add to cart 🍼' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}