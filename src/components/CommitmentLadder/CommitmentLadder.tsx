import "./CommitmentLadder.css";
import {
  CommitmentLevel,
  COMMITMENT_LEVELS,
} from "../../constants/constants";

interface CommitmentLadderProps {
  selectedLevel: CommitmentLevel;
  onLevelChange: (level: CommitmentLevel) => void;
}

export const CommitmentLadder = ({
  selectedLevel,
  onLevelChange,
}: CommitmentLadderProps) => {
  const levels: CommitmentLevel[] = [
    "try-it",
    "easy-win",
    "comfortable",
    "standard",
    "push-it",
  ];

  return (
    <div className="commitment-ladder">
      {levels.map((level) => {
        const levelData = COMMITMENT_LEVELS[level];
        const isSelected = selectedLevel === level;
        return (
          <button
            key={level}
            type="button"
            className={`commitment-ladder__button ${
              isSelected ? "commitment-ladder__button--selected" : ""
            }`}
            onClick={() => onLevelChange(level)}
            aria-pressed={isSelected}
          >
            {levelData.label}
          </button>
        );
      })}
    </div>
  );
};

