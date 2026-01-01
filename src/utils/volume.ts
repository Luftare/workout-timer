import { RepSet, TimedSet, Rest } from "../data/workouts";

const MINIMUM_REPS = 1;
const MINIMUM_DURATION_SECONDS = 3;

/**
 * Get actual reps after applying volume multiplier
 * @param set - RepSet with base reps value
 * @param volume - Volume multiplier (0.25 to 1.25 from commitment levels)
 * @returns Actual reps to perform (minimum 1)
 */
export function getActualReps(set: RepSet, volume: number): number {
  return Math.max(MINIMUM_REPS, Math.round(set.reps * volume));
}

/**
 * Get actual duration after applying volume multiplier
 * @param set - TimedSet with base duration
 * @param volume - Volume multiplier (0.25 to 1.25 from commitment levels)
 * @returns Actual duration in seconds (minimum 3)
 */
export function getActualDuration(set: TimedSet, volume: number): number {
  return Math.max(MINIMUM_DURATION_SECONDS, Math.round(set.durationSeconds * volume));
}

/**
 * Get duration for rest sets (not affected by volume)
 * @param set - Rest set
 * @returns Duration in seconds
 */
export function getRestDuration(set: Rest): number {
  return set.durationSeconds;
}

