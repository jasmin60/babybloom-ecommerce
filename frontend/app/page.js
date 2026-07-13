import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import { getCategories } from '@/lib/api';
import { Truck, ShieldCheck, Heart } from 'lucide-react';
import WelcomeBannerModal from '@/components/WelcomeBannerModal';

async function fetchHomeCategories() {
  try {
    const res = await getCategories();
    return res.data.results || res.data;
  } catch (err) {
    return [];
  }
}

export default async function HomePage() {
  const categories = await fetchHomeCategories();

  return (
    <div>
      {/* 🔮 Active state greeting hook client side controller */}
      <WelcomeBannerModal />

      <Hero />

      {/* 🚚 Logistics trust cards layer */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl2 bg-white p-5 shadow-sm ring-1 ring-black/5">
            <Truck className="h-8 w-8 text-bloom-pinkDark" />
            <div>
              <p className="font-display font-semibold">Free shipping</p>
              <p className="text-sm text-bloom-charcoal/60">On orders over ₹1999</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl2 bg-white p-5 shadow-sm ring-1 ring-black/5">
            <ShieldCheck className="h-8 w-8 text-bloom-mintDark" />
            <div>
              <p className="font-display font-semibold">Safety tested</p>
              <p className="text-sm text-bloom-charcoal/60">Every product, every time</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl2 bg-white p-5 shadow-sm ring-1 ring-black/5">
            <Heart className="h-8 w-8 text-bloom-blueDark" />
            <div>
              <p className="font-display font-semibold">Parent-loved</p>
              <p className="text-sm text-bloom-charcoal/60">Curated by real families</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📁 Core Categories grid layer */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-16">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Shop by category</h2>
          <p className="text-sm text-bloom-charcoal/50 mt-1">Select a catalog profile to map workspace items.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
          {categories.length === 0 && (
            <p className="col-span-full text-bloom-charcoal/50 text-center py-6">
              No categories mapped yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}