import { create } from "zustand";
import { COUNTDOWN_DURATION_MS } from "../constants/constants";
import { Exercise } from "../data/exercises";

type TimerState = "idle" | "countdown" | "running" | "paused" | "completed";

interface TimerStore {
  state: TimerState;
  exercises: Exercise[];
  currentExerciseIndex: number;
  countdownRemaining: number;
  timerRemaining: number;
  setExercises: (exercises: Exercise[]) => void;
  startCountdown: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  continueTimer: () => void;
  updateCountdown: (remaining: number) => void;
  updateTimer: (remaining: number) => void;
  nextExercise: () => void;
  reset: () => void;
  getCurrentExercise: () => Exercise | null;
  getNextExercise: () => Exercise | null;
  isLastExercise: () => boolean;
  startRestAutomatically: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  state: "idle",
  exercises: [],
  currentExerciseIndex: 0,
  countdownRemaining: COUNTDOWN_DURATION_MS,
  timerRemaining: 0,
  setExercises: (exercises: Exercise[]) =>
    set({
      exercises,
      currentExerciseIndex: 0,
      state: "idle",
      countdownRemaining: COUNTDOWN_DURATION_MS,
      timerRemaining: exercises[0] ? exercises[0].durationSeconds * 1000 : 0,
    }),
  startCountdown: () => {
    const currentExercise = get().getCurrentExercise();
    if (currentExercise) {
      set({
        state: "countdown",
        countdownRemaining: COUNTDOWN_DURATION_MS,
        timerRemaining: currentExercise.durationSeconds * 1000,
      });
    }
  },
  startTimer: () => {
    const currentExercise = get().getCurrentExercise();
    if (currentExercise) {
      set({ state: "running", timerRemaining: currentExercise.durationSeconds * 1000 });
    }
  },
  pauseTimer: () => set({ state: "paused" }),
  continueTimer: () => set({ state: "running" }),
  updateCountdown: (remaining: number) =>
    set({ countdownRemaining: remaining }),
  updateTimer: (remaining: number) => set({ timerRemaining: remaining }),
  nextExercise: () => {
    const { currentExerciseIndex, exercises } = get();
    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < exercises.length) {
      const nextExercise = exercises[nextIndex];
      set({
        currentExerciseIndex: nextIndex,
        state: "idle",
        countdownRemaining: COUNTDOWN_DURATION_MS,
        timerRemaining: nextExercise.durationSeconds * 1000,
      });
    }
  },
  reset: () => {
    const exercises = get().exercises;
    const firstExercise = exercises[0];
    set({
      state: "idle",
      currentExerciseIndex: 0,
      countdownRemaining: COUNTDOWN_DURATION_MS,
      timerRemaining: firstExercise ? firstExercise.durationSeconds * 1000 : 0,
    });
  },
  getCurrentExercise: () => {
    const { exercises, currentExerciseIndex } = get();
    return exercises[currentExerciseIndex] || null;
  },
  getNextExercise: () => {
    const { exercises, currentExerciseIndex } = get();
    const nextIndex = currentExerciseIndex + 1;
    return exercises[nextIndex] || null;
  },
  isLastExercise: () => {
    const { exercises, currentExerciseIndex } = get();
    return currentExerciseIndex === exercises.length - 1;
  },
  startRestAutomatically: () => {
    const { exercises, currentExerciseIndex } = get();
    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < exercises.length) {
      const nextExercise = exercises[nextIndex];
      if (nextExercise.isRest) {
        set({
          currentExerciseIndex: nextIndex,
          state: "running",
          countdownRemaining: COUNTDOWN_DURATION_MS,
          timerRemaining: nextExercise.durationSeconds * 1000,
        });
      }
    }
  },
}));
