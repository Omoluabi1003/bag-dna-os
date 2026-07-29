import type { ReplayEvent } from "@/types/phoenix";
export const nextReplayIndex = (index: number, events: ReplayEvent[]) => Math.min(index + 1, events.length - 1);
export const previousReplayIndex = (index: number) => Math.max(index - 1, 0);
