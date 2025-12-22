import './Headline.css';

interface HeadlineProps {
  children: React.ReactNode;
  size?: 'large' | 'medium';
}

export const Headline = ({ children, size = 'large' }: HeadlineProps) => {
  return (
    <h1 className={`headline headline--${size}`}>
      {children}
    </h1>
  );
};

