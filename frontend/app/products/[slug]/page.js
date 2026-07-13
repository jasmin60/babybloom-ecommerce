'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Star, ShoppingBag, Minus, Plus, Truck, ShieldCheck } from 'lucide-react';
import { getProduct, postReview } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams(); // 'slug' acts as the product primary ID token in your routes
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const { add } = useCart();
  const { user } = useAuth();

  const loadProductSpecificationBuffer = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProduct(slug);
      setProduct(data);
    } catch (err) {
      console.error("Endpoint lookup tracking latency:", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProductSpecificationBuffer();
  }, [loadProductSpecificationBuffer]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to leave a product review review.');
      return;
    }
    try {
      await postReview(slug, { rating: reviewRating, comment: reviewText });
      toast.success('Thanks for your experience review feedback!');
      setReviewText('');
      loadProductSpecificationBuffer();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not register user review text.');
    }
  };

  if (loading) return <p className="py-24 text-center text-bloom-charcoal/50 font-display text-xl">Polling master catalog matrix indices...</p>;
  if (!product) return <p className="py-24 text-center text-bloom-charcoal/50 font-display text-xl">Target product manifest record not found.</p>;

  // 🚀 HARD CODES ALIGNMENT SYNC METRICS WITH THE MODULAR DJANGO APP MODELS
  const isAvailable = product.stock_quantity > 0;
  const currentPrice = product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        
        {/* IMAGE COVER CONTAINER */}
        <div className="relative aspect-square overflow-hidden rounded-xl2 bg-bloom-blue/40 shadow-sm ring-1 ring-black/5">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-8xl">🍼</div>
          )}
        </div>

        {/* SPECIFICATIONS AND DATA PACK OVERVIEW PANEL */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bloom-pinkDark bg-white px-3 py-1.5 rounded-full shadow-sm ring-1 ring-black/5">
            {product.subcategory_name || 'Atelier Core Collection'}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-bloom-charcoal">{product.name}</h1>
          {product.brand && <p className="mt-1 text-sm text-bloom-charcoal/60">Designer Manufacturer: <strong>{product.brand}</strong></p>}

          <div className="mt-3 flex items-center gap-2">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-sm">{product.view_count > 0 ? `Popular (${product.view_count} matrix logs)` : 'Verified Fresh'}</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            {/* 🚀 THE FIXED PRICING LAYER TARGETING MAIN PRICE KEY */}
            <span className="font-display text-4xl font-bold text-bloom-pinkDark">
              ₹{Number(currentPrice).toFixed(0)}
            </span>
            {product.active_offer_percentage > 0 && (
              <span className="rounded-full bg-bloom-pink px-3 py-1 text-xs font-bold text-bloom-pinkDark">
                Save {product.active_offer_percentage}% Flash Deal
              </span>
            )}
          </div>

          {/* 📦 REAL TIME ACTIVE QUANTITY LIVE DATABASE READOUT */}
          <div className="mt-4 p-3 rounded-xl bg-bloom-cream/50 text-xs font-extrabold inline-block ring-1 ring-black/5">
            DATABASE INVENTORY STATUS: {isAvailable ? (
              <span className="text-green-600">{product.stock_quantity} PIECES ON HAND</span>
            ) : (
              <span className="text-red-500">OUT OF STOCK METRIC</span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-bloom-charcoal/80 text-sm whitespace-pre-line">{product.description}</p>

          {/* COUNTER CONTROLS & ADD PACK TO BASKET ACTIONS GRID */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border-2 border-bloom-blue bg-white">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))} 
                className="p-3 text-bloom-charcoal hover:text-bloom-pinkDark transition"
                disabled={!isAvailable}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-bold font-mono text-sm">{qty}</span>
              <button 
                onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))} 
                className="p-3 text-bloom-charcoal hover:text-bloom-pinkDark transition"
                disabled={!isAvailable || qty >= product.stock_quantity}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {/* 🚀 THE FIXED SUBMIT TERMINAL TRIGGER COMPATIBLE BUTTON */}
            <button
              onClick={() => add(product.id, qty)}
              disabled={!isAvailable}
              className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40 shadow-md gap-3"
            >
              <ShoppingBag className="h-5 w-5" />
              {isAvailable ? 'Add selection to basket array 🍼' : 'Out of Stock Allocation'}
            </button>
          </div>

          {/* LOGISTICS BENEFITS MODULE */}
          <div className="mt-8 flex flex-col gap-3 rounded-xl2 bg-bloom-mint/40 p-5 border border-bloom-mintDark/30">
            <div className="flex items-center gap-3 text-xs font-semibold text-bloom-charcoal/80">
              <Truck className="h-5 w-5 text-bloom-mintDark" /> Free express priority logistics on orders crossing ₹1,999
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-bloom-charcoal/80">
              <ShieldCheck className="h-5 w-5 text-bloom-mintDark" /> 100% safety certified non-toxic pediatric material standard checks passed
            </div>
          </div>
        </div>
      </div>

      {/* --- COMMUNITY DISPUTE/REVIEWS HISTORICAL ACCORDION PANEL --- */}
      <section className="mt-16 border-t border-bloom-pink/30 pt-10">
        <h2 className="font-display text-2xl font-bold text-bloom-charcoal mb-2">Customer Experience Archives</h2>
        <p className="text-xs text-bloom-charcoal/50 mb-6">Unedited community reviews submitted directly by verified consumer nodes.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <form onSubmit={submitReview} className="card p-6 bg-white space-y-4">
            <p className="font-display font-bold text-lg">Leave feedback</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setReviewRating(n)} className="transition transform active:scale-90">
                  <Star className={`h-6 w-6 ${n <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-bloom-charcoal/20'}`} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Describe product tracking features or clothing fabric texture scores..."
              className="input-field text-sm"
              rows={4}
              required
            />
            <button type="submit" className="btn-primary w-full text-sm py-2.5">Transmit Review Buffer</button>
          </form>

          <div className="md:col-span-2 space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {!product.reviews || product.reviews.length === 0 ? (
              <p className="text-sm text-bloom-charcoal/50 italic py-6 text-center card bg-white">No historical review logs generated for this element block yet.</p>
            ) : (
              product.reviews.map((r) => (
                <div key={r.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center justify-between">
                    <p className="font-display font-bold text-bloom-charcoal">{r.username || 'Anonymous Client'}</p>
                    <div className="flex items-center gap-1 text-sm font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r.rating} / 5
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-bloom-charcoal/70 leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}