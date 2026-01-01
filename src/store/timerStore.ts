import { create } from "zustand";
import { COUNTDOWN_DURATION_MS } from "../constants/constants";
import { Set, isTimedSet, isRest } from "../data/workouts";
import { Workout } from "../data/workouts";
import { getActualDuration, getRestDuration } from "../utils/volume";
import {
  CommitmentLevel,
  getVolumeFromCommitment,
} from "../constants/constants";

type TimerState = "idle" | "countdown" | "running" | "paused" | "completed";

interface TimerStore {
  state: TimerState;
  sets: Set[];
  currentSetIndex: number;
  countdownRemaining: number;
  timerRemaining: number;
  selectedWorkout: Workout | null;
  commitmentLevel: CommitmentLevel;
  setSelectedWorkout: (workout: Workout) => void;
  setSets: (sets: Set[], commitmentLevel: CommitmentLevel) => void;
  setCommitmentLevel: (level: CommitmentLevel) => void;
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
  getCurrentSetDuration: () => number; // Returns actual duration in milliseconds
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  state: "idle",
  sets: [],
  currentSetIndex: 0,
  countdownRemaining: COUNTDOWN_DURATION_MS,
  timerRemaining: 0,
  selectedWorkout: null,
  commitmentLevel: "standard",
  setSelectedWorkout: (workout: Workout) => {
    set({ selectedWorkout: workout, sets: workout.sets });
  },
  setSets: (sets: Set[], commitmentLevel: CommitmentLevel) => {
    const volume = getVolumeFromCommitment(commitmentLevel);
    const firstSet = sets[0];
    let firstSetDurationMs = 0;

    if (firstSet) {
      if (isTimedSet(firstSet)) {
        firstSetDurationMs = getActualDuration(firstSet, volume) * 1000;
      } else if (isRest(firstSet)) {
        firstSetDurationMs = getRestDuration(firstSet) * 1000;
      }
    }

    set({
      sets,
      commitmentLevel,
      currentSetIndex: 0,
      state: "idle",
      countdownRemaining: COUNTDOWN_DURATION_MS,
      timerRemaining: firstSetDurationMs,
    });
  },
  setCommitmentLevel: (level: CommitmentLevel) => {
    set({ commitmentLevel: level });
  },
  startCountdown: () => {
    const currentSet = get().getCurrentSet();
    if (currentSet) {
      const durationMs = get().getCurrentSetDuration();
      set({
        state: "countdown",
        countdownRemaining: COUNTDOWN_DURATION_MS,
        timerRemaining: durationMs,
      });
    }
  },
  startTimer: () => {
    const currentSet = get().getCurrentSet();
    if (currentSet) {
      const durationMs = get().getCurrentSetDuration();
      set({
        state: "running",
        timerRemaining: durationMs,
      });
    }
  },
  pauseTimer: () => set({ state: "paused" }),
  continueTimer: () => set({ state: "running" }),
  updateCountdown: (remaining: number) =>
    set({ countdownRemaining: remaining }),
  updateTimer: (remaining: number) => set({ timerRemaining: remaining }),
  nextSet: () => {
    const { currentSetIndex, sets, commitmentLevel } = get();
    const nextIndex = currentSetIndex + 1;
    if (nextIndex < sets.length) {
      const nextSet = sets[nextIndex];
      const volume = getVolumeFromCommitment(commitmentLevel);
      let nextSetDurationMs = 0;

      if (isTimedSet(nextSet)) {
        nextSetDurationMs = getActualDuration(nextSet, volume) * 1000;
      } else if (isRest(nextSet)) {
        nextSetDurationMs = getRestDuration(nextSet) * 1000;
      }

      set({
        currentSetIndex: nextIndex,
        state: "idle",
        countdownRemaining: COUNTDOWN_DURATION_MS,
        timerRemaining: nextSetDurationMs,
      });
    }
  },
  reset: () => {
    const { sets, commitmentLevel } = get();
    const firstSet = sets[0];
    const volume = getVolumeFromCommitment(commitmentLevel);
    let firstSetDurationMs = 0;

    if (firstSet) {
      if (isTimedSet(firstSet)) {
        firstSetDurationMs = getActualDuration(firstSet, volume) * 1000;
      } else if (isRest(firstSet)) {
        firstSetDurationMs = getRestDuration(firstSet) * 1000;
      }
    }

    set({
      state: "idle",
      currentSetIndex: 0,
      countdownRemaining: COUNTDOWN_DURATION_MS,
      timerRemaining: firstSetDurationMs,
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
      if (isRest(nextSet)) {
        const restDurationMs = getRestDuration(nextSet) * 1000;
        set({
          currentSetIndex: nextIndex,
          state: "running",
          countdownRemaining: COUNTDOWN_DURATION_MS,
          timerRemaining: restDurationMs,
        });
      }
    }
  },
  getCurrentSetDuration: () => {
    const { sets, currentSetIndex, commitmentLevel } = get();
    const currentSet = sets[currentSetIndex];
    if (!currentSet) return 0;

    const volume = getVolumeFromCommitment(commitmentLevel);

    if (isTimedSet(currentSet)) {
      return getActualDuration(currentSet, volume) * 1000;
    } else if (isRest(currentSet)) {
      return getRestDuration(currentSet) * 1000;
    }

    return 0;
  },
}));
