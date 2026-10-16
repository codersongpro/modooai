"use client";
// L1 연습 AI: 그림 카드를 고르면 미리 만든 답을 보여 준다. 외부 AI는 부르지 않는다.
import type { CardsPractice } from "@/lib/content-types";
import { AppIcon } from "@/lib/icons";
import ChatBubbles from "./ChatBubbles";
import { useFakeReply } from "./useFakeReply";
import { useState } from "react";

export default function CardsPracticeView({ step }: { step: CardsPractice }) {
  const { turns, ask } = useFakeReply();
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[1.4rem] font-bold">{step.title}</h2>
      <p>{step.guide}</p>
      <div role="group" aria-label="부탁 카드" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {step.cards.map((c) => {
          const on = picked === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setPicked(c.id);
                ask(c.label, c.answer);
              }}
              className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 text-center font-bold transition ${
                on ? "border-primary bg-primary-soft" : "border-line bg-surface hover:border-primary"
              }`}
            >
              <AppIcon name={c.icon} className="h-12 w-12 text-primary" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>
      <ChatBubbles turns={turns} />
    </div>
  );
}
