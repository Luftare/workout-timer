import "./SetProgressIndicator.css";

interface SetProgressIndicatorProps {
  totalSets: number;
  currentSetIndex: number; // 0-based index
  isWorkoutCompleted: boolean;
}

export const SetProgressIndicator = ({
  totalSets,
  currentSetIndex,
  isWorkoutCompleted,
}: SetProgressIndicatorProps) => {

  const getLineClassName = (index: number): string => {
    const baseClass = "set-progress-indicator__line";

    if (isWorkoutCompleted) {
      return `${baseClass} ${baseClass}--completed-all`;
    }

    if (index < currentSetIndex) {
      return `${baseClass} ${baseClass}--completed`;
    }

    if (index === currentSetIndex) {
      return `${baseClass} ${baseClass}--current`;
    }

    return `${baseClass} ${baseClass}--upcoming`;
  };

  return (
    <div className="set-progress-indicator">
      {Array.from({ length: totalSets }).map((_, index) => (
        <div
          key={index}
          className={getLineClassName(index)}
        />
      ))}
    </div>
  );
};

