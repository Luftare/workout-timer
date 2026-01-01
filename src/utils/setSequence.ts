import { Set } from "../data/workouts";

export interface SetSequence {
  startIndex: number;
  endIndex: number;
  name: string;
  indices: number[];
}

/**
 * Finds consecutive sets with the same name
 * Returns null if the current set is not part of a sequence
 */
export function findSetSequence(
  sets: Set[],
  currentIndex: number
): SetSequence | null {
  if (sets.length === 0 || currentIndex < 0 || currentIndex >= sets.length) {
    return null;
  }

  const currentSet = sets[currentIndex];
  const currentName = currentSet.name;
  let startIndex = currentIndex;
  let endIndex = currentIndex;

  // Find the start of the sequence (go backwards)
  for (let i = currentIndex - 1; i >= 0; i--) {
    const set = sets[i];
    // If name matches, extend sequence backwards
    if (set.name === currentName) {
      startIndex = i;
    } else {
      break;
    }
  }

  // Find the end of the sequence (go forwards)
  for (let i = currentIndex + 1; i < sets.length; i++) {
    const set = sets[i];
    // If name matches, extend sequence forwards
    if (set.name === currentName) {
      endIndex = i;
    } else {
      break;
    }
  }

  // Collect all indices in the sequence
  const indices: number[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const set = sets[i];
    // Only include sets with matching name
    if (set.name === currentName) {
      indices.push(i);
    }
  }

  // Only return sequence if there are multiple sets with the same name
  if (indices.length <= 1) {
    return null;
  }

  return {
    startIndex,
    endIndex,
    name: currentName,
    indices,
  };
}
