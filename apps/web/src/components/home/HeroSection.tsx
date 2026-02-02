import Image from "next/image";
import Link from "next/link";
import { HOME_ASSETS } from "./assets";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#F2F0F1]">
      <Image
        src={HOME_ASSETS.star}
        alt=""
        width={56}
        height={56}
        className="absolute left-[18%] top-[72%] sm:left-[52.08%] sm:top-[30.5%]"
        aria-hidden
      />
      <Image
        src={HOME_ASSETS.star}
        alt=""
        width={104}
        height={104}
        className="absolute left-[68%] top-[62%] sm:left-[82%] sm:top-[15.03%]"
        aria-hidden
      />
      <div className="mx-auto grid min-h-[663px] max-w-[1200px] grid-cols-1 items-center gap-6 px-4 sm:px-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-0">
        <div className="pl-4 pr-4 py-8 sm:pl-6 sm:pr-6 lg:pl-[72px] lg:pr-6 lg:py-12">
          <h1
            className="max-w-[315px] text-[36px] font-extrabold leading-[34px] text-black font-[var(--font-integral)] sm:max-w-[600px] sm:text-[48px] sm:leading-[52px] lg:text-[64px] lg:leading-[64px]"
          >
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>

          <p
            className="mt-4 max-w-[600px] text-[14px] leading-[20px] text-black/60 font-[var(--font-satoshi)] sm:mt-6 sm:text-[16px] sm:leading-[22px]"
          >
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          <Link
            href="/category"
            className="mt-6 inline-flex w-full max-w-[358px] items-center justify-center rounded-[62px] bg-black px-8 py-3 text-sm text-white font-[var(--font-satoshi)] mx-auto sm:mx-0 sm:mt-8 sm:w-auto sm:px-12 sm:py-4"
          >
            Shop Now
          </Link>

          <div className="mt-6 grid max-w-[545px] grid-cols-2 gap-4 text-center sm:mt-10 sm:grid-cols-3 sm:gap-6 sm:text-left">
            <div>
              <div className="text-lg font-bold sm:text-2xl">200+</div>
              <div className="text-[11px] text-black/60 sm:text-sm">
                International Brands
              </div>
            </div>
            <div>
              <div className="text-lg font-bold sm:text-2xl">2,000+</div>
              <div className="text-[11px] text-black/60 sm:text-sm">
                High-Quality Products
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-lg font-bold sm:text-2xl">30,000+</div>
              <div className="text-[11px] text-black/60 sm:text-sm">
                Happy Customers
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center pr-0 lg:justify-end lg:pr-[40px]">
          <div className="relative h-[300px] w-[300px] sm:h-[360px] sm:w-[360px] lg:h-[560px] lg:w-[520px]">
            <Image
              src={HOME_ASSETS.hero}
              alt="Hero"
              fill
              sizes="(min-width:1024px) 520px, (min-width:640px) 420px, 320px"
              className="object-contain object-[55%_100%]"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none">
        <Image
          src={HOME_ASSETS.star}
          alt=""
          width={40}
          height={40}
          className="absolute hidden lg:block left-[72%] top-[310px]"
          aria-hidden
        />
      </div>
    </section>
  );
}
