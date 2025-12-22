import "./Nav.css";

interface NavProps {
  onBack?: () => void;
  onExit?: () => void;
  centerContent?: React.ReactNode;
}

export const Nav = ({ onBack, onExit, centerContent }: NavProps) => {
  return (
    <nav className="nav">
      <div className="nav__left">
        {onBack && (
          <button className="nav__back-button" onClick={onBack}>
            ← Back
          </button>
        )}
        {onExit && (
          <button className="nav__exit-button" onClick={onExit}>
            ✕ Exit
          </button>
        )}
      </div>
      {centerContent && (
        <div className="nav__center">{centerContent}</div>
      )}
    </nav>
  );
};

