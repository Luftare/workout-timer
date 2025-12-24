import { useEffect, useState, useRef } from "react";

interface UseMomentaryDisableResult {
  isDisabled: boolean;
  progress: number; // 0-100
}

/**
 * Hook that temporarily disables a button with a progress indicator
 * @param disableDurationMs - Duration in milliseconds to disable. 0 or undefined means no disable.
 * @returns Object with isDisabled state and progress (0-100)
 */
export function useMomentaryDisable(
  disableDurationMs: number | undefined
): UseMomentaryDisableResult {
  const [isDisabled, setIsDisabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If duration is 0 or undefined, don't disable
    if (!disableDurationMs || disableDurationMs <= 0) {
      setIsDisabled(false);
      setProgress(0);
      return;
    }

    // Start the disable period
    setIsDisabled(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    const updateInterval = 50; // Update every 50ms for smooth animation

    intervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const progressValue = Math.min((elapsed / disableDurationMs) * 100, 100);

      setProgress(progressValue);

      if (elapsed >= disableDurationMs) {
        setIsDisabled(false);
        setProgress(100);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [disableDurationMs]);

  return { isDisabled, progress };
}

