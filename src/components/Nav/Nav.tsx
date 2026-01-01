import "./Nav.css";

interface NavProps {
  onExit?: () => void;
  centerContent?: React.ReactNode;
}

export const Nav = ({ onExit, centerContent }: NavProps) => {
  return (
    <nav className="nav">
      <div className="nav__left">
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

