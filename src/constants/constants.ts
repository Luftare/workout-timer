// Timer durations
export const COUNTDOWN_DURATION_MS = 3000;

// Timer update interval
export const TIMER_UPDATE_INTERVAL_MS = 100;

// Audio settings
export const BEEP_HIGH_PITCH_FREQUENCY_HZ = 800;
export const BEEP_HIGH_PITCH_DURATION_MS = 100;
export const BEEP_VOLUME = 0.9;

// UI settings
export const NON_TIMED_SET_BUTTON_DISABLE_DURATION_MS = 3000;

// Commitment levels and volume
export type CommitmentLevel =
  | "try-it"
  | "easy-win"
  | "comfortable"
  | "standard"
  | "push-it";

export const COMMITMENT_LEVELS: Record<
  CommitmentLevel,
  { label: string; multiplier: number; percentage: number }
> = {
  "try-it": { label: "Try it", multiplier: 0.25, percentage: 25 },
  "easy-win": { label: "Easy win", multiplier: 0.5, percentage: 50 },
  comfortable: { label: "Comfortable", multiplier: 0.75, percentage: 75 },
  standard: { label: "Standard", multiplier: 1.0, percentage: 100 },
  "push-it": { label: "Push it", multiplier: 1.5, percentage: 150 },
};

export const DEFAULT_COMMITMENT_LEVEL: CommitmentLevel = "standard";

// localStorage key constants
export const COMMITMENT_STORAGE_KEY_PREFIX = "workout-";
export const COMMITMENT_STORAGE_KEY_SUFFIX = "-commitment";

/**
 * Get localStorage key for a workout's commitment level
 * @param workoutId - The workout ID
 * @returns localStorage key string
 */
export function getCommitmentStorageKey(workoutId: string): string {
  return `${COMMITMENT_STORAGE_KEY_PREFIX}${workoutId}${COMMITMENT_STORAGE_KEY_SUFFIX}`;
}

/**
 * Validates that a string is a valid commitment level
 * @param level - String to validate
 * @returns true if valid commitment level, false otherwise
 */
export function isValidCommitmentLevel(
  level: string
): level is CommitmentLevel {
  return Object.keys(COMMITMENT_LEVELS).includes(level);
}

/**
 * Convert commitment level to volume multiplier
 * @param level - Commitment level string
 * @returns Volume multiplier (0.25 to 1.5)
 */
export function getVolumeFromCommitment(level: CommitmentLevel): number {
  return COMMITMENT_LEVELS[level].multiplier;
}
