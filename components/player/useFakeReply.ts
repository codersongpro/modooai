"use client";
// 연습 AI 답을 잠깐 기다렸다가 보여 준다. 실제 AI처럼 "생각하는 중"을 거친다.
import { useEffect, useRef, useState } from "react";
import type { Turn } from "./ChatBubbles";

const DELAY_MS = 700;

export function useFakeReply() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function ask(question: string, answer: string) {
    if (timer.current) clearTimeout(timer.current);
    // 새 질문을 하면 앞 대화는 지우고 한 쌍만 보여 준다 (한 화면에 할 일 하나)
    setTurns([
      { role: "me", text: question },
      { role: "ai", text: "", pending: true },
    ]);
    timer.current = setTimeout(() => {
      setTurns([
        { role: "me", text: question },
        { role: "ai", text: answer },
      ]);
    }, DELAY_MS);
  }

  return { turns, ask, waiting: turns.some((t) => t.pending) };
}
