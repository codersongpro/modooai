import Link from "next/link";
import FontSizeControl from "./FontSizeControl";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2">
        <Link href="/" className="flex min-h-12 items-center text-2xl font-extrabold tracking-tight text-primary">
          모두AI
        </Link>
        <FontSizeControl />
      </div>
    </header>
  );
}
