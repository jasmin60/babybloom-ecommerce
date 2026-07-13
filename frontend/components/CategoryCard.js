import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="card flex flex-col items-center gap-3 p-6 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bloom-mint text-3xl">
        {category.icon || '🍼'}
      </div>
      <div>
        <p className="font-display font-semibold">{category.name}</p>
        <p className="text-xs text-bloom-charcoal/50">{category.product_count} items</p>
      </div>
    </Link>
  );
}
