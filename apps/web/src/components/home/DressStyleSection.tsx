import Image from "next/image";
import { HOME_ASSETS } from "./assets";

export default function DressStyleSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-12 pt-12 sm:px-5">
      <div className="rounded-3xl bg-zinc-100 px-6 pb-6 pt-10 sm:px-8">
        <h2 className="mb-4 text-center text-[28px] font-bold leading-[34px] text-black font-[var(--font-integral)] sm:mb-6 sm:text-[48px] sm:leading-[58px]">
          BROWSE BY DRESS STYLE
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white">
            <Image src={HOME_ASSETS.dress.causal} alt="Casual" fill className="object-cover scale-x-[-1]" />
            <div className="absolute left-4 top-4 text-xl font-semibold">Casual</div>
          </div>
          <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white">
            <Image src={HOME_ASSETS.dress.formal} alt="Formal" fill className="object-cover" />
            <div className="absolute left-4 top-4 text-xl font-semibold">Formal</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
          <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white">
            <Image src={HOME_ASSETS.dress.party} alt="Party" fill className="object-cover" />
            <div className="absolute left-4 top-4 text-xl font-semibold">Party</div>
          </div>
          <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white">
            <Image src={HOME_ASSETS.dress.gym} alt="Gym" fill className="object-cover" />
            <div className="absolute left-4 top-4 text-xl font-semibold">Gym</div>
          </div>
        </div>
      </div>
    </section>
  );
}
