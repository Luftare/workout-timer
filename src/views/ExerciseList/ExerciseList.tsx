import { useNavigate } from "react-router-dom";
import { useTimerStore } from "../../store/timerStore";
import { DEFAULT_EXERCISES } from "../../data/exercises";
import { Nav } from "../../components/Nav/Nav";
import { ExerciseCard } from "../../components/ExerciseCard/ExerciseCard";
import { Button } from "../../components/Button/Button";
import "./ExerciseList.css";

export const ExerciseList = () => {
  const navigate = useNavigate();
  const setExercises = useTimerStore((state) => state.setExercises);

  const handleStart = () => {
    setExercises(DEFAULT_EXERCISES);
    navigate("/timer");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="exercise-list">
      <Nav onBack={handleBack} />
      <div className="exercise-list__content">
        <div className="exercise-list__exercises">
          {DEFAULT_EXERCISES.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
        <div className="exercise-list__actions">
          <Button onClick={handleStart}>Start</Button>
        </div>
      </div>
    </div>
  );
};

