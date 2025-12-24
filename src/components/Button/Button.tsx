import "./Button.css";
import { useMomentaryDisable } from "../../hooks/useMomentaryDisable";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  disableDurationMs?: number;
}

export const Button = ({
  children,
  onClick,
  disabled = false,
  disableDurationMs,
}: ButtonProps) => {
  const { isDisabled: isMomentarilyDisabled, progress } =
    useMomentaryDisable(disableDurationMs);

  const isButtonDisabled = disabled || isMomentarilyDisabled;
  const showProgress = isMomentarilyDisabled && progress < 100;

  return (
    <button className="button" onClick={onClick} disabled={isButtonDisabled}>
      <span className="button__content">{children}</span>
      {showProgress && (
        <div className="button__progress" style={{ width: `${progress}%` }} />
      )}
    </button>
  );
};
