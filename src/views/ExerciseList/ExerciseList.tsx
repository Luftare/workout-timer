import { useNavigate } from "react-router-dom";
import { useTimerStore } from "../../store/timerStore";
import { DEFAULT_SETS } from "../../data/sets";
import { Nav } from "../../components/Nav/Nav";
import { SetCard } from "../../components/SetCard/SetCard";
import { Button } from "../../components/Button/Button";
import "./ExerciseList.css";

export const ExerciseList = () => {
  const navigate = useNavigate();
  const setSets = useTimerStore((state) => state.setSets);

  const handleStart = () => {
    setSets(DEFAULT_SETS);
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
          {DEFAULT_SETS.map((set) => (
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

