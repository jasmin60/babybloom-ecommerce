'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, User, Menu, X, Search, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#EBE5DF] bg-[#FBF9F6]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* LOGO LINK */}
        <Link href="/" className="font-display text-2xl font-bold uppercase tracking-wider text-[#1E1A19] hover:opacity-80 transition">
          Baby Bloom<span className="text-[#A37B73]">.</span>
        </Link>

        {/* INTEGRATED ARCHITECTURAL SEARCH STRIP */}
        <form onSubmit={handleSearchSubmit} className="hidden flex-1 max-w-sm items-center md:flex mx-8">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search catalog collections..."
              className="w-full border border-[#C8BDB3] bg-white py-2 pl-9 pr-4 text-xs outline-none focus:border-[#1E1A19] transition-colors duration-300"
            />
          </div>
        </form>

        {/* CORE LINKS NAV */}
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#1E1A19]/80 md:flex">
          <Link href="/products" className="hover:text-[#A37B73] transition">Catalog</Link>
          <Link href="/about" className="hover:text-[#A37B73] transition">Our Story</Link>
          <Link href="/contact" className="hover:text-[#A37B73] transition">Contact</Link>
        </nav>

        {/* ACTION BUTTON UTILITIES TRACK */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden items-center gap-4 md:flex text-xs font-bold uppercase tracking-widest">
              <Link href="/account" className="flex items-center gap-1.5 hover:text-[#A37B73] transition">
                <User className="h-4 w-4" /> Account
              </Link>
              <button onClick={logout} className="text-neutral-400 hover:text-[#1E1A19] transition">
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden items-center gap-1.5 text-xs font-bold uppercase tracking-widest hover:text-[#A37B73] transition md:flex">
              <User className="h-4 w-4" /> Sign In
            </Link>
          )}

          {/* MINIMALIST SHOPPING BAG ICON */}
          <Link href="/cart" className="relative p-2 border border-[#EBE5DF] bg-white hover:border-[#1E1A19] transition duration-300">
            <ShoppingBag className="h-4 w-4 text-[#1E1A19]" />
            {cart.total_items > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-[#1E1A19] text-[9px] font-bold text-white tracking-none">
                {cart.total_items}
              </span>
            )}
          </Link>

          {/* MOBILE BURGER LINK TOGGLE BUTTON */}
          <button className="p-2 md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE COLLAPSED ACCORDION MENU CHANNEL OVERLAYS */}
      {open && (
        <div className="border-t border-[#EBE5DF] bg-white px-4 py-6 space-y-4 md:hidden text-sm uppercase tracking-wider font-bold">
          <form onSubmit={handleSearchSubmit}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full border p-2.5 text-xs outline-none"
            />
          </form>
          <div className="flex flex-col gap-4 pl-1">
            <Link href="/products" onClick={() => setOpen(false)}>Catalog</Link>
            <Link href="/about" onClick={() => setOpen(false)}>Our Story</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            {user ? (
              <>
                <Link href="/account" onClick={() => setOpen(false)}>My Account</Link>
                <button onClick={logout} className="text-left text-neutral-400">Sign Out</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}