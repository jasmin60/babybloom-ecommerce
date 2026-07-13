'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-bloom-pinkDark" />
        <h1 className="mt-4 font-display text-2xl font-bold">Sign in to view your cart</h1>
        <p className="mt-2 text-bloom-charcoal/60">Your cart items are saved to your account.</p>
        <Link href="/login" className="btn-primary mt-6 inline-flex">Sign in</Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-bloom-pinkDark" />
        <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-bloom-charcoal/60">Let's find something lovely for your little one.</p>
        <Link href="/products" className="btn-primary mt-6 inline-flex">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold">Your cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-xl2 bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-bloom-blue/40">
                {item.product.image ? (
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl">🍼</div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <Link href={`/products/${item.product.slug}`} className="font-display font-semibold hover:text-bloom-pinkDark">
                    {item.product.name}
                  </Link>
                  <button onClick={() => removeItem(item.id)} className="text-bloom-charcoal/40 hover:text-bloom-pinkDark">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border-2 border-bloom-blue">
                    <button onClick={() => updateItem(item.id, item.quantity - 1)} className="p-2"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)} className="p-2"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <span className="font-display font-bold text-bloom-pinkDark">₹{Number(item.subtotal).toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl2 bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm text-bloom-charcoal/70">
            <span>Items ({cart.total_items})</span>
            <span>₹{Number(cart.total_price).toFixed(0)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-bloom-charcoal/70">
            <span>Shipping</span>
            <span>{cart.total_price >= 1999 ? 'Free' : '₹99'}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-bloom-blue pt-4 font-display font-bold">
            <span>Total</span>
            <span>₹{(Number(cart.total_price) + (cart.total_price >= 1999 ? 0 : 99)).toFixed(0)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">Proceed to checkout</Link>
        </div>
      </div>
    </div>
  );
}
