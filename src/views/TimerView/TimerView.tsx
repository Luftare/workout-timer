import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimerStore } from "../../store/timerStore";
import { Button } from "../../components/Button/Button";
import { Headline } from "../../components/Headline/Headline";
import { Paragraph } from "../../components/Paragraph/Paragraph";
import { Nav } from "../../components/Nav/Nav";
import { MultiSetIndicator } from "../../components/MultiSetIndicator/MultiSetIndicator";
import {
  COUNTDOWN_DURATION_MS,
  TIMER_UPDATE_INTERVAL_MS,
  NON_TIMED_SET_BUTTON_DISABLE_DURATION_MS,
} from "../../constants/constants";
import { audioEngine } from "../../utils/audio";
import { wakeLockManager } from "../../utils/wakeLock";
import { findSetSequence } from "../../utils/setSequence";
import confetti from "canvas-confetti";
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
  const countdownBeepPlayedRef = useRef<boolean>(false);
  const confettiTriggeredRef = useRef<boolean>(false);

  // State to manage disableDurationMs with random variation for Safari compatibility
  const [buttonDisableDurationMs, setButtonDisableDurationMs] = useState<
    number | undefined
  >(undefined);

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
          // Play beep when countdown finishes (timer starts)
          if (!countdownBeepPlayedRef.current) {
            audioEngine.playHighPitchBeep();
            countdownBeepPlayedRef.current = true;
          }
          useTimerStore.getState().startTimer();
        }
      }, TIMER_UPDATE_INTERVAL_MS);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      // Reset beep flag when countdown ends
      countdownBeepPlayedRef.current = false;
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
          // Play beep when timer completes
          audioEngine.playLowPitchBeep();

          const store = useTimerStore.getState();
          const currentSetData = store.getCurrentSet();
          const nextSetData = store.getNextSet();
          const currentIndex = store.currentSetIndex;
          const allSets = store.sets;

          const hasCurrentSet = currentSetData !== null;
          const hasNextSet = nextSetData !== null;
          const isCurrentSetRest = currentSetData?.isRest === true;
          const isNextSetRest = nextSetData?.isRest === true;
          const isNextSetNotRest = nextSetData !== null && !nextSetData.isRest;

          // Check if current set is part of a multi-set sequence
          const sequence = currentSetData
            ? findSetSequence(allSets, currentIndex)
            : null;
          const isLastInSequence =
            sequence === null ||
            currentIndex === sequence.indices[sequence.indices.length - 1];

          const shouldMoveToNextSet =
            hasCurrentSet && isCurrentSetRest && hasNextSet && isNextSetNotRest;
          const shouldAutoStartRest =
            hasCurrentSet && !isCurrentSetRest && hasNextSet && isNextSetRest;
          const shouldAutoAdvanceInSequence =
            hasCurrentSet &&
            !isCurrentSetRest &&
            sequence !== null &&
            !isLastInSequence &&
            hasNextSet;

          if (shouldMoveToNextSet) {
            store.nextSet();
          } else if (shouldAutoStartRest) {
            store.startRestAutomatically();
          } else if (shouldAutoAdvanceInSequence) {
            // Auto-advance to next set in multi-set sequence
            store.nextSet();
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
      wakeLockManager.release();
      navigate("/");
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
      wakeLockManager.release();
      navigate("/");
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
    wakeLockManager.release();
    navigate("/workout-detail");
    reset();
  };

  const handleExit = () => {
    wakeLockManager.release();
    navigate("/");
    reset();
  };

  // Redirect to home if no set is selected
  useEffect(() => {
    if (!currentSet) {
      navigate("/", { replace: true });
    }
  }, [currentSet, navigate]);

  // Update disableDurationMs when set or state changes
  // Add random variation (0-10ms) to ensure prop changes are detected in Safari
  useEffect(() => {
    const shouldDisable = isNonTimedSet && isIdleState;
    if (!shouldDisable) {
      setButtonDisableDurationMs(undefined);
      return;
    }
    // Add small random variation to base duration to ensure Safari detects prop changes
    const randomVariation = Math.random() * 10;
    const disableDuration =
      NON_TIMED_SET_BUTTON_DISABLE_DURATION_MS + randomVariation;
    setButtonDisableDurationMs(disableDuration);
  }, [currentSetIndex, isNonTimedSet, isIdleState]);

  // Don't render if no set (redirect will happen)
  if (!currentSet) {
    return null;
  }

  // Boolean flags for UI rendering
  const shouldShowNextPreview =
    isRunningState &&
    isCurrentSetRest &&
    nextSetData !== null &&
    isNextSetNotRest;

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
      return isLast ? "Finish" : "Next";
    }
    if (isIdleState) {
      return "Start Countdown";
    }
    const isLast = isLastSet();
    return isLast ? "Finish" : "Next";
  };

  const getButtonDisabled = (): boolean => {
    // Disable during countdown
    if (isCountdownState) {
      return true;
    }
    // Disable during running timed set
    if (isRunningState && isTimedSet) {
      return true;
    }
    // Button is enabled in all other states (idle, completed, paused, non-timed sets)
    return false;
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

  // Find set sequence for multi-set indicator
  const setSequence = currentSet
    ? findSetSequence(sets, currentSetIndex)
    : null;

  const workoutContent = (
    <>
      <Headline>
        {currentSet.name} {timingMessage}
      </Headline>
      <Paragraph>{currentSet.description}</Paragraph>
      {setSequence && (
        <MultiSetIndicator
          totalSets={sets.length}
          currentIndex={currentSetIndex}
          sequenceIndices={setSequence.indices}
        />
      )}
    </>
  );

  const workoutCompletedContent = (
    <>
      <Headline>Workout Completed</Headline>
      <Paragraph>Well done!</Paragraph>
    </>
  );

  // Manage wake lock
  useEffect(() => {
    // Ensure wake lock is active when timer view is mounted
    wakeLockManager.request();

    // Re-request wake lock if it was released (e.g., when user switches tabs)
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        !wakeLockManager.isActive()
      ) {
        wakeLockManager.request();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup: release wake lock when component unmounts
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockManager.release();
    };
  }, []);

  // Trigger confetti when workout is completed
  useEffect(() => {
    if (completedLastSet && !confettiTriggeredRef.current) {
      confettiTriggeredRef.current = true;

      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 2000,
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }

    // Reset confetti trigger when not completed
    if (!completedLastSet) {
      confettiTriggeredRef.current = false;
    }
  }, [completedLastSet]);

  return (
    <div className="timer-view">
      <Nav
        onBack={handleBack}
        onExit={handleExit}
        centerContent={<span>{stepIndicator}</span>}
      />
      {shouldShowProgressBar && (
        <div
          className="timer-view__progress-bar"
          style={{ width: `${getProgress()}%` }}
        />
      )}

      <div className="timer-view__main">
        <div className="timer-view__content">
          {completedLastSet ? workoutCompletedContent : workoutContent}

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

      {/* Always show button to prevent layout jumps */}
      <div className="timer-view__actions">
        <Button
          onClick={getButtonOnClick()}
          disabled={getButtonDisabled()}
          disableDurationMs={buttonDisableDurationMs}
        >
          {getButtonText()}
        </Button>
      </div>

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
