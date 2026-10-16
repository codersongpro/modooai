// S-05 학습 단계 (열기·알아보기·해 보기·확인 퀴즈·정리)
import { notFound } from "next/navigation";
import LevelScope from "@/components/LevelScope";
import UnitPlayer from "@/components/player/UnitPlayer";
import { isLevel } from "@/lib/levels";
import { allUnitParams, getUnit, hasUnit } from "@/lib/content";

export function generateStaticParams() {
  return allUnitParams();
}

export default async function UnitPage({ params }: PageProps<"/learn/[level]/[unit]">) {
  const { level, unit } = await params;
  const n = Number(unit);
  if (!isLevel(level) || !Number.isInteger(n)) notFound();
  const content = getUnit(level, n);
  if (!content) notFound();

  return (
    <>
      <LevelScope level={level} />
      <UnitPlayer content={content} nextReady={hasUnit(level, n + 1)} />
    </>
  );
}
