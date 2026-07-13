'use client';

import { useEffect, useState } from 'react';

export default function WelcomeBannerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const shouldGreet = localStorage.getItem('trigger_welcome_popup');
    const storedName = localStorage.getItem('username');
    
    if (shouldGreet === 'true') {
      setUsername(storedName || 'Valued Partner');
      setIsOpen(true);
      // Clean up flag immediately so it doesn't loop popups on basic home clicks
      localStorage.removeItem('trigger_welcome_popup');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bloom-charcoal/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#FFF8F0] p-8 shadow-2xl border-4 border-bloom-pinkDark text-center animate-in fade-in zoom-in duration-300">
        <div className="text-6xl mb-4">👋🌸</div>
        <h2 className="font-display text-3xl font-extrabold text-bloom-charcoal">
          Welcome back, {username}!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-bloom-charcoal/70">
          Your profile metrics, customized delivery tokens, and catalog synchronization layers are fully initialized.
        </p>
        <button 
          onClick={() => setIsOpen(false)}
          className="mt-6 w-full rounded-full bg-bloom-pinkDark px-6 py-3 font-display font-bold text-white shadow-md hover:brightness-105 transition active:scale-95"
        >
          Enter Shop Dashboard
        </button>
      </div>
    </div>
  );
}