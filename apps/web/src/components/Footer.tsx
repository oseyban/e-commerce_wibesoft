import Image from "next/image";

const ASSETS = {
  logo: "/images/logo.png",
  social: "/images/Social.png",
  finance: "/images/finance.png",
};

export default function Footer() {
  return (
    <footer className="bg-zinc-100">
      <div className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-5">
        <div className="py-10">
          <div className="rounded-3xl bg-black px-8 py-8 text-white flex flex-col gap-4 sm:flex-row items-center justify-between">
            <div className="max-w-md">
              <h3 className="text-2xl font-extrabold leading-tight">
                <span className="block">STAY UPTO DATE ABOUT</span>
                <span className="block">OUR LATEST OFFERS</span>
              </h3>
            </div>
            <div className="flex w-full max-w-[360px] flex-col gap-3">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                <input placeholder="Enter your email address" className="w-full rounded-full bg-white px-10 py-3 text-sm text-zinc-900" />
              </div>
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900">Subscribe to Newsletter</button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Image src={ASSETS.logo} alt="Shop.co" width={140} height={22} />
            <p className="mt-3 text-xs text-zinc-600">
              We have clothes that suits your style and which you’re proud to wear. From women to men.
            </p>
            <div className="mt-4">
              <Image src={ASSETS.social} alt="Social icons" width={120} height={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:contents">
            <div>
              <div className="mb-2 text-xs font-semibold tracking-widest text-zinc-700">COMPANY</div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li>About</li><li>Features</li><li>Works</li><li>Career</li>
              </ul>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold tracking-widest text-zinc-700">HELP</div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li>Customer Support</li><li>Delivery Details</li><li>Terms & Conditions</li><li>Privacy Policy</li>
              </ul>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold tracking-widest text-zinc-700">FAQ</div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li>Account</li><li>Manage Deliveries</li><li>Orders</li><li>Payments</li>
              </ul>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold tracking-widest text-zinc-700">RESOURCES</div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li>Free eBooks</li><li>Development Tutorial</li><li>How to - Blog</li><li>Youtube Playlist</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-4 text-xs text-zinc-500">
          <span>Shop.co © 2000-2023, All Rights Reserved</span>
          <Image src={ASSETS.finance} alt="Payment methods" width={260} height={32} />
        </div>
      </div>
    </footer>
  );
}
