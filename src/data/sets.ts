export interface Set {
  id: string;
  name: string;
  durationSeconds: number;
  description: string;
  isRest: boolean;
  isTimed: boolean;
}

export const DEFAULT_SETS: Set[] = [
  {
    id: "1",
    name: "Pushups",
    durationSeconds: 3,
    description: "Do as many pushups as you can in the given time.",
    isRest: false,
    isTimed: true,
  },
  {
    id: "2",
    name: "Rest",
    durationSeconds: 6,
    description: "Take a break and prepare for the next set.",
    isRest: true,
    isTimed: true,
  },
  {
    id: "3",
    name: "Pushups",
    durationSeconds: 3,
    description: "Do as many pushups as you can until failure.",
    isRest: false,
    isTimed: false,
  },
  {
    id: "4",
    name: "Pushups",
    durationSeconds: 3,
    description: "Do as many pushups as you can in the given time.",
    isRest: false,
    isTimed: true,
  },
];
