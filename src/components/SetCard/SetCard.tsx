import "./SetCard.css";
import { Set } from "../../data/workouts";

interface SetCardProps {
  set: Set;
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

export const SetCard = ({ set }: SetCardProps) => {
  return (
    <div className="set-card">
      <div className="set-card__header">
        <h3 className="set-card__name">{set.name}</h3>
        <span className="set-card__duration">
          {set.isTimed ? formatDuration(set.durationSeconds) : "-"}
        </span>
      </div>
      <p className="set-card__description">{set.description}</p>
    </div>
  );
};
