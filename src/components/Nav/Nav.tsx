import "./Nav.css";

interface NavProps {
  onBack?: () => void;
  centerContent?: React.ReactNode;
}

export const Nav = ({ onBack, centerContent }: NavProps) => {
  return (
    <nav className="nav">
      {onBack && (
        <button className="nav__back-button" onClick={onBack}>
          ← Back
        </button>
      )}
      {centerContent && (
        <div className="nav__center">{centerContent}</div>
      )}
    </nav>
  );
};

