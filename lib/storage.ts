"use client";
// 기기 저장소(localStorage) 다루기.
// 사생활 보호 모드처럼 저장소를 못 쓰면 메모리에만 두고 학습은 그대로 이어 간다.

import { useSyncExternalStore } from "react";
import { FONT_KEY } from "./font-init";

const PROGRESS_KEY = "modooai:progress:v1";

export type UnitProgress = {
  step: number; // 지금 보고 있는 단계 (0~4)
  done: number[]; // 마친 단계 번호
  quiz?: { score: number; total: number };
  completed: boolean;
  updatedAt: number;
};

export type ProgressStore = {
  units: Record<string, UnitProgress>; // 키 예: "L2-1"
  last?: string; // 마지막으로 본 단원 키
};

// ---- 저장소 기본 읽기·쓰기 ----

let available: boolean | null = null;
const memory = new Map<string, string>();

export function storageAvailable(): boolean {
  if (available !== null) return available;
  try {
    const k = "modooai:test";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

function read(key: string): string | null {
  if (storageAvailable()) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      /* 아래 메모리 값으로 */
    }
  }
  return memory.get(key) ?? null;
}

function write(key: string, value: string) {
  memory.set(key, value);
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* 용량 초과 등. 메모리에는 남아 있다 */
  }
}

// ---- 작은 구독 장치: 값이 바뀌면 화면을 다시 그린다 ----

function createStore<T>(load: () => T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();
  return {
    get(): T {
      if (cache === undefined) cache = load();
      return cache;
    },
    set(next: T) {
      cache = next;
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

// ---- 진도 ----

function loadProgress(): ProgressStore {
  try {
    const raw = read(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProgressStore;
      if (parsed && typeof parsed.units === "object") return parsed;
    }
  } catch {
    /* 깨진 값은 버린다 */
  }
  return { units: {} };
}

const progressStore = createStore(loadProgress);

export const unitKey = (level: string, unit: number) => `${level}-${unit}`;

export function useProgress(): ProgressStore | null {
  return useSyncExternalStore(progressStore.subscribe, progressStore.get, () => null);
}

export function saveUnitProgress(key: string, patch: Partial<UnitProgress>) {
  const cur = progressStore.get();
  const prev: UnitProgress = cur.units[key] ?? { step: 0, done: [], completed: false, updatedAt: 0 };
  const next: ProgressStore = {
    units: { ...cur.units, [key]: { ...prev, ...patch, updatedAt: Date.now() } },
    last: key,
  };
  write(PROGRESS_KEY, JSON.stringify(next));
  progressStore.set(next);
}

// ---- 글자 크기 (0 보통, 1 크게, 2 아주 크게) ----

export const FONT_SCALES = [1, 1.15, 1.3] as const;

function loadFont(): number {
  const n = Number(read(FONT_KEY));
  return n === 1 || n === 2 ? n : 0;
}

const fontStore = createStore(loadFont);

export function useFontScale(): number {
  return useSyncExternalStore(fontStore.subscribe, fontStore.get, () => 0);
}

export function setFontScale(n: number) {
  write(FONT_KEY, String(n));
  document.documentElement.dataset.scale = String(n);
  fontStore.set(n);
}

