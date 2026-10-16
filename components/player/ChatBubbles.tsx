// 학습자 말풍선(오른쪽)과 연습 AI 말풍선(왼쪽)
"use client";
import { useEffect, useRef } from "react";
import { Bot, Info } from "lucide-react";

export type Turn = { role: "me" | "ai"; text: string; pending?: boolean };

export default function ChatBubbles({ turns, aiLabel = "연습 AI" }: { turns: Turn[]; aiLabel?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const answered = turns.some((t) => t.role === "ai" && !t.pending);

  // 답이 나오면 아래 버튼에 가리지 않게 내려 준다
  useEffect(() => {
    if (turns.length) box.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [turns.length, answered]);

  if (turns.length === 0) return null;
  return (
    <div ref={box} className="flex scroll-mb-32 flex-col gap-3" aria-live="polite">
      {turns.map((t, i) =>
        t.role === "me" ? (
          <p key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-white">
            {t.text}
          </p>
        ) : (
          <div key={i} className="mr-auto max-w-[92%]">
            <p className="mb-1 flex items-center gap-1 text-sm font-bold text-ai">
              <Bot aria-hidden className="h-5 w-5" /> {aiLabel}
            </p>
            <div className="rounded-2xl rounded-tl-sm border-2 border-ai/30 bg-ai-soft px-4 py-3">
              {t.pending ? (
                <span className="inline-flex gap-1 py-2" aria-label="답을 만드는 중">
                  <Dot d="0ms" /> <Dot d="150ms" /> <Dot d="300ms" />
                </span>
              ) : (
                <p className="whitespace-pre-line">{t.text}</p>
              )}
            </div>
            {!t.pending && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                <Info aria-hidden className="h-4 w-4" /> AI 답은 틀릴 수 있어요
              </p>
            )}
          </div>
        ),
      )}
    </div>
  );
}

function Dot({ d }: { d: string }) {
  return <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-ai" style={{ animationDelay: d }} />;
}
