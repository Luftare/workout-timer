import { Set } from "./sets";

export interface Workout {
  id: string;
  name: string;
  description: string;
  sets: Set[];
}

export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: "1",
    name: "Morning Pushups",
    description: "A quick pushup routine to start your day",
    sets: [
      {
        id: "1",
        name: "Pushups",
        durationSeconds: 30,
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
        name: "Pushups",
        durationSeconds: 30,
        description: "Do as many pushups as you can until failure.",
        isRest: false,
        isTimed: false,
      },
      {
        id: "4",
        name: "Pushups",
        durationSeconds: 30,
        description: "Do as many pushups as you can in the given time.",
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

