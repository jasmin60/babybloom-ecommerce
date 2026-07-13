'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [activeSpecification, setActiveSpecification] = useState('');

  if (!user) return <p className="py-24 text-center text-bloom-charcoal/60">Please sign in to checkout.</p>;
  if (cart.items.length === 0) return <p className="py-24 text-center text-bloom-charcoal/60">Your cart is empty.</p>;

  const fullAddressString = `${user.profile?.place || ''}, ${user.profile?.district || ''}, PIN: ${user.profile?.pincode || ''}`;
  const totalBasketValue = cart.items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  const shippingCharge = totalBasketValue >= 1999 ? 0 : 99;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderPayload = {
      shipping_address: fullAddressString,
      payment_method_selected: paymentMethod,
      subtotal_amount: totalBasketValue,
      shipping_charge: shippingCharge,
      total_amount: totalBasketValue + shippingCharge,
      items: cart.items.map(item => ({
        product: item.product.id,
        quantity: item.quantity
      }))
    };

    try {
      const { data } = await createOrder(orderPayload);
      await refreshCart();
      toast.success('Order placed successfully! 🎉 Stock counts synchronized.');
      router.push(`/orders`);
    } catch (err) {
      console.error(err.response?.data);
      toast.error('Could not process order manifest.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold">Checkout Hub</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
          
          <div className="rounded-xl2 bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="font-display text-xl font-bold text-bloom-pinkDark mb-3">Verified Delivery Address Vectors</h2>
            <p className="text-sm text-bloom-charcoal/80">👤 Consignee Identity: <strong>{user.username}</strong></p>
            <p className="text-sm text-bloom-charcoal/80 mt-1">📞 Contact phone: <strong>{user.profile?.phone_number || 'Not Configured'}</strong></p>
            <p className="text-sm text-bloom-charcoal/80 mt-1">📍 Destination Matrix: <strong>{fullAddressString}</strong></p>
            <p className="text-xs text-bloom-charcoal/40 mt-3 italic">Change these fields inside your My Account page dashboard.</p>
          </div>

          <h2 className="font-display text-xl font-bold">Protocol Payment Method</h2>
          <div className="space-y-2">
            {[
              { value: 'COD', label: 'Cash on Delivery (COD)' },
              { value: 'CARD', label: 'Credit / Debit Card Workspace Clearing' }
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 rounded-xl2 border-2 border-bloom-blue p-4 has-[:checked]:border-bloom-pinkDark cursor-pointer bg-white">
                <input
                  type="radio"
                  name="payment_method"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? 'Transmitting Manifest...' : `Authorize Dispatch · ₹${(totalBasketValue + shippingCharge).toFixed(0)}`}
          </button>
        </form>

        {/* --- RIGHT HAND ITEM OVERVIEW WITH DEFINITION DISPLAY TRUCK --- */}
        <div className="h-fit rounded-xl2 bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="font-display text-xl font-bold mb-4">Bag Manifest Summary</h2>
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center border-b border-bloom-blue/40 pb-3">
                <img src={item.product.image || 'https://placehold.co/80'} alt="" className="h-12 w-12 object-cover rounded-md" />
                <div className="flex-1 min-w-0">
                  {/* Click name to display definition specification popup below */}
                  <button 
                    type="button"
                    onClick={() => setActiveSpecification(item.product.description)}
                    className="text-sm font-semibold truncate hover:text-bloom-pinkDark block text-left w-full underline"
                  >
                    {item.product.name}
                  </button>
                  <p className="text-xs text-bloom-charcoal/60">Qty: {item.quantity} · ₹{item.product.price}</p>
                </div>
              </div>
            ))}
          </div>

          {activeSpecification && (
            <div className="mt-4 bg-amber-50 border border-amber-300 p-4 rounded-xl text-xs text-bloom-charcoal/90">
              <strong>📜 Product Specifications Archive:</strong>
              <p className="mt-1">{activeSpecification}</p>
            </div>
          )}

          <div className="mt-6 flex justify-between border-t border-bloom-blue pt-4 font-display font-bold">
            <span>Total Bill</span>
            <span>₹{(totalBasketValue + shippingCharge).toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}