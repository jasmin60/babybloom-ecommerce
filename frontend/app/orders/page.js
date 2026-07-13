'use client';

import { useEffect, useState } from 'react';
import { getOrders } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getOrders()
        .then(({ data }) => setOrders(data))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return <p className="py-24 text-center text-bloom-charcoal/60">Please sign in to view your logs.</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold mb-2">Verified Purchase Ledger</h1>
      <p className="text-sm text-bloom-charcoal/60 mb-8">Historical records extracted from backend dispatch lines.</p>

      {loading ? (
        <p className="text-center py-10 text-bloom-charcoal/60">Extracting log buffers...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 card bg-white">
          <Package className="mx-auto h-12 w-12 text-bloom-charcoal/40" />
          <p className="mt-2 text-bloom-charcoal/60">No prior checkout manifests initialized.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex justify-between border-b pb-3 items-center">
                <div>
                  <p className="font-display font-bold text-lg">Allocation Token: #{order.id}</p>
                  <p className="text-xs text-bloom-charcoal/40">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-bold uppercase">
                  {order.order_status}
                </span>
              </div>
              
              <p className="text-xs text-bloom-charcoal/70 mt-3">📍 <strong>Target Destination Matrix Address:</strong> {order.shipping_address}</p>
              
              <div className="mt-4 bg-bloom-cream p-4 rounded-xl space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>• {item.product_name} <span className="text-bloom-charcoal/50">× {item.quantity}</span></span>
                    <strong className="font-mono">₹{item.unit_price}</strong>
                  </div>
                ))}
              </div>

              <div className="text-right mt-4 pt-3 border-t border-dashed font-display font-bold text-lg text-bloom-pinkDark">
                Total Disbursed: ₹{order.total_amount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}