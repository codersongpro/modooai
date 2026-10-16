// 아직 만들지 않은 화면에 잠시 보여 주는 안내
import Link from "next/link";
import { Construction } from "lucide-react";

export default function ComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <Construction aria-hidden className="h-14 w-14 text-muted" />
      <h1 className="text-[1.6rem] font-bold">{title}</h1>
      <p className="text-muted">{body}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/learn" className="flex min-h-touch items-center rounded-xl bg-primary px-6 font-bold text-white">
          혼자 배우기
        </Link>
        <Link href="/" className="flex min-h-touch items-center rounded-xl border-2 border-line bg-surface px-6 font-bold">
          처음으로
        </Link>
      </div>
    </section>
  );
}
