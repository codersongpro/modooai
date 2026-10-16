// S-03 수준 선택 (혼자 배우기)
import Link from "next/link";
import LevelScope from "@/components/LevelScope";
import ResumeCard from "@/components/ResumeCard";
import { LEVELS, LEVEL_INFO } from "@/lib/levels";
import { AppIcon } from "@/lib/icons";

export default function LearnPage() {
  return (
    <>
      <LevelScope />
      <ResumeCard />
      <h1 className="mb-4 text-[1.6rem] font-bold">누가 배우나요?</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {LEVELS.map((code) => {
          const info = LEVEL_INFO[code];
          return (
            <li key={code}>
              <Link
                href={`/learn/${code}`}
                className="flex h-full min-h-28 items-center gap-4 rounded-2xl border-2 border-line bg-surface p-5 shadow-sm transition hover:border-primary"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <AppIcon name={info.icon} className="h-9 w-9" />
                </span>
                <span>
                  <span className="block text-[1.3rem] font-bold">{info.name}</span>
                  <span className="block text-muted">{info.short}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
