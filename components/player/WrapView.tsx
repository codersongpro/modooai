import { CircleCheck, Sparkles } from "lucide-react";
import type { WrapStep } from "@/lib/content-types";

export default function WrapView({ step, quiz }: { step: WrapStep; quiz?: { score: number; total: number } }) {
  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-ok-soft text-ok">
        <Sparkles aria-hidden className="h-14 w-14" />
      </span>
      <h2 className="text-[1.6rem] font-bold">{step.title}</h2>
      <ul className="flex w-full flex-col gap-3 text-left">
        {step.points.map((p, i) => (
          <li key={i} className="flex items-start gap-3 rounded-2xl border-2 border-line bg-surface p-4">
            <CircleCheck aria-hidden className="mt-0.5 h-6 w-6 shrink-0 text-ok" />
            <span className="text-[1.1rem]">{p}</span>
          </li>
        ))}
      </ul>
      {quiz && (
        <p className="font-semibold text-muted">
          퀴즈 {quiz.total}문제 중 {quiz.score}문제 맞혔어요
        </p>
      )}
    </div>
  );
}
