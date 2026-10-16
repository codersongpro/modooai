import type { ExplainStep } from "@/lib/content-types";
import { AppIcon } from "@/lib/icons";

// 카드 한 장씩 보여 준다. 몇 번째 카드인지는 UnitPlayer 가 정한다.
export default function ExplainView({ step, index }: { step: ExplainStep; index: number }) {
  const card = step.cards[index];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[1.4rem] font-bold">{step.title}</h2>
        <span className="shrink-0 text-muted" aria-label={`카드 ${step.cards.length}장 중 ${index + 1}번째`}>
          {index + 1} / {step.cards.length}
        </span>
      </div>
      <article key={index} className="flex flex-col items-center gap-3 rounded-3xl border-2 border-line bg-surface p-6 text-center shadow-sm">
        <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <AppIcon name={card.icon} className="h-14 w-14" />
        </span>
        <h3 className="text-[1.3rem] font-bold">{card.title}</h3>
        <p className="text-[1.1rem]">{card.body}</p>
        {card.more && (
          <details className="w-full text-left">
            <summary className="flex min-h-touch cursor-pointer items-center justify-center font-semibold text-primary">더 보기</summary>
            <p className="mt-2 text-muted">{card.more}</p>
          </details>
        )}
      </article>
    </div>
  );
}
