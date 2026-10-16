"use client";
// 글자 크기 3단계 버튼. 고른 값은 기기에 저장한다.
import { setFontScale, useFontScale } from "@/lib/storage";

const OPTIONS = [
  { label: "보통", size: "text-[15px]" },
  { label: "크게", size: "text-[19px]" },
  { label: "아주 크게", size: "text-[23px]" },
];

export default function FontSizeControl() {
  const scale = useFontScale();
  return (
    <div role="group" aria-label="글자 크기" className="flex items-center gap-1">
      <span className="mr-1 hidden text-sm text-muted sm:inline">글자 크기</span>
      {OPTIONS.map((o, i) => (
        <button
          key={o.label}
          type="button"
          aria-label={`글자 크기 ${o.label}`}
          aria-pressed={scale === i}
          onClick={() => setFontScale(i)}
          className={`flex h-[48px] w-[48px] items-center justify-center rounded-xl border-2 font-bold leading-none ${o.size} ${
            scale === i
              ? "border-primary bg-primary text-white"
              : "border-line bg-surface text-ink hover:border-primary"
          }`}
        >
          가
        </button>
      ))}
    </div>
  );
}
