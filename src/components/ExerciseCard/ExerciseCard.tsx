import "./ExerciseCard.css";
import { Exercise } from "../../data/exercises";

interface ExerciseCardProps {
  exercise: Exercise;
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

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  return (
    <div className="exercise-card">
      <div className="exercise-card__header">
        <h3 className="exercise-card__name">{exercise.name}</h3>
        <span className="exercise-card__duration">
          {formatDuration(exercise.durationSeconds)}
        </span>
      </div>
      <p className="exercise-card__description">{exercise.description}</p>
    </div>
  );
};
