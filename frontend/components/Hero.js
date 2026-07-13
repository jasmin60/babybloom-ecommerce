import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F5F2EE] border-b border-[#EBE5DF]">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-20 sm:px-6 md:flex-row lg:px-8 lg:py-28">
        
        {/* TEXT COLUMN MANIFEST ENTRY POINT */}
        <div className="max-w-xl text-center md:text-left">
          <span className="inline-block font-sans text-[10px] font-bold uppercase tracking-widest text-[#A37B73] border-b-2 border-[#A37B73] pb-1 mb-4">
            The Atelier Spring Curation 🍂
          </span>
          <h1 className="mt-2 font-display text-4xl font-light leading-tight text-[#1E1A19] sm:text-5xl lg:text-6xl">
            Gentle essentials, <br />
            <span className="italic font-normal text-[#A37B73]">crafted to endure.</span>
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-[#1E1A19]/70 max-w-md font-light">
            From the softest morning layers to organic nursery textiles, our products are thoughtfully curated by families, for families.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 md:justify-start">
            <Link href="/products" className="btn-primary">Explore Curation</Link>
            <Link href="/products" className="btn-secondary">View Lookbook</Link>
          </div>
        </div>

        {/* RIGHT EDITORIAL ASYMMETRICAL DISPLAY STAMP BLOCK */}
        <div className="relative flex h-72 w-72 items-center justify-center bg-white border border-[#EBE5DF] shadow-[0_30px_60px_rgba(0,0,0,0.03)] md:h-96 md:w-96">
          <div className="text-center">
            <span className="block text-7xl mb-2">🍼</span>
            <span className="block font-sans text-[9px] font-bold uppercase tracking-widest text-neutral-400">Aesthetic Registry Sync</span>
          </div>
          <span className="absolute top-6 left-6 text-2xl opacity-40">⭐</span>
          <span className="absolute bottom-6 right-6 text-2xl opacity-30">✨</span>
        </div>

      </div>
    </section>
  );
}