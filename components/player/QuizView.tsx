"use client";
// 확인 퀴즈 한 문항. 상태는 UnitPlayer 가 가지고 있다.
// 정답·오답은 색과 함께 아이콘과 글자로도 알려 준다.
import { useEffect, useRef } from "react";
import { CircleCheck, CircleX } from "lucide-react";
import type { QuizStep } from "@/lib/content-types";

type Props = {
  step: QuizStep;
  index: number;
  selected: number | null;
  checked: boolean;
  onSelect: (i: number) => void;
};

export default function QuizView({ step, index, selected, checked, onSelect }: Props) {
  const item = step.items[index];
  const correct = selected === item.answer;
  const feedback = useRef<HTMLDivElement>(null);

  // 정답 확인을 누르면 설명이 아래 버튼에 가리지 않게 내려 준다
  useEffect(() => {
    if (checked) feedback.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [checked, index]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[1.4rem] font-bold">{step.title}</h2>
        <span className="shrink-0 text-muted">
          {index + 1} / {step.items.length}
        </span>
      </div>
      <p className="text-[1.2rem] font-semibold" id="quiz-q">
        {item.q}
      </p>
      <div role="radiogroup" aria-labelledby="quiz-q" className="flex flex-col gap-3">
        {item.choices.map((c, i) => {
          const isSel = selected === i;
          const isAnswer = i === item.answer;
          let tone = "border-line bg-surface hover:border-primary";
          if (!checked && isSel) tone = "border-primary bg-primary-soft";
          if (checked && isAnswer) tone = "border-ok bg-ok-soft";
          if (checked && isSel && !isAnswer) tone = "border-bad bg-bad-soft";
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isSel}
              disabled={checked}
              onClick={() => onSelect(i)}
              className={`flex min-h-touch items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-semibold transition disabled:cursor-default ${tone}`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-current text-sm">
                {i + 1}
              </span>
              <span className="flex-1">{c}</span>
              {checked && isAnswer && (
                <span className="flex shrink-0 items-center gap-1 text-ok">
                  <CircleCheck aria-hidden className="h-6 w-6" /> 정답
                </span>
              )}
              {checked && isSel && !isAnswer && (
                <span className="flex shrink-0 items-center gap-1 text-bad">
                  <CircleX aria-hidden className="h-6 w-6" /> 내 답
                </span>
              )}
            </button>
          );
        })}
      </div>
      {checked && (
        <div
          ref={feedback}
          role="status"
          className={`scroll-mb-32 rounded-2xl border-2 p-4 ${correct ? "border-ok bg-ok-soft" : "border-bad bg-bad-soft"}`}
        >
          <p className={`flex items-center gap-2 text-[1.2rem] font-bold ${correct ? "text-ok" : "text-bad"}`}>
            {correct ? <CircleCheck aria-hidden className="h-7 w-7" /> : <CircleX aria-hidden className="h-7 w-7" />}
            {correct ? "맞았어요" : "아쉬워요"}
          </p>
          <p className="mt-1">{item.explain}</p>
        </div>
      )}
    </div>
  );
}
