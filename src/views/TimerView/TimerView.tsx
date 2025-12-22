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

  // Boolean flags
  const isNonTimedSet = currentSet !== null && !currentSet.isTimed;
  const isTimedSet = currentSet !== null && currentSet.isTimed;
  const isCountdownState = state === "countdown";
  const isRunningState = state === "running";
  const isIdleState = state === "idle";
  const isCompletedState = state === "completed";
  const isPausedState = state === "paused";
  const isCurrentSetRest = currentSet?.isRest === true;
  const isNextSetNotRest = nextSetData !== null && !nextSetData.isRest;
  const shouldShowProgressBar = !isCountdownState && isTimedSet;
  const completedLastSet = isLastSet() && isCompletedState;

  // Format time in MM:SS format
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage (0-100)
  const getProgress = (): number => {
    if (!isTimedSet) return 0;

    if (isCountdownState) {
      return (
        ((COUNTDOWN_DURATION_MS - countdownRemaining) / COUNTDOWN_DURATION_MS) *
        100
      );
    }
    const isTimerActive = isRunningState || isPausedState;
    if (isTimerActive && currentSet) {
      const setDurationMs = currentSet.durationSeconds * 1000;
      return ((setDurationMs - timerRemaining) / setDurationMs) * 100;
    }
    return 0;
  };

  const stepIndicator = currentSet
    ? `${currentSetIndex + 1} of ${sets.length}`
    : "";

  // Handle countdown (only for timed sets)
  useEffect(() => {
    const shouldRunCountdown = isCountdownState && isTimedSet;
    if (shouldRunCountdown) {
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
  }, [state, currentSet?.isTimed]);

  // Handle timer (only for timed sets)
  useEffect(() => {
    const shouldRunTimer = isRunningState && isTimedSet;
    if (shouldRunTimer) {
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

          const hasCurrentSet = currentSetData !== null;
          const hasNextSet = nextSetData !== null;
          const isCurrentSetRest = currentSetData?.isRest === true;
          const isNextSetRest = nextSetData?.isRest === true;
          const isNextSetNotRest = nextSetData !== null && !nextSetData.isRest;

          const shouldMoveToNextSet =
            hasCurrentSet && isCurrentSetRest && hasNextSet && isNextSetNotRest;
          const shouldAutoStartRest =
            hasCurrentSet && !isCurrentSetRest && hasNextSet && isNextSetRest;

          if (shouldMoveToNextSet) {
            store.nextSet();
          } else if (shouldAutoStartRest) {
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
  }, [state, currentSetIndex, currentSet?.isTimed]);

  const handleStartCountdown = () => {
    startCountdown();
  };

  const handleDone = () => {
    const isLast = isLastSet();
    if (isLast) {
      navigate("/exercises");
      reset();
      return;
    }

    const nextSetInfo = getNextSet();
    const hasNextSet = nextSetInfo !== null;
    const isNextRest = nextSetInfo?.isRest === true;

    if (hasNextSet && isNextRest) {
      startRestAutomatically();
    } else {
      nextSet();
    }
  };

  const handleNext = () => {
    const isLast = isLastSet();
    if (isLast) {
      navigate("/exercises");
      reset();
      return;
    }

    const nextSetInfo = getNextSet();
    const hasNextSet = nextSetInfo !== null;
    const isNextRest = nextSetInfo?.isRest === true;

    if (hasNextSet && isNextRest) {
      startRestAutomatically();
    } else {
      nextSet();
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

  // Boolean flags for UI rendering
  const shouldShowNextPreview =
    isRunningState &&
    isCurrentSetRest &&
    nextSetData !== null &&
    isNextSetNotRest;
  const isNonTimedSetInIdle = isNonTimedSet && isIdleState;
  const isTimedSetInIdle = isTimedSet && isIdleState;

  const shouldShowCompletedButton = () => {
    if (!isTimedSet || !isCompletedState) {
      return false;
    }
    const isLast = isLastSet();
    const hasNextNotRest = isNextSetNotRest;
    return isLast || hasNextNotRest;
  };

  const shouldShowButton =
    isNonTimedSetInIdle || isTimedSetInIdle || shouldShowCompletedButton();

  // Functions for button behavior
  const getButtonOnClick = () => {
    if (isNonTimedSet) {
      return handleDone;
    }
    if (isIdleState) {
      return handleStartCountdown;
    }
    return handleNext;
  };

  const getButtonText = () => {
    if (isNonTimedSet) {
      const isLast = isLastSet();
      return isLast ? "Finish" : "Done";
    }
    if (isIdleState) {
      return "Start Countdown";
    }
    const isLast = isLastSet();
    return isLast ? "Finish" : "Next";
  };

  let timingMessage = "";
  if (isTimedSet) {
    if (isRunningState) {
      timingMessage = formatTime(timerRemaining);
    } else {
      // Show set duration in 01:20 format
      timingMessage = formatTime(currentSet.durationSeconds * 1000);
    }
  }

  const exerciseContent = (
    <>
      <Headline>
        {currentSet.name} {timingMessage}
      </Headline>
      <Paragraph>{currentSet.description}</Paragraph>
    </>
  );

  const exerciseCompletedContent = (
    <>
      <Headline>Exercise Completed</Headline>
      <Paragraph>Well done!</Paragraph>
    </>
  );

  return (
    <div className="timer-view">
      <Nav onBack={handleBack} centerContent={<span>{stepIndicator}</span>} />
      {shouldShowProgressBar && (
        <div
          className="timer-view__progress-bar"
          style={{ width: `${getProgress()}%` }}
        />
      )}

      <div className="timer-view__main">
        <div className="timer-view__content">
          {completedLastSet ? exerciseCompletedContent : exerciseContent}

          {/* Show next set preview during rest */}
          {shouldShowNextPreview && (
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

      {/* Show button for non-timed sets or timed sets in idle/completed state */}
      {shouldShowButton && (
        <div className="timer-view__actions">
          <Button onClick={getButtonOnClick()}>{getButtonText()}</Button>
        </div>
      )}

      {/* Countdown overlay modal */}
      {isCountdownState && isTimedSet && (
        <div className="timer-view__countdown-overlay">
          <div className="timer-view__countdown-content">
            <div className="timer-view__countdown-number">
              {Math.ceil(countdownRemaining / 1000)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
