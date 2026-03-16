import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="border-b border-slate-200 bg-primary text-white">
      <div className="container-shell flex flex-col items-center justify-between gap-2 py-3 text-center text-sm md:flex-row md:text-left">
        <p>Free shipping above Rs 999. COD and secure online payments available across India.</p>
        <Link href="/shop?sort=popularity" className="font-semibold text-cyan-200">
          Explore top-rated gadgets
        </Link>
      </div>
    </div>
  );
}

