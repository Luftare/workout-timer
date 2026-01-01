import "./SetCard.css";
import { Set, isRepSet, isTimedSet, isRest } from "../../data/workouts";
import {
  getActualReps,
  getActualDuration,
  getRestDuration,
} from "../../utils/volume";

interface SetCardProps {
  set: Set;
  volume: number;
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
};

export const SetCard = ({ set, volume }: SetCardProps) => {
  let displayValue: string = "";

  if (isRepSet(set)) {
    const actualReps = getActualReps(set, volume);
    displayValue = `${actualReps}x`;
  } else if (isTimedSet(set)) {
    const actualDuration = getActualDuration(set, volume);
    displayValue = formatDuration(actualDuration);
  } else if (isRest(set)) {
    const restDuration = getRestDuration(set);
    displayValue = formatDuration(restDuration);
  }

  const displayName = isRest(set) ? "Rest" : set.name;

  return (
    <div className="set-card">
      <div className="set-card__header">
        <h3 className="set-card__name">{displayName}</h3>
        <span className="set-card__duration">{displayValue}</span>
      </div>
    </div>
  );
};
