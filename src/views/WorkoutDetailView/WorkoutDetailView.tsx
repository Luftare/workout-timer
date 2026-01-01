import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimerStore } from "../../store/timerStore";
import { Nav } from "../../components/Nav/Nav";
import { SetCard } from "../../components/SetCard/SetCard";
import { Button } from "../../components/Button/Button";
import { CommitmentLadder } from "../../components/CommitmentLadder/CommitmentLadder";
import { audioEngine } from "../../utils/audio";
import { wakeLockManager } from "../../utils/wakeLock";
import {
  CommitmentLevel,
  DEFAULT_COMMITMENT_LEVEL,
  getCommitmentStorageKey,
  isValidCommitmentLevel,
  getVolumeFromCommitment,
} from "../../constants/constants";
import "./WorkoutDetailView.css";

export const WorkoutDetailView = () => {
  const navigate = useNavigate();
  const selectedWorkout = useTimerStore((state) => state.selectedWorkout);
  const setSets = useTimerStore((state) => state.setSets);
  const [commitmentLevel, setCommitmentLevel] = useState<CommitmentLevel>(
    DEFAULT_COMMITMENT_LEVEL
  );

  // Initialize commitment level from localStorage
  useEffect(() => {
    if (!selectedWorkout) return;

    const storageKey = getCommitmentStorageKey(selectedWorkout.id);
    const persistedLevel = localStorage.getItem(storageKey);

    if (persistedLevel && isValidCommitmentLevel(persistedLevel)) {
      // Load persisted value
      setCommitmentLevel(persistedLevel);
    } else {
      // Set and persist default
      const defaultLevel: CommitmentLevel = DEFAULT_COMMITMENT_LEVEL;
      setCommitmentLevel(defaultLevel);
      localStorage.setItem(storageKey, defaultLevel);
    }
  }, [selectedWorkout]);

  // Redirect to home if no workout is selected
  useEffect(() => {
    if (!selectedWorkout) {
      navigate("/", { replace: true });
    }
  }, [selectedWorkout, navigate]);

  const handleCommitmentChange = (level: CommitmentLevel) => {
    setCommitmentLevel(level);
    if (selectedWorkout) {
      const storageKey = getCommitmentStorageKey(selectedWorkout.id);
      localStorage.setItem(storageKey, level);
    }
  };

  const handleStart = async () => {
    if (selectedWorkout) {
      await audioEngine.initialize();
      await wakeLockManager.request();
      setSets(selectedWorkout.sets, commitmentLevel);
      navigate("/timer");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleExit = () => {
    navigate("/");
  };

  // Don't render if no workout (redirect will happen)
  if (!selectedWorkout) {
    return null;
  }

  const volume = getVolumeFromCommitment(commitmentLevel);

  return (
    <div className="workout-detail">
      <Nav onBack={handleBack} onExit={handleExit} />
      <div className="workout-detail__content">
        {/* Commitment Ladder */}
        <div className="workout-detail__commitment">
          <label className="workout-detail__commitment-label">Commitment</label>
          <CommitmentLadder
            selectedLevel={commitmentLevel}
            onLevelChange={handleCommitmentChange}
          />
        </div>

        {/* Sets list with volume-adjusted values */}
        <div className="workout-detail__sets">
          <label className="workout-detail__sets-label">Sets</label>
          {selectedWorkout.sets.map((set) => (
            <SetCard key={set.id} set={set} volume={volume} />
          ))}
        </div>
        <div className="workout-detail__actions">
          <Button onClick={handleStart}>Start</Button>
        </div>
      </div>
    </div>
  );
};
