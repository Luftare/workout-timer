// Set type constants
export const SET_TYPE_TIMED = "timed" as const;
export const SET_TYPE_REPS = "reps" as const;

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

// Default workout data
export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: "quick-calisthenics",
    name: "Quick Calisthenics",
    description: "A quick calisthenics workout",
    sets: [
      {
        type: SET_TYPE_REPS,
        id: "1",
        name: "Pushups",
        reps: 10,
      },
      {
        type: SET_TYPE_REPS,
        id: "1.2",
        name: "Pushups",
        reps: 10,
      },
      {
        type: SET_TYPE_REPS,
        id: "1.3",
        name: "Pushups",
        reps: 10,
      },
      {
        type: SET_TYPE_TIMED,
        id: "2",
        name: "Hollow Body Hold",
        durationSeconds: 30,
      },
      {
        type: SET_TYPE_TIMED,
        id: "3",
        name: "Hollow Body Hold",
        durationSeconds: 30,
      },
      {
        type: SET_TYPE_TIMED,
        id: "4",
        name: "Hollow Body Hold",
        durationSeconds: 30,
      },
      {
        type: SET_TYPE_REPS,
        id: "5",
        name: "Pike Pushups",
        reps: 10,
      },
      {
        type: SET_TYPE_REPS,
        id: "5.1",
        name: "Pike Pushups",
        reps: 10,
      },
      {
        type: SET_TYPE_REPS,
        id: "5.2",
        name: "Pike Pushups",
        reps: 10,
      },
      {
        type: SET_TYPE_TIMED,
        id: "6",
        name: "L-Sit",
        durationSeconds: 10,
      },
      {
        type: SET_TYPE_TIMED,
        id: "7",
        name: "L-Sit",
        durationSeconds: 10,
      },
      {
        type: SET_TYPE_TIMED,
        id: "8",
        name: "L-Sit",
        durationSeconds: 10,
      },
    ],
  },
  {
    id: "2",
    name: "Quick Cardio",
    description: "A fast-paced cardio workout",
    sets: [
      {
        type: SET_TYPE_TIMED,
        id: "1",
        name: "Jumping Jacks",
        durationSeconds: 45,
      },
      {
        type: SET_TYPE_TIMED,
        id: "3",
        name: "High Knees",
        durationSeconds: 30,
      },
      {
        type: SET_TYPE_REPS,
        id: "5",
        name: "Burpees",
        reps: 10,
      },
    ],
  },
  {
    id: "3",
    name: "Full Body Strength",
    description: "A comprehensive strength training workout",
    sets: [
      {
        type: SET_TYPE_TIMED,
        id: "1",
        name: "Pushups",
        durationSeconds: 45,
      },
      {
        type: SET_TYPE_TIMED,
        id: "3",
        name: "Squats",
        durationSeconds: 45,
      },
      {
        type: SET_TYPE_TIMED,
        id: "5",
        name: "Plank",
        durationSeconds: 60,
      },
    ],
  },
  {
    id: "debug",
    name: "Debug Workout",
    description: "Not a real workout, just for debugging...",
    sets: [
      {
        type: SET_TYPE_TIMED,
        id: "1.1",
        name: "Pushups",
        durationSeconds: 2,
      },
      {
        type: SET_TYPE_REPS,
        id: "0",
        name: "Pushups",
        reps: 10,
      },
      {
        type: SET_TYPE_TIMED,
        id: "1.2",
        name: "Pushups",
        durationSeconds: 2,
      },
      {
        type: SET_TYPE_TIMED,
        id: "3",
        name: "Pull-ups",
        durationSeconds: 2,
      },
    ],
  },
];
