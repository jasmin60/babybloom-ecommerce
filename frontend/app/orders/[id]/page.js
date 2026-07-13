'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrder } from '@/lib/api';
import { CheckCircle2 } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then(({ data }) => setOrder(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="py-24 text-center text-bloom-charcoal/60">Loading order...</p>;
  if (!order) return <p className="py-24 text-center text-bloom-charcoal/60">Order not found.</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 rounded-xl2 bg-bloom-mint/50 p-5">
        <CheckCircle2 className="h-8 w-8 text-bloom-mintDark" />
        <div>
          <p className="font-display font-bold">Thank you for your order!</p>
          <p className="text-sm text-bloom-charcoal/70">Order #{order.id} has been placed successfully.</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Order details</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display font-semibold">Shipping address</h2>
          <p className="mt-2 text-sm text-bloom-charcoal/70">
            {order.full_name}<br />
            {order.address_line}<br />
            {order.city}, {order.state} {order.postal_code}<br />
            {order.country}<br />
            {order.phone}
          </p>
        </div>
        <div>
          <h2 className="font-display font-semibold">Payment</h2>
          <p className="mt-2 text-sm capitalize text-bloom-charcoal/70">{order.payment_method}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display font-semibold">Items</h2>
        <div className="mt-3 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between rounded-xl2 bg-white p-4 shadow-sm ring-1 ring-black/5">
              <span>{item.product_name} × {item.quantity}</span>
              <span className="font-semibold">₹{Number(item.subtotal).toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-1 rounded-xl2 bg-white p-5 shadow-sm ring-1 ring-black/5">
        <div className="flex justify-between text-sm text-bloom-charcoal/70">
          <span>Subtotal</span><span>₹{Number(order.subtotal).toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-sm text-bloom-charcoal/70">
          <span>Shipping</span><span>{Number(order.shipping_fee) === 0 ? 'Free' : `₹${order.shipping_fee}`}</span>
        </div>
        <div className="flex justify-between border-t border-bloom-blue pt-2 font-display font-bold">
          <span>Total</span><span>₹{Number(order.total).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
