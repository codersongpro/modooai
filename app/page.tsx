// S-01 첫 화면
import Link from "next/link";
import { KeyRound, BookOpen, ChevronRight } from "lucide-react";
import LevelScope from "@/components/LevelScope";

export default function Home() {
  return (
    <>
      <LevelScope />
      <section className="flex flex-1 flex-col justify-center gap-6 py-6">
        <div className="text-center">
          <h1 className="text-[2rem] font-extrabold leading-tight">AI, 처음부터 같이 배워요</h1>
          <p className="mt-2 text-muted">어린이부터 어르신까지 누구나 쓸 수 있어요.</p>
        </div>

        <div className="flex flex-col gap-4">
          <BigButton
            href="/join"
            icon={<KeyRound aria-hidden className="h-[1.6em] w-[1.6em]" />}
            title="수업 코드로 들어가기"
            sub="선생님이 알려 준 숫자 6개를 넣어요"
            primary
          />
          <BigButton
            href="/learn"
            icon={<BookOpen aria-hidden className="h-[1.6em] w-[1.6em]" />}
            title="혼자 배우기"
            sub="내게 맞는 단계를 골라 바로 시작해요"
          />
        </div>

        <p className="text-center">
          <Link href="/teacher" className="inline-flex min-h-12 items-center px-3 text-muted underline underline-offset-4">
            선생님 로그인
          </Link>
        </p>
      </section>
    </>
  );
}

function BigButton(props: { href: string; icon: React.ReactNode; title: string; sub: string; primary?: boolean }) {
  return (
    <Link
      href={props.href}
      className={`flex min-h-24 flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left shadow-sm transition sm:flex-row sm:items-center sm:gap-4 ${
        props.primary
          ? "border-primary bg-primary text-white hover:bg-primary-strong"
          : "border-line bg-surface text-ink hover:border-primary"
      }`}
    >
      <span className="shrink-0">{props.icon}</span>
      <span className="flex-1">
        <span className="block text-[1.25rem] font-bold">{props.title}</span>
        <span className={`block ${props.primary ? "text-white/90" : "text-muted"}`}>{props.sub}</span>
      </span>
      <ChevronRight aria-hidden className="hidden h-6 w-6 shrink-0 sm:block" />
    </Link>
  );
}
