import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTimerStore } from "../../store/timerStore";
import { Button } from "../../components/Button/Button";
import { Headline } from "../../components/Headline/Headline";
import { Paragraph } from "../../components/Paragraph/Paragraph";
import { Nav } from "../../components/Nav/Nav";
import {
  COUNTDOWN_DURATION_MS,
  TIMER_UPDATE_INTERVAL_MS,
} from "../../constants/constants";
import "./TimerView.css";

export const TimerView = () => {
  const navigate = useNavigate();
  const {
    state,
    sets,
    currentSetIndex,
    countdownRemaining,
    timerRemaining,
    startCountdown,
    nextSet,
    reset,
    getCurrentSet,
    getNextSet,
    isLastSet,
    startRestAutomatically,
  } = useTimerStore();

  const currentSet = getCurrentSet();
  const nextSetData = getNextSet();

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
    if (!currentSet) return 0;

    if (state === "countdown") {
      return (
        ((COUNTDOWN_DURATION_MS - countdownRemaining) / COUNTDOWN_DURATION_MS) *
        100
      );
    }
    if (state === "running" || state === "paused") {
      const setDurationMs = currentSet.durationSeconds * 1000;
      return ((setDurationMs - timerRemaining) / setDurationMs) * 100;
    }
    return 0;
  };

  const stepIndicator = currentSet
    ? `${currentSetIndex + 1} of ${sets.length}`
    : "";

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
      // Clear any existing interval first
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      // Start new interval
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
          const store = useTimerStore.getState();
          const currentSetData = store.getCurrentSet();
          const nextSetData = store.getNextSet();

          // If current is rest and completes, move to next set (idle state)
          if (
            currentSetData &&
            currentSetData.isRest &&
            nextSetData &&
            !nextSetData.isRest
          ) {
            store.nextSet();
          }
          // Auto-start rest if next set is rest
          else if (
            currentSetData &&
            !currentSetData.isRest &&
            nextSetData &&
            nextSetData.isRest
          ) {
            store.startRestAutomatically();
          } else {
            useTimerStore.setState({ state: "completed" });
          }
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
  }, [state, currentSetIndex]);

  const handleStartCountdown = () => {
    startCountdown();
  };

  const handleNext = () => {
    if (isLastSet()) {
      // Navigate back to exercise list when finished
      navigate("/exercises");
      reset();
    } else {
      const nextSetInfo = getNextSet();
      // If next is rest, auto-start it
      if (nextSetInfo && nextSetInfo.isRest) {
        startRestAutomatically();
      } else {
        nextSet();
      }
    }
  };

  const handleBack = () => {
    navigate("/exercises");
    reset();
  };

  if (!currentSet) {
    return (
      <div className="timer-view">
        <Nav onBack={handleBack} />
        <div className="timer-view__main">
          <div className="timer-view__content">
            <Headline>No set selected</Headline>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="timer-view">
      <Nav onBack={handleBack} centerContent={<span>{stepIndicator}</span>} />
      {state !== "countdown" && (
        <div
          className="timer-view__progress-bar"
          style={{ width: `${getProgress()}%` }}
        />
      )}

      <div className="timer-view__main">
        <div className="timer-view__content">
          <Headline>{currentSet.name}</Headline>
          <Paragraph>{currentSet.description}</Paragraph>

          {state === "countdown" && (
            <div className="timer-view__countdown">
              <Headline>
                {"Get Ready"} {Math.ceil(countdownRemaining / 1000)}
              </Headline>
            </div>
          )}

          {state === "running" && (
            <div className="timer-view__timer">
              <Headline>{formatTime(timerRemaining)}</Headline>
            </div>
          )}

          {state === "completed" && (
            <div className="timer-view__completed">
              <Headline>
                {isLastSet() ? "Exercise Completed" : "Set Completed"}
              </Headline>
            </div>
          )}

          {/* Show next set preview during rest */}
          {state === "running" &&
            currentSet?.isRest &&
            nextSetData &&
            !nextSetData.isRest && (
              <div className="timer-view__next-preview">
                <div className="timer-view__next-preview-content">
                  <h3 className="timer-view__next-preview-title">
                    Next: {nextSetData.name}
                  </h3>
                  <p className="timer-view__next-preview-description">
                    {nextSetData.description}
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>

      {(state === "idle" ||
        (state === "completed" && !nextSetData?.isRest)) && (
        <div className="timer-view__actions">
          <Button
            onClick={state === "idle" ? handleStartCountdown : handleNext}
          >
            {state === "idle"
              ? "Start Countdown"
              : isLastSet()
              ? "Finish"
              : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
};
