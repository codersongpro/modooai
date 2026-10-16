"use client";
// 한 단원을 5단계로 진행한다. 단계를 마칠 때마다 기기에 진도를 저장한다.
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { UnitContent } from "@/lib/content-types";
import { saveUnitProgress, storageAvailable, unitKey, useProgress } from "@/lib/storage";
import ProgressBar from "./ProgressBar";
import IntroView from "./IntroView";
import ExplainView from "./ExplainView";
import CardsPracticeView from "./CardsPracticeView";
import BlocksPracticeView from "./BlocksPracticeView";
import ChatPracticeView from "./ChatPracticeView";
import QuizView from "./QuizView";
import WrapView from "./WrapView";

// "진도가 저장되지 않아요" 안내는 한 번만
let storageNoticeClosed = false;

export default function UnitPlayer({ content, nextReady }: { content: UnitContent; nextReady: boolean }) {
  const { level, unit, steps } = content;
  const key = unitKey(level, unit);
  const listHref = `/learn/${level}`;

  const store = useProgress(); // 서버에서는 null
  const saved = store?.units[key];

  // 처음에는 저장된 단계에서 시작하고, 움직이면 그 값을 쓴다
  const [stepState, setStepState] = useState<number | null>(null);
  const step = stepState ?? (store ? (saved && !saved.completed ? saved.step : 0) : null);

  const [card, setCard] = useState(0); // 알아보기 카드 번호
  const [quizIdx, setQuizIdx] = useState(0);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [noticeClosed, setNoticeClosed] = useState(storageNoticeClosed);

  if (step === null) {
    return <div className="flex-1 animate-pulse rounded-2xl bg-line/40" aria-label="불러오는 중" />;
  }

  const explain = steps[1];
  const practice = steps[2];
  const quiz = steps[3];
  const fallback = content.fallbackAnswers["기본"];
  const score = quiz.items.filter((it, i) => picks[i] === it.answer).length;

  function goTo(n: number, extra?: { quiz?: { score: number; total: number } }) {
    const done = new Set(saved?.done ?? []);
    if (n > step!) for (let i = step!; i < n; i++) done.add(i);
    if (n === 4) done.add(4); // 정리 단계에 오면 단원을 마친 것으로 본다
    saveUnitProgress(key, {
      step: n,
      done: [...done].sort(),
      completed: n === 4 || saved?.completed === true,
      ...(extra?.quiz ? { quiz: extra.quiz } : {}),
    });
    setStepState(n);
    window.scrollTo({ top: 0 });
  }

  function next() {
    if (step === 1 && card < explain.cards.length - 1) return setCard(card + 1);
    if (step === 3) {
      if (!checked[quizIdx]) return setChecked({ ...checked, [quizIdx]: true });
      if (quizIdx < quiz.items.length - 1) return setQuizIdx(quizIdx + 1);
      return goTo(4, { quiz: { score, total: quiz.items.length } });
    }
    if (step === 1) setCard(0);
    goTo(step! + 1);
  }

  function prev() {
    if (step === 1 && card > 0) return setCard(card - 1);
    if (step === 3 && quizIdx > 0) return setQuizIdx(quizIdx - 1);
    if (step === 2) setCard(explain.cards.length - 1);
    goTo(step! - 1);
  }

  // 아래 버튼 글자
  let nextLabel = "다음";
  let nextDisabled = false;
  if (step === 3) {
    if (picks[quizIdx] === undefined) {
      nextLabel = "답을 골라요";
      nextDisabled = true;
    } else if (!checked[quizIdx]) nextLabel = "정답 확인";
    else if (quizIdx < quiz.items.length - 1) nextLabel = "다음 문제";
  }

  const showNotice = !noticeClosed && !storageAvailable();
  const isFirst = step === 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex flex-col gap-3">
        <Link href={listHref} className="inline-flex min-h-touch items-center gap-1 self-start font-semibold text-muted">
          <ChevronLeft aria-hidden className="h-5 w-5" /> 단원 목록
        </Link>
        <h1 className="text-[1.25rem] font-bold">
          {unit}단원 {content.title}
        </h1>
        <ProgressBar step={step} />
      </div>

      {showNotice && (
        <div role="status" className="mb-4 flex items-start gap-2 rounded-xl bg-warn-soft p-3 text-warn-text">
          <p className="flex-1 font-semibold">이 기기에는 진도가 저장되지 않아요. 배우기는 그대로 할 수 있어요.</p>
          <button
            type="button"
            aria-label="안내 닫기"
            className="flex h-12 w-12 shrink-0 items-center justify-center"
            onClick={() => {
              storageNoticeClosed = true;
              setNoticeClosed(true);
            }}
          >
            <X aria-hidden className="h-6 w-6" />
          </button>
        </div>
      )}

      <div className="flex-1 pb-6">
        {step === 0 && <IntroView step={steps[0]} />}
        {step === 1 && <ExplainView step={explain} index={card} />}
        {step === 2 && practice.mode === "cards" && <CardsPracticeView step={practice} />}
        {step === 2 && practice.mode === "blocks" && <BlocksPracticeView step={practice} fallback={fallback} />}
        {step === 2 && practice.mode === "chat" && <ChatPracticeView step={practice} fallback={fallback} />}
        {step === 3 && (
          <QuizView
            step={quiz}
            index={quizIdx}
            selected={picks[quizIdx] ?? null}
            checked={!!checked[quizIdx]}
            onSelect={(i) => setPicks({ ...picks, [quizIdx]: i })}
          />
        )}
        {step === 4 && <WrapView step={steps[4]} quiz={saved?.quiz} />}
      </div>

      {/* 다음 행동 버튼은 늘 화면 아래 같은 자리에 */}
      <nav
        aria-label="단계 이동"
        className="sticky bottom-0 -mx-4 mt-auto flex gap-3 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur"
      >
        {isFirst ? (
          <Link href={listHref} className={secondaryBtn}>
            <ChevronLeft aria-hidden className="h-5 w-5" /> 목록
          </Link>
        ) : (
          <button type="button" onClick={prev} className={secondaryBtn}>
            <ChevronLeft aria-hidden className="h-5 w-5" /> 이전
          </button>
        )}

        {step === 4 ? (
          <Link href={nextReady ? `/learn/${level}/${unit + 1}` : listHref} className={primaryBtn}>
            {nextReady ? "다음 단원" : "단원 목록으로"} <ChevronRight aria-hidden className="h-5 w-5" />
          </Link>
        ) : (
          <button type="button" onClick={next} disabled={nextDisabled} className={primaryBtn}>
            {nextLabel} <ChevronRight aria-hidden className="h-5 w-5" />
          </button>
        )}
      </nav>
    </div>
  );
}

const baseBtn =
  "flex min-h-touch items-center justify-center gap-1 rounded-xl px-4 font-bold transition disabled:cursor-not-allowed disabled:opacity-50";
const secondaryBtn = `${baseBtn} border-2 border-line bg-surface`;
const primaryBtn = `${baseBtn} flex-1 bg-primary text-white hover:bg-primary-strong`;
