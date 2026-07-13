import Link from 'next/link';
import { Sprout, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 bg-bloom-charcoal text-bloom-cream/90">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 font-display text-xl font-extrabold text-white">
            <Sprout className="h-6 w-6 text-bloom-mintDark" />
            Baby Bloom
          </div>
          <p className="mt-3 text-sm text-bloom-cream/60">
            Gentle, safe, and joyful essentials for your little one's every stage.
          </p>
          <div className="mt-4 flex gap-3">
            <Instagram className="h-5 w-5 opacity-70 hover:opacity-100" />
            <Facebook className="h-5 w-5 opacity-70 hover:opacity-100" />
            <Twitter className="h-5 w-5 opacity-70 hover:opacity-100" />
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-white">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-bloom-cream/60">
            <li><Link href="/products">All Products</Link></li>
            <li><Link href="/products?is_featured=true">Featured</Link></li>
            <li><Link href="/products">Categories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-bloom-cream/60">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-bloom-cream/60">
            <li><Link href="/login">Sign in</Link></li>
            <li><Link href="/orders">My Orders</Link></li>
            <li><Link href="/cart">My Cart</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-bloom-cream/40">
        © {new Date().getFullYear()} Baby Bloom. Made with 💕 for growing families.
      </div>
    </footer>
  );
}
