import { STEP_LABELS } from "@/lib/content-types";

// 5단계 진행 바. 좁은 화면을 생각해 지금 단계 이름만 글자로 보여 준다.
export default function ProgressBar({ step }: { step: number }) {
  return (
    <div>
      <p className="mb-2 font-bold text-primary-strong">
        {step + 1}/5 {STEP_LABELS[step]}
      </p>
      <ol className="flex gap-1.5" aria-label="학습 단계">
        {STEP_LABELS.map((label, i) => (
          <li
            key={label}
            aria-current={i === step ? "step" : undefined}
            className={`h-3 flex-1 rounded-full ${i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-line"}`}
          >
            <span className="sr-only">
              {label} {i < step ? "마침" : i === step ? "지금" : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
