"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
}

let lastSnapshot = new Date();
function getSnapshot() {
  const now = new Date();
  if (now.getTime() !== lastSnapshot.getTime()) lastSnapshot = now;
  return lastSnapshot;
}

export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function useCountdown(target: Date, now: Date | null) {
  const ready = now !== null;
  const diff = ready ? Math.max(0, target.getTime() - now.getTime()) : 0;
  return {
    ready,
    days: ready ? Math.floor(diff / 86400000) : null,
    hours: ready ? Math.floor(diff / 3600000) % 24 : null,
    minutes: ready ? Math.floor(diff / 60000) % 60 : null,
    seconds: ready ? Math.floor(diff / 1000) % 60 : null,
  };
}

export function useDaysSince(start: Date, now: Date | null) {
  return now
    ? Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000))
    : null;
}

export function useNowDaysSince(start: Date) {
  const now = useNow();
  return useDaysSince(start, now);
}
