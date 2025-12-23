import { create } from "zustand";
import { COUNTDOWN_DURATION_MS } from "../constants/constants";
import { Set } from "../data/workouts";
import { Workout } from "../data/workouts";

type TimerState = "idle" | "countdown" | "running" | "paused" | "completed";

interface TimerStore {
  state: TimerState;
  sets: Set[];
  currentSetIndex: number;
  countdownRemaining: number;
  timerRemaining: number;
  selectedWorkout: Workout | null;
  setSelectedWorkout: (workout: Workout) => void;
  setSets: (sets: Set[]) => void;
  startCountdown: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  continueTimer: () => void;
  updateCountdown: (remaining: number) => void;
  updateTimer: (remaining: number) => void;
  nextSet: () => void;
  reset: () => void;
  getCurrentSet: () => Set | null;
  getNextSet: () => Set | null;
  isLastSet: () => boolean;
  startRestAutomatically: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  state: "idle",
  sets: [],
  currentSetIndex: 0,
  countdownRemaining: COUNTDOWN_DURATION_MS,
  timerRemaining: 0,
  selectedWorkout: null,
  setSelectedWorkout: (workout: Workout) => {
    set({ selectedWorkout: workout, sets: workout.sets });
  },
  setSets: (sets: Set[]) =>
    set({
      sets,
      currentSetIndex: 0,
      state: "idle",
      countdownRemaining: COUNTDOWN_DURATION_MS,
      timerRemaining: sets[0] ? sets[0].durationSeconds * 1000 : 0,
    }),
  startCountdown: () => {
    const currentSet = get().getCurrentSet();
    if (currentSet) {
      set({
        state: "countdown",
        countdownRemaining: COUNTDOWN_DURATION_MS,
        timerRemaining: currentSet.durationSeconds * 1000,
      });
    }
  },
  startTimer: () => {
    const currentSet = get().getCurrentSet();
    if (currentSet) {
      set({
        state: "running",
        timerRemaining: currentSet.durationSeconds * 1000,
      });
    }
  },
  pauseTimer: () => set({ state: "paused" }),
  continueTimer: () => set({ state: "running" }),
  updateCountdown: (remaining: number) =>
    set({ countdownRemaining: remaining }),
  updateTimer: (remaining: number) => set({ timerRemaining: remaining }),
  nextSet: () => {
    const { currentSetIndex, sets } = get();
    const nextIndex = currentSetIndex + 1;
    if (nextIndex < sets.length) {
      const nextSet = sets[nextIndex];
      set({
        currentSetIndex: nextIndex,
        state: "idle",
        countdownRemaining: COUNTDOWN_DURATION_MS,
        timerRemaining: nextSet.durationSeconds * 1000,
      });
    }
  },
  reset: () => {
    const sets = get().sets;
    const firstSet = sets[0];
    set({
      state: "idle",
      currentSetIndex: 0,
      countdownRemaining: COUNTDOWN_DURATION_MS,
      timerRemaining: firstSet ? firstSet.durationSeconds * 1000 : 0,
    });
  },
  getCurrentSet: () => {
    const { sets, currentSetIndex } = get();
    return sets[currentSetIndex] || null;
  },
  getNextSet: () => {
    const { sets, currentSetIndex } = get();
    const nextIndex = currentSetIndex + 1;
    return sets[nextIndex] || null;
  },
  isLastSet: () => {
    const { sets, currentSetIndex } = get();
    return currentSetIndex === sets.length - 1;
  },
  startRestAutomatically: () => {
    const { sets, currentSetIndex } = get();
    const nextIndex = currentSetIndex + 1;
    if (nextIndex < sets.length) {
      const nextSet = sets[nextIndex];
      if (nextSet.isRest) {
        set({
          currentSetIndex: nextIndex,
          state: "running",
          countdownRemaining: COUNTDOWN_DURATION_MS,
          timerRemaining: nextSet.durationSeconds * 1000,
        });
      }
    }
  },
}));
