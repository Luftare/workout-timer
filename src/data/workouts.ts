// Set type constants
export const SET_TYPE_TIMED = "timed" as const;
export const SET_TYPE_REPS = "reps" as const;
export const SET_TYPE_REST = "rest" as const;

// Discriminated union types
export interface BaseSet {
  id: string;
  name: string;
}

export interface TimedSet extends BaseSet {
  type: typeof SET_TYPE_TIMED;
  durationSeconds: number; // Base duration (before volume adjustment)
  description: string;
}

export interface RepSet extends BaseSet {
  type: typeof SET_TYPE_REPS;
  reps: number; // Base reps value (before volume adjustment)
  description: string;
}

export interface Rest {
  type: typeof SET_TYPE_REST;
  id: string;
  durationSeconds: number; // Not affected by volume multiplier
}

export type Set = TimedSet | RepSet | Rest;

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

export function isRest(set: Set): set is Rest {
  return set.type === SET_TYPE_REST;
}

// Default workout data
export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: "debug",
    name: "Debug Workout",
    description: "Quick 2-set workout for testing (2 seconds each)",
    sets: [
      {
        type: SET_TYPE_TIMED,
        id: "1.1",
        name: "Pushups",
        durationSeconds: 2,
        description: "Do pushups until the timer runs out.",
      },
      {
        type: SET_TYPE_REPS,
        id: "0",
        name: "Pushups",
        reps: 10,
        description: "Do pushups until failure.",
      },
      {
        type: SET_TYPE_TIMED,
        id: "1.2",
        name: "Pushups",
        durationSeconds: 2,
        description: "Do pushups until the timer runs out.",
      },
      {
        type: SET_TYPE_REST,
        id: "2",
        durationSeconds: 2,
      },
      {
        type: SET_TYPE_TIMED,
        id: "3",
        name: "Pull-ups",
        durationSeconds: 2,
        description: "Do pull-ups until the timer runs out.",
      },
    ],
  },
  {
    id: "beginner-calisthenics",
    name: "Beginner Calisthenics",
    description: "A basic calisthenics without any equipment",
    sets: [
      {
        type: SET_TYPE_REPS,
        id: "1",
        name: "Pushups",
        reps: 10,
        description: "10 reps",
      },
      {
        type: SET_TYPE_REPS,
        id: "1.2",
        name: "Pushups",
        reps: 10,
        description: "10 reps",
      },
      {
        type: SET_TYPE_REPS,
        id: "1.3",
        name: "Pushups",
        reps: 10,
        description: "10 reps",
      },
      {
        type: SET_TYPE_TIMED,
        id: "2",
        name: "Hollow Body Hold",
        durationSeconds: 30,
        description: "At your back, lift your hands and feet off the ground.",
      },
      {
        type: SET_TYPE_TIMED,
        id: "3",
        name: "Hollow Body Hold",
        durationSeconds: 30,
        description: "At your back, lift your hands and feet off the ground.",
      },
      {
        type: SET_TYPE_TIMED,
        id: "4",
        name: "Hollow Body Hold",
        durationSeconds: 30,
        description: "At your back, lift your hands and feet off the ground.",
      },
      {
        type: SET_TYPE_REPS,
        id: "5",
        name: "Pike Pushups",
        reps: 10,
        description: "10 reps",
      },
      {
        type: SET_TYPE_REPS,
        id: "5.1",
        name: "Pike Pushups",
        reps: 10,
        description: "10 reps",
      },
      {
        type: SET_TYPE_REPS,
        id: "5.2",
        name: "Pike Pushups",
        reps: 10,
        description: "10 reps",
      },
      {
        type: SET_TYPE_TIMED,
        id: "6",
        name: "L-Sit",
        durationSeconds: 10,
        description: "Sit on the ground, lift your body up with your arms.",
      },
      {
        type: SET_TYPE_TIMED,
        id: "7",
        name: "L-Sit",
        durationSeconds: 10,
        description: "Sit on the ground, lift your body up with your arms.",
      },
      {
        type: SET_TYPE_TIMED,
        id: "8",
        name: "L-Sit",
        durationSeconds: 10,
        description: "Sit on the ground, lift your body up with your arms.",
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
        description: "Jump and spread your legs while raising your arms.",
      },
      {
        type: SET_TYPE_REST,
        id: "2",
        durationSeconds: 30,
      },
      {
        type: SET_TYPE_TIMED,
        id: "3",
        name: "High Knees",
        durationSeconds: 30,
        description: "Run in place, bringing your knees up high.",
      },
      {
        type: SET_TYPE_REST,
        id: "4",
        durationSeconds: 30,
      },
      {
        type: SET_TYPE_REPS,
        id: "5",
        name: "Burpees",
        reps: 10,
        description: "Do as many burpees as you can.",
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
        description: "Do as many pushups as you can in the given time.",
      },
      {
        type: SET_TYPE_REST,
        id: "2",
        durationSeconds: 60,
      },
      {
        type: SET_TYPE_TIMED,
        id: "3",
        name: "Squats",
        durationSeconds: 45,
        description: "Do as many squats as you can in the given time.",
      },
      {
        type: SET_TYPE_REST,
        id: "4",
        durationSeconds: 60,
      },
      {
        type: SET_TYPE_TIMED,
        id: "5",
        name: "Plank",
        durationSeconds: 60,
        description: "Hold a plank position for as long as you can.",
      },
    ],
  },
];
