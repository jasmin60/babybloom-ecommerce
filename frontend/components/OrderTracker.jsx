import React from 'react';
import { CheckCircle2, Package, Truck, Clock, Home } from 'lucide-react';

const STEPS = [
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'PACKED', label: 'Packed', icon: Package },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Clock },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
];

export default function OrderTracker({ currentStatus }) {
  const activeIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="w-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm my-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
        Order Progress Tracker
      </h3>
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 w-full z-0" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-rose-400 z-0 transition-all duration-500"
          style={{ width: `${Math.max(0, (activeIndex / (STEPS.length - 1)) * 100)}%` }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isPassed = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isPassed 
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200' 
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-rose-100 scale-110' : ''}`}
              >
                <Icon className="w-4 h-4"/>
              </div>
              <span className={`text-[11px] mt-2 font-medium ${isPassed ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}