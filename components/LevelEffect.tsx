"use client";
import { useEffect } from "react";

export default function LevelEffect({ level }: { level: string }) {
  useEffect(() => {
    const html = document.documentElement;
    if (level) html.dataset.level = level;
    else delete html.dataset.level;
    return () => {
      delete html.dataset.level;
    };
  }, [level]);
  return null;
}
