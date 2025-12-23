import "./MultiSetIndicator.css";

interface MultiSetIndicatorProps {
  totalSets: number;
  currentIndex: number;
  sequenceIndices: number[];
}

export const MultiSetIndicator = ({
  currentIndex,
  sequenceIndices,
}: MultiSetIndicatorProps) => {
  return (
    <div className="multi-set-indicator">
      {sequenceIndices.map((index) => (
        <div
          key={index}
          className={`multi-set-indicator__dot ${
            index === currentIndex
              ? "multi-set-indicator__dot--active"
              : index < currentIndex
              ? "multi-set-indicator__dot--completed"
              : "multi-set-indicator__dot--upcoming"
          }`}
        />
      ))}
    </div>
  );
};
