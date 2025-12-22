import './Paragraph.css';

interface ParagraphProps {
  children: React.ReactNode;
}

export const Paragraph = ({ children }: ParagraphProps) => {
  return (
    <p className="paragraph">
      {children}
    </p>
  );
};

