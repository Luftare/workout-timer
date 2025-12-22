import { create } from 'zustand';
import { COUNTDOWN_DURATION_MS, EXERCISE_DURATION_MS } from '../constants/constants';

type TimerState = 'idle' | 'countdown' | 'running' | 'paused' | 'completed';

interface TimerStore {
  state: TimerState;
  countdownRemaining: number;
  timerRemaining: number;
  startCountdown: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  continueTimer: () => void;
  updateCountdown: (remaining: number) => void;
  updateTimer: (remaining: number) => void;
  reset: () => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  state: 'idle',
  countdownRemaining: COUNTDOWN_DURATION_MS,
  timerRemaining: EXERCISE_DURATION_MS,
  startCountdown: () => set({ state: 'countdown', countdownRemaining: COUNTDOWN_DURATION_MS }),
  startTimer: () => set({ state: 'running', timerRemaining: EXERCISE_DURATION_MS }),
  pauseTimer: () => set({ state: 'paused' }),
  continueTimer: () => set({ state: 'running' }),
  updateCountdown: (remaining: number) => set({ countdownRemaining: remaining }),
  updateTimer: (remaining: number) => set({ timerRemaining: remaining }),
  reset: () => set({
    state: 'idle',
    countdownRemaining: COUNTDOWN_DURATION_MS,
    timerRemaining: EXERCISE_DURATION_MS,
  }),
}));

