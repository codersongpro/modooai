"use client";
// 마지막으로 보던 단원이 있으면 "이어서 하기"를 먼저 보여 준다.
import Link from "next/link";
import { Play } from "lucide-react";
import { useProgress } from "@/lib/storage";
import { LEVEL_INFO, UNIT_TITLES, isLevel } from "@/lib/levels";
import { STEP_LABELS } from "@/lib/content-types";

export default function ResumeCard() {
  const store = useProgress();
  if (!store?.last) return null;
  const p = store.units[store.last];
  const [level, unitStr] = store.last.split("-");
  const unit = Number(unitStr);
  if (!p || p.completed || !isLevel(level) || !UNIT_TITLES[unit - 1]) return null;

  return (
    <Link
      href={`/learn/${level}/${unit}`}
      className="mb-6 flex items-center gap-4 rounded-2xl border-2 border-primary bg-primary-soft p-5 transition hover:bg-white"
    >
      <Play aria-hidden className="h-9 w-9 shrink-0 text-primary" />
      <span className="flex-1">
        <span className="block text-[1.3rem] font-bold text-primary-strong">이어서 하기</span>
        <span className="block">
          {LEVEL_INFO[level].name} · {unit}단원 {UNIT_TITLES[unit - 1]} · {STEP_LABELS[p.step]}
        </span>
      </span>
    </Link>
  );
}
