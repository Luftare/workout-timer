import { useNavigate } from "react-router-dom";
import { useTimerStore } from "../../store/timerStore";
import { Nav } from "../../components/Nav/Nav";
import { SetCard } from "../../components/SetCard/SetCard";
import { Button } from "../../components/Button/Button";
import { audioEngine } from "../../utils/audio";
import { wakeLockManager } from "../../utils/wakeLock";
import "./WorkoutDetailView.css";

export const WorkoutDetailView = () => {
  const navigate = useNavigate();
  const selectedWorkout = useTimerStore((state) => state.selectedWorkout);
  const setSets = useTimerStore((state) => state.setSets);

  const handleStart = async () => {
    if (selectedWorkout) {
      await audioEngine.initialize();
      await wakeLockManager.request();
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
      <div className="workout-detail">
        <Nav onExit={handleExit} />
        <div className="workout-detail__content">
          <p>No workout selected. Please select a workout from the home screen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-detail">
      <Nav onBack={handleBack} onExit={handleExit} />
      <div className="workout-detail__content">
        <div className="workout-detail__sets">
          {selectedWorkout.sets.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </div>
        <div className="workout-detail__actions">
          <Button onClick={handleStart}>Start</Button>
        </div>
      </div>
    </div>
  );
};

