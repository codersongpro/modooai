"use client";
// 단원 카드 목록. 기기에 저장한 진도로 "다 했어요", "이어서 하기"를 보여 준다.
import Link from "next/link";
import { CircleCheck, Lock, Play } from "lucide-react";
import { unitKey, useProgress } from "@/lib/storage";
import { STEP_LABELS } from "@/lib/content-types";
import type { Level } from "@/lib/levels";

type Item = { unit: number; title: string; ready: boolean };

export default function UnitList({ level, units }: { level: Level; units: Item[] }) {
  const store = useProgress();

  return (
    <ol className="flex flex-col gap-4">
      {units.map(({ unit, title, ready }) => {
        const p = store?.units[unitKey(level, unit)];
        const started = p && !p.completed && (p.step > 0 || p.done.length > 0);

        const inner = (
          <>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[1.3rem] font-extrabold text-primary">
              {unit}
            </span>
            <span className="flex-1">
              <span className="block text-[1.25rem] font-bold">{title}</span>
              {!ready && <span className="block text-muted">준비 중이에요</span>}
              {ready && p?.completed && (
                <span className="flex items-center gap-1 font-semibold text-ok">
                  <CircleCheck aria-hidden className="h-5 w-5" /> 다 했어요
                  {p.quiz && ` · 퀴즈 ${p.quiz.score}/${p.quiz.total}`}
                </span>
              )}
              {ready && started && (
                <span className="block text-primary-strong">
                  {p.step + 1}/5단계 {STEP_LABELS[p.step]}까지 했어요
                </span>
              )}
            </span>
            {!ready && <Lock aria-hidden className="h-6 w-6 shrink-0 text-muted" />}
            {ready && started && (
              <span className="flex shrink-0 items-center gap-1 rounded-xl bg-primary px-3 py-2 font-bold text-white">
                <Play aria-hidden className="h-5 w-5" /> 이어서 하기
              </span>
            )}
          </>
        );

        return (
          <li key={unit}>
            {ready ? (
              <Link
                href={`/learn/${level}/${unit}`}
                className="flex min-h-24 flex-wrap items-center gap-4 rounded-2xl border-2 border-line bg-surface p-4 shadow-sm transition hover:border-primary"
              >
                {inner}
              </Link>
            ) : (
              <div
                aria-disabled
                className="flex min-h-24 items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-bg p-4 opacity-80"
              >
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
