// Legacy types for migration
export interface OldSet {
  id: string;
  name: string;
  durationSeconds: number;
  description: string;
  isRest: boolean;
  isTimed: boolean;
}

// New discriminated union types
export interface BaseSet {
  id: string;
  name: string;
}

export interface TimedSet extends BaseSet {
  type: "timed";
  durationSeconds: number; // Base duration (before volume adjustment)
  description: string;
}

export interface RepSet extends BaseSet {
  type: "reps";
  reps: number; // Base reps value (before volume adjustment)
  description: string;
}

export interface Rest {
  type: "rest";
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
  return set.type === "reps";
}

export function isTimedSet(set: Set): set is TimedSet {
  return set.type === "timed";
}

export function isRest(set: Set): set is Rest {
  return set.type === "rest";
}

// Migration functions
/**
 * Migrates old Set format to new discriminated union format
 */
function migrateSet(oldSet: OldSet): Set {
  if (oldSet.isRest) {
    return {
      type: "rest",
      id: oldSet.id,
      durationSeconds: oldSet.durationSeconds,
    };
  }

  if (oldSet.isTimed) {
    return {
      type: "timed",
      id: oldSet.id,
      name: oldSet.name,
      durationSeconds: oldSet.durationSeconds,
      description: oldSet.description,
    };
  }

  // Rep-based set: extract reps from description
  const repsMatch = oldSet.description.match(/(\d+)\s*reps?/i);
  const reps = repsMatch ? parseInt(repsMatch[1], 10) : 10; // Default to 10 if not found

  return {
    type: "reps",
    id: oldSet.id,
    name: oldSet.name,
    reps: reps,
    description: oldSet.description,
  };
}

/**
 * Migrates old Workout format to new format
 */
function migrateWorkout(oldWorkout: {
  id: string;
  name: string;
  description: string;
  sets: OldSet[];
}): Workout {
  return {
    id: oldWorkout.id,
    name: oldWorkout.name,
    description: oldWorkout.description,
    sets: oldWorkout.sets.map(migrateSet),
  };
}

// Legacy workout data (for migration)
const OLD_DEFAULT_WORKOUTS: Array<{
  id: string;
  name: string;
  description: string;
  sets: OldSet[];
}> = [
  {
    id: "debug",
    name: "Debug Workout",
    description: "Quick 2-set workout for testing (2 seconds each)",
    sets: [
      {
        id: "1.1",
        name: "Pushups",
        durationSeconds: 2,
        description: "Do pushups until the timer runs out.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "0",
        name: "Pushups",
        durationSeconds: 2,
        description: "Do pushups until failure.",
        isRest: false,
        isTimed: false,
      },
      {
        id: "1.2",
        name: "Pushups",
        durationSeconds: 2,
        description: "Do pushups until the timer runs out.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "2",
        name: "Rest",
        durationSeconds: 2,
        description: "Take a break and prepare for the next set.",
        isRest: true,
        isTimed: true,
      },
      {
        id: "3",
        name: "Pull-ups",
        durationSeconds: 2,
        description: "Do pull-ups until the timer runs out.",
        isRest: false,
        isTimed: true,
      },
    ],
  },
  {
    id: "beginner-calisthenics",
    name: "Beginner Calisthenics",
    description: "A basic calisthenics without any equipment",
    sets: [
      {
        id: "1",
        name: "Pushups",
        durationSeconds: 10,
        description: "10 reps",
        isRest: false,
        isTimed: false,
      },
      {
        id: "1.2",
        name: "Pushups",
        durationSeconds: 10,
        description: "10 reps",
        isRest: false,
        isTimed: false,
      },
      {
        id: "1.3",
        name: "Pushups",
        durationSeconds: 10,
        description: "10 reps",
        isRest: false,
        isTimed: false,
      },
      {
        id: "2",
        name: "Hollow Body Hold",
        durationSeconds: 30,
        description: "At your back, lift your hands and feet off the ground.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "3",
        name: "Hollow Body Hold",
        durationSeconds: 30,
        description: "At your back, lift your hands and feet off the ground.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "4",
        name: "Hollow Body Hold",
        durationSeconds: 30,
        description: "At your back, lift your hands and feet off the ground.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "5",
        name: "Pike Pushups",
        durationSeconds: 10,
        description: "10 reps",
        isRest: false,
        isTimed: false,
      },
      {
        id: "5.1",
        name: "Pike Pushups",
        durationSeconds: 10,
        description: "10 reps",
        isRest: false,
        isTimed: false,
      },
      {
        id: "5.2",
        name: "Pike Pushups",
        durationSeconds: 10,
        description: "10 reps",
        isRest: false,
        isTimed: false,
      },
      {
        id: "6",
        name: "L-Sit",
        durationSeconds: 10,
        description: "Sit on the ground, lift your body up with your arms.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "7",
        name: "L-Sit",
        durationSeconds: 10,
        description: "Sit on the ground, lift your body up with your arms.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "8",
        name: "L-Sit",
        durationSeconds: 10,
        description: "Sit on the ground, lift your body up with your arms.",
        isRest: false,
        isTimed: true,
      },
    ],
  },
  {
    id: "2",
    name: "Quick Cardio",
    description: "A fast-paced cardio workout",
    sets: [
      {
        id: "1",
        name: "Jumping Jacks",
        durationSeconds: 45,
        description: "Jump and spread your legs while raising your arms.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "2",
        name: "Rest",
        durationSeconds: 30,
        description: "Take a short break.",
        isRest: true,
        isTimed: true,
      },
      {
        id: "3",
        name: "High Knees",
        durationSeconds: 30,
        description: "Run in place, bringing your knees up high.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "4",
        name: "Rest",
        durationSeconds: 30,
        description: "Take a short break.",
        isRest: true,
        isTimed: true,
      },
      {
        id: "5",
        name: "Burpees",
        durationSeconds: 20,
        description: "Do as many burpees as you can.",
        isRest: false,
        isTimed: false,
      },
    ],
  },
  {
    id: "3",
    name: "Full Body Strength",
    description: "A comprehensive strength training workout",
    sets: [
      {
        id: "1",
        name: "Pushups",
        durationSeconds: 45,
        description: "Do as many pushups as you can in the given time.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "2",
        name: "Rest",
        durationSeconds: 60,
        description: "Take a break and prepare for the next set.",
        isRest: true,
        isTimed: true,
      },
      {
        id: "3",
        name: "Squats",
        durationSeconds: 45,
        description: "Do as many squats as you can in the given time.",
        isRest: false,
        isTimed: true,
      },
      {
        id: "4",
        name: "Rest",
        durationSeconds: 60,
        description: "Take a break and prepare for the next set.",
        isRest: true,
        isTimed: true,
      },
      {
        id: "5",
        name: "Plank",
        durationSeconds: 60,
        description: "Hold a plank position for as long as you can.",
        isRest: false,
        isTimed: true,
      },
    ],
  },
];

// Migrate old workouts to new format
export const DEFAULT_WORKOUTS: Workout[] =
  OLD_DEFAULT_WORKOUTS.map(migrateWorkout);
