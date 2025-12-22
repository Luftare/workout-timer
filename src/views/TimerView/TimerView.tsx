import { useEffect, useRef } from "react";
import { useTimerStore } from "../../store/timerStore";
import { Button } from "../../components/Button/Button";
import { Headline } from "../../components/Headline/Headline";
import { Paragraph } from "../../components/Paragraph/Paragraph";
import {
  COUNTDOWN_DURATION_MS,
  EXERCISE_DURATION_MS,
  TIMER_UPDATE_INTERVAL_MS,
} from "../../constants/constants";
import "./TimerView.css";

const EXERCISE_NAME = "Pushups";
const EXERCISE_DESCRIPTION = "Do as many pushups as you can in the given time.";

export const TimerView = () => {
  const {
    state,
    countdownRemaining,
    timerRemaining,
    startCountdown,
    startTimer,
    updateCountdown,
    updateTimer,
    reset,
  } = useTimerStore();

  const countdownIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Format time in MM:SS format
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage (0-100)
  const getProgress = (): number => {
    if (state === "countdown") {
      return (
        ((COUNTDOWN_DURATION_MS - countdownRemaining) / COUNTDOWN_DURATION_MS) *
        100
      );
    }
    if (state === "running" || state === "paused") {
      return (
        ((EXERCISE_DURATION_MS - timerRemaining) / EXERCISE_DURATION_MS) * 100
      );
    }
    return 0;
  };

  // Handle countdown
  useEffect(() => {
    if (state === "countdown") {
      countdownIntervalRef.current = window.setInterval(() => {
        useTimerStore
          .getState()
          .updateCountdown(
            useTimerStore.getState().countdownRemaining -
              TIMER_UPDATE_INTERVAL_MS
          );

        const remaining = useTimerStore.getState().countdownRemaining;
        if (remaining <= 0) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          useTimerStore.getState().startTimer();
        }
      }, TIMER_UPDATE_INTERVAL_MS);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [state]);

  // Handle timer
  useEffect(() => {
    if (state === "running") {
      timerIntervalRef.current = window.setInterval(() => {
        useTimerStore
          .getState()
          .updateTimer(
            useTimerStore.getState().timerRemaining - TIMER_UPDATE_INTERVAL_MS
          );

        const remaining = useTimerStore.getState().timerRemaining;
        if (remaining <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          useTimerStore.setState({ state: "completed" });
        }
      }, TIMER_UPDATE_INTERVAL_MS);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [state]);

  const handleStartCountdown = () => {
    startCountdown();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="timer-view">
      <div
        className="timer-view__progress-bar"
        style={{ width: `${getProgress()}%` }}
      />

      <div className="timer-view__content">
        <Headline>{EXERCISE_NAME}</Headline>
        <Paragraph>{EXERCISE_DESCRIPTION}</Paragraph>

        {state === "idle" && (
          <div className="timer-view__actions">
            <Button onClick={handleStartCountdown}>Start Countdown</Button>
          </div>
        )}

        {state === "countdown" && (
          <div className="timer-view__countdown">
            <Headline>{Math.ceil(countdownRemaining / 1000)}</Headline>
          </div>
        )}

        {state === "running" && (
          <div className="timer-view__timer">
            <Headline>{formatTime(timerRemaining)}</Headline>
          </div>
        )}

        {state === "completed" && (
          <div className="timer-view__completed">
            <Headline>Exercise Complete!</Headline>
            <div className="timer-view__actions">
              <Button onClick={handleReset}>Start Over</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
