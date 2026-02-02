import Link from "next/link";

type BreadcrumbsProps = {
  category?: string | null;
};

export default function Breadcrumbs({ category }: BreadcrumbsProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-4 text-xs text-zinc-500 sm:px-5">
      <nav className="flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/product" className="hover:underline">
          Shop
        </Link>
        <span>/</span>
        <span>Men</span>
        <span>/</span>
        <span>{category || "T-shirt"}</span>
      </nav>
    </div>
  );
}
