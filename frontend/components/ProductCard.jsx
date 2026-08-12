import React from 'react';
import { Heart, Star, Eye, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, isWishlisted, onToggleWishlist, onQuickView, onAddToCart }) {
  return (
    <div className="group relative bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50/50 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-bloom-cream mb-4">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Wishlist Heart */}
        <button 
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md text-gray-700 hover:text-rose-500 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            -{product.discount_percentage}%
          </span>
        )}

        {/* Quick View Overlay Button */}
        <button 
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5"/> Quick View
        </button>
      </div>

      {/* Product Details */}
      <div>
        <div className="flex items-center gap-1 mb-1 text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{product.rating || '4.8'}</span>
          <span className="text-gray-400 font-normal">({product.reviews_count || 12})</span>
        </div>

        <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1 group-hover:text-rose-500 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-extrabold text-gray-900">₹{product.discounted_price}</span>
          {product.original_price > product.discounted_price && (
            <span className="text-xs text-gray-400 line-through">₹{product.original_price}</span>
          )}
        </div>
      </div>

      {/* Add To Cart Button */}
      <button 
        onClick={() => onAddToCart(product)}
        className="w-full py-2.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
      >
        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
      </button>
    </div>
  );
}