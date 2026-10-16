// 단원 콘텐츠 목록. 새 JSON 파일을 만들면 여기에 한 줄 더한다.
import type { UnitContent } from "./content-types";
import type { Level } from "./levels";

import L1u1 from "@/content/L1/unit-01.json";
import L2u1 from "@/content/L2/unit-01.json";

const ALL = [L1u1, L2u1] as unknown as UnitContent[];

export function getUnit(level: Level, unit: number): UnitContent | undefined {
  return ALL.find((u) => u.level === level && u.unit === unit);
}

export function hasUnit(level: Level, unit: number): boolean {
  return Boolean(getUnit(level, unit));
}

export function allUnitParams() {
  return ALL.map((u) => ({ level: u.level, unit: String(u.unit) }));
}
