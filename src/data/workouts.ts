// Set type constants
export const SET_TYPE_TIMED = "timed" as const;
export const SET_TYPE_REPS = "reps" as const;

// Set name constants
export const SET_NAME_PUSHUPS = "Pushups";
export const SET_NAME_HOLLOW_BODY_HOLD = "Hollow Body Hold";
export const SET_NAME_PIKE_PUSHUPS = "Pike Pushups";
export const SET_NAME_L_SIT = "L-Sit";
export const SET_NAME_JUMPING_JACKS = "Jumping Jacks";
export const SET_NAME_HIGH_KNEES = "High Knees";
export const SET_NAME_BURPEES = "Burpees";
export const SET_NAME_SQUATS = "Squats";
export const SET_NAME_PLANK = "Plank";
export const SET_NAME_PULL_UPS = "Pull-ups";

// Discriminated union types
export interface BaseSet {
  id: string;
  name: string;
}

export interface TimedSet extends BaseSet {
  type: typeof SET_TYPE_TIMED;
  durationSeconds: number; // Base duration (before volume adjustment)
}

export interface RepSet extends BaseSet {
  type: typeof SET_TYPE_REPS;
  reps: number; // Base reps value (before volume adjustment)
}

export type Set = TimedSet | RepSet;

export interface Workout {
  id: string;
  name: string;
  description: string;
  sets: Set[];
}

// Type guards
export function isRepSet(set: Set): set is RepSet {
  return set.type === SET_TYPE_REPS;
}

export function isTimedSet(set: Set): set is TimedSet {
  return set.type === SET_TYPE_TIMED;
}

// Helper functions to create sets
let idCounter = 1;

function createRepSet(name: string, reps: number): RepSet {
  return {
    type: SET_TYPE_REPS,
    id: String(idCounter++),
    name,
    reps,
  };
}

function createTimedSet(name: string, durationSeconds: number): TimedSet {
  return {
    type: SET_TYPE_TIMED,
    id: String(idCounter++),
    name,
    durationSeconds,
  };
}

// Default workout data
export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: "quick-calisthenics",
    name: "Quick Calisthenics",
    description: "A quick calisthenics workout",
    sets: [
      createRepSet(SET_NAME_PUSHUPS, 10),
      createRepSet(SET_NAME_PUSHUPS, 10),
      createRepSet(SET_NAME_PUSHUPS, 10),
      createTimedSet(SET_NAME_HOLLOW_BODY_HOLD, 30),
      createTimedSet(SET_NAME_HOLLOW_BODY_HOLD, 30),
      createTimedSet(SET_NAME_HOLLOW_BODY_HOLD, 30),
      createRepSet(SET_NAME_PIKE_PUSHUPS, 10),
      createRepSet(SET_NAME_PIKE_PUSHUPS, 10),
      createRepSet(SET_NAME_PIKE_PUSHUPS, 10),
      createTimedSet(SET_NAME_L_SIT, 10),
      createTimedSet(SET_NAME_L_SIT, 10),
      createTimedSet(SET_NAME_L_SIT, 10),
    ],
  },
  {
    id: "2",
    name: "Quick Cardio",
    description: "A fast-paced cardio workout",
    sets: [
      createTimedSet(SET_NAME_JUMPING_JACKS, 45),
      createTimedSet(SET_NAME_HIGH_KNEES, 30),
      createRepSet(SET_NAME_BURPEES, 10),
    ],
  },
  {
    id: "3",
    name: "Full Body Strength",
    description: "A comprehensive strength training workout",
    sets: [
      createTimedSet(SET_NAME_PUSHUPS, 45),
      createTimedSet(SET_NAME_SQUATS, 45),
      createTimedSet(SET_NAME_PLANK, 60),
    ],
  },
  {
    id: "debug",
    name: "Debug Workout",
    description: "Not a real workout, just for debugging...",
    sets: [
      createTimedSet(SET_NAME_PUSHUPS, 2),
      createRepSet(SET_NAME_PUSHUPS, 10),
      createTimedSet(SET_NAME_PUSHUPS, 2),
      createTimedSet(SET_NAME_PULL_UPS, 2),
    ],
  },
];
