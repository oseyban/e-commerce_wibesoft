import Image from "next/image";
import Link from "next/link";

const ASSETS = {
  logo: "/images/logo.png",
  cart: "/images/cart.png",
  profile: "/images/profile.png",
};

export default function Header() {
  return (
    <>
      <div className="bg-black text-white">
        <div className="mx-auto max-w-[1200px] px-4 py-2 text-center text-xs sm:px-5">
          Sign up and get 20% off to your first order. <span className="underline">Sign Up Now</span>
        </div>
      </div>

      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <button type="button" className="inline-flex items-center lg:hidden" aria-label="Open menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <Link href="/" className="inline-flex items-center">
              <Image src={ASSETS.logo} alt="Shop.co" width={140} height={22} unoptimized priority />
            </Link>

            <nav className="hidden lg:flex items-center gap-5 text-[16px] leading-[22px] whitespace-nowrap">
              <Link className="text-sm" href="/shop">Shop</Link>
              <Link className="text-sm" href="/onsale">On Sale</Link>
              <Link className="text-sm" href="/new-arrivals">New Arrivals</Link>
              <Link className="text-sm" href="/brands">Brands</Link>
            </nav>
          </div>

          <div className="hidden lg:flex flex-1 justify-center">
            <div className="relative w-full max-w-[560px]">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 21l-4.35-4.35m1.6-4.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full rounded-full border border-zinc-200 bg-zinc-100 py-2.5 pl-9 pr-4 text-sm outline-none"
                aria-label="Search products"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button type="button" className="inline-flex items-center lg:hidden" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 21l-4.35-4.35m1.6-4.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <Image src={ASSETS.cart} alt="cart" width={24} height={24} unoptimized />
            <Image src={ASSETS.profile} alt="profile" width={24} height={24} unoptimized />
          </div>
        </div>
      </header>
    </>
  );
}
