"use client";
// L3·L4 해 보기. 실제 AI는 6단계에서 연결한다. 지금은 연습 모드 답을 보여 준다.
import { useState } from "react";
import { Send } from "lucide-react";
import type { ChatPractice } from "@/lib/content-types";
import ChatBubbles from "./ChatBubbles";
import { useFakeReply } from "./useFakeReply";

const MAX = 500;

export default function ChatPracticeView({ step, fallback }: { step: ChatPractice; fallback: string }) {
  const [text, setText] = useState("");
  const { turns, ask, waiting } = useFakeReply();

  function send() {
    const q = text.trim();
    if (!q) return;
    ask(q, fallback);
    setText("");
  }

  return (
    <div className="flex flex-col gap-4">
      <p role="status" className="rounded-xl bg-warn-soft px-4 py-3 font-semibold text-warn-text">
        지금은 연습 모드예요. 예시 답을 보여 드려요.
      </p>
      <h2 className="text-[1.4rem] font-bold">{step.title}</h2>
      <p>{step.guide}</p>
      <div className="flex flex-wrap gap-2">
        {step.examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setText(ex)}
            className="min-h-touch rounded-xl border-2 border-line bg-surface px-3 py-2 text-left hover:border-primary"
          >
            {ex}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1">
        <span className="font-bold">질문 쓰기</span>
        <textarea
          value={text}
          maxLength={MAX}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-xl border-2 border-line bg-surface p-3 focus:border-primary"
        />
        <span className="self-end text-sm text-muted">
          {text.length}/{MAX}
        </span>
      </label>
      <button
        type="button"
        onClick={send}
        disabled={!text.trim() || waiting}
        className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-ai px-4 font-bold text-white disabled:opacity-50"
      >
        <Send aria-hidden className="h-5 w-5" /> 보내기
      </button>
      <ChatBubbles turns={turns} />
    </div>
  );
}
