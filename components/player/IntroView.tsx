import type { IntroStep } from "@/lib/content-types";
import { AppIcon } from "@/lib/icons";

export default function IntroView({ step }: { step: IntroStep }) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <span className="flex h-28 w-28 items-center justify-center rounded-full bg-primary-soft text-primary">
        <AppIcon name={step.icon} className="h-16 w-16" />
      </span>
      <h2 className="text-[1.6rem] font-bold">{step.title}</h2>
      {step.body.map((line, i) => (
        <p key={i} className="text-[1.1rem]">
          {line}
        </p>
      ))}
    </div>
  );
}
