// 지금 화면의 학습 수준을 <html data-level> 에 적는다.
// 수준마다 기본 글자 크기와 버튼 크기가 달라진다 (app/globals.css).
import type { Level } from "@/lib/levels";
import LevelEffect from "./LevelEffect";

export default function LevelScope({ level }: { level?: Level }) {
  const value = level ?? "";
  return (
    <>
      {/* 첫 화면: 그리기 전에 바로 적용 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.dataset.level=${JSON.stringify(value)}`,
        }}
      />
      {/* 화면 이동: 스크립트가 다시 돌지 않으니 여기서 적용 */}
      <LevelEffect level={value} />
    </>
  );
}
