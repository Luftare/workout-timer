import "./WorkoutCard.css";
import { Workout } from "../../data/workouts";
import { Button } from "../Button/Button";

interface WorkoutCardProps {
  workout: Workout;
  onSelect: () => void;
}

export const WorkoutCard = ({ workout, onSelect }: WorkoutCardProps) => {
  return (
    <div className="workout-card">
      <div className="workout-card__content">
        <h2 className="workout-card__name">{workout.name}</h2>
        <p className="workout-card__description">{workout.description}</p>
      </div>
      <div className="workout-card__actions">
        <Button onClick={onSelect}>Select</Button>
      </div>
    </div>
  );
};
