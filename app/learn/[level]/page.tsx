// S-04 단원 목록
import { notFound } from "next/navigation";
import LevelScope from "@/components/LevelScope";
import UnitList from "@/components/UnitList";
import { LEVELS, LEVEL_INFO, MVP_UNITS, UNIT_TITLES, isLevel } from "@/lib/levels";
import { hasUnit } from "@/lib/content";

export function generateStaticParams() {
  return LEVELS.map((level) => ({ level }));
}

export default async function LevelPage({ params }: PageProps<"/learn/[level]">) {
  const { level } = await params;
  if (!isLevel(level)) notFound();

  const units = UNIT_TITLES.slice(0, MVP_UNITS).map((title, i) => ({
    unit: i + 1,
    title,
    ready: hasUnit(level, i + 1),
  }));

  return (
    <>
      <LevelScope level={level} />
      <p className="text-muted">{LEVEL_INFO[level].name}</p>
      <h1 className="mb-4 text-[1.6rem] font-bold">단원을 골라요</h1>
      <UnitList level={level} units={units} />
    </>
  );
}
