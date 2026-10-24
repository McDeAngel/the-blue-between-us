export type Chapter = "arrival" | "twins" | "signal" | "garden" | "future" | "finale";
export type Journey = {
  started: boolean;
  active: Chapter | "constellation";
  unlocked: Chapter[];
  trace: number;
  matched: string[];
  step: number;
  correct: boolean;
  bloomed: number[];
  activeLily: number | null;
  developed: number[];
  opened: ("bogart" | "jelly")[];
  letter: "bogart" | "jelly" | null;
  revealed: number;
  sent: boolean;
  yes: boolean;
  finaleKept: boolean;
};

export const chapterIds: Chapter[] = ["arrival", "twins", "signal", "garden", "future", "finale"];
export const initialJourney: Journey = {
  started: false, active: "arrival", unlocked: ["arrival"], trace: 0, matched: [],
  step: 0, correct: false, bloomed: [], activeLily: null, developed: [], opened: [],
  letter: null, revealed: 1, sent: false, yes: false, finaleKept: false,
};

const bounded = (value: unknown, min: number, max: number, fallback = min) =>
  typeof value === "number" && Number.isInteger(value) && value >= min && value <= max ? value : fallback;
const unique = <T,>(value: unknown, valid: T[]): T[] =>
  Array.isArray(value) ? [...new Set(value.filter((item): item is T => valid.includes(item)))] : [];

/** Browser storage is untrusted, and older versions saved only chapter unlocks. */
export function restoreJourney(value: unknown): Journey {
  if (!value || typeof value !== "object") return { ...initialJourney };
  const saved = value as Record<string, unknown>;
  const unlocked = unique(saved.unlocked, chapterIds);
  const result: Journey = {
    ...initialJourney,
    started: saved.started === true,
    unlocked: [...new Set<Chapter>(["arrival", ...unlocked])],
    trace: bounded(saved.trace, 0, 3), matched: unique(saved.matched, ["mind", "laugh", "home", "heart"]),
    step: bounded(saved.step, 0, 3), correct: saved.correct === true && bounded(saved.step, 0, 3) < 3,
    bloomed: unique(saved.bloomed, [0, 1, 2, 3, 4, 5]),
    activeLily: saved.activeLily === null ? null : bounded(saved.activeLily, 0, 5, -1),
    developed: unique(saved.developed, [0, 1, 2]), opened: unique(saved.opened, ["bogart", "jelly"]),
    letter: saved.letter === "bogart" || saved.letter === "jelly" ? saved.letter : null,
    revealed: bounded(saved.revealed, 1, 4), sent: saved.sent === true, yes: saved.yes === true,
    finaleKept: saved.finaleKept === true,
  };
  if (result.activeLily === -1 || !result.bloomed.includes(result.activeLily as number)) result.activeLily = null;
  if (result.developed.length < 3) { result.opened = []; result.letter = null; }
  if (result.letter && !result.opened.includes(result.letter)) result.letter = null;
  if (result.revealed < 4) { result.sent = false; result.yes = false; }
  if (!result.sent) result.yes = false;
  if (result.yes) result.finaleKept = true;
  result.active = saved.active === "constellation" || result.unlocked.includes(saved.active as Chapter)
    ? saved.active as Journey["active"] : "arrival";
  return result;
}

export function chapterFinished(id: Chapter, state: Journey) {
  return ({ arrival: state.trace === 3, twins: state.matched.length === 4, signal: state.step === 3,
    garden: state.bloomed.length === 6, future: state.developed.length === 3 && state.opened.length === 2,
    finale: state.yes || state.finaleKept })[id];
}
