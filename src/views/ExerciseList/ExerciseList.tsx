import { useNavigate } from "react-router-dom";
import { useTimerStore } from "../../store/timerStore";
import { Nav } from "../../components/Nav/Nav";
import { SetCard } from "../../components/SetCard/SetCard";
import { Button } from "../../components/Button/Button";
import "./ExerciseList.css";

export const ExerciseList = () => {
  const navigate = useNavigate();
  const selectedWorkout = useTimerStore((state) => state.selectedWorkout);
  const setSets = useTimerStore((state) => state.setSets);

  const handleStart = () => {
    if (selectedWorkout) {
      setSets(selectedWorkout.sets);
      navigate("/timer");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleExit = () => {
    navigate("/");
  };

  if (!selectedWorkout) {
    return (
      <div className="exercise-list">
        <Nav onExit={handleExit} />
        <div className="exercise-list__content">
          <p>No workout selected. Please select a workout from the home screen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-list">
      <Nav onBack={handleBack} onExit={handleExit} />
      <div className="exercise-list__content">
        <div className="exercise-list__exercises">
          {selectedWorkout.sets.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </div>
        <div className="exercise-list__actions">
          <Button onClick={handleStart}>Start</Button>
        </div>
      </div>
    </div>
  );
};

