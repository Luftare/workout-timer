export interface Exercise {
  id: string;
  name: string;
  durationSeconds: number;
  description: string;
  isRest: boolean;
}

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "1",
    name: "Pushups",
    durationSeconds: 3,
    description: "Do as many pushups as you can in the given time.",
    isRest: false,
  },
  {
    id: "2",
    name: "Rest",
    durationSeconds: 6,
    description: "Take a break and prepare for the next exercise.",
    isRest: true,
  },
  {
    id: "3",
    name: "Pushups",
    durationSeconds: 3,
    description: "Do as many pushups as you can in the given time.",
    isRest: false,
  },
];
