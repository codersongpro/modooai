"use client";
// L2 연습 AI: 칸마다 블록을 하나씩 골라 질문을 만든다. 자유 입력은 없다.
import { useState } from "react";
import { Send } from "lucide-react";
import type { BlocksPractice } from "@/lib/content-types";
import ChatBubbles from "./ChatBubbles";
import { useFakeReply } from "./useFakeReply";
import { findBlockAnswer } from "./lookup";

export default function BlocksPracticeView({ step, fallback }: { step: BlocksPractice; fallback: string }) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const { turns, ask, waiting } = useFakeReply();

  const ready = step.slots.every((s) => picked[s.id]);
  const labels = step.slots.map((s) => s.options.find((o) => o.id === picked[s.id])?.label);

  function send() {
    const ids = step.slots.map((s) => picked[s.id]);
    ask([...labels, step.suffix].filter(Boolean).join(" "), findBlockAnswer(step.answers, ids, fallback));
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[1.4rem] font-bold">{step.title}</h2>
      <p>{step.guide}</p>

      {step.slots.map((slot, si) => (
        <fieldset key={slot.id} className="rounded-2xl border-2 border-line bg-surface p-4">
          <legend className="px-1 font-bold">
            {si + 1}. {slot.label}
          </legend>
          <div className="flex flex-wrap gap-2">
            {slot.options.map((o) => {
              const on = picked[slot.id] === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked((p) => ({ ...p, [slot.id]: o.id }))}
                  className={`min-h-touch rounded-xl border-2 px-4 py-2 font-semibold transition ${
                    on ? "border-primary bg-primary text-white" : "border-line bg-bg hover:border-primary"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="rounded-2xl border-2 border-dashed border-primary/50 bg-primary-soft p-4">
        <p className="text-sm font-bold text-primary-strong">내가 만든 질문</p>
        <p className="mt-1 min-h-[1.6em] text-[1.1rem]">
          {labels.map((l, i) => (
            <span key={i} className={l ? "" : "text-muted"}>
              {l ?? "( )"}{" "}
            </span>
          ))}
          {step.suffix}
        </p>
        <button
          type="button"
          onClick={send}
          disabled={!ready || waiting}
          className="mt-3 flex min-h-touch w-full items-center justify-center gap-2 rounded-xl bg-ai px-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send aria-hidden className="h-5 w-5" /> {ready ? "연습 AI에게 보내기" : "칸을 모두 골라요"}
        </button>
      </div>

      <ChatBubbles turns={turns} />
    </div>
  );
}
