import Image from "next/image";
import { HOME_ASSETS } from "./assets";

export default function BrandStrip() {
  return (
    <section className="bg-black py-4">
      <div className="mx-auto max-w-[1200px] flex flex-wrap items-center justify-center gap-4 px-4 sm:flex-nowrap sm:justify-between sm:gap-6 sm:px-5">
        <Image
          src={HOME_ASSETS.brands.versace}
          alt="versace"
          width={110}
          height={26}
          className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]"
        />
        <Image
          src={HOME_ASSETS.brands.zara}
          alt="zara"
          width={110}
          height={26}
          className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]"
        />
        <Image
          src={HOME_ASSETS.brands.gucci}
          alt="gucci"
          width={110}
          height={26}
          className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]"
        />
        <Image
          src={HOME_ASSETS.brands.prada}
          alt="prada"
          width={110}
          height={26}
          className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]"
        />
        <Image
          src={HOME_ASSETS.brands.calvin}
          alt="calvin"
          width={110}
          height={26}
          className="h-[26px] w-[110px] object-contain sm:h-[32px] sm:w-[140px]"
        />
      </div>
    </section>
  );
}
