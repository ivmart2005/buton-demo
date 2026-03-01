import './ProjectsWindow.css';

interface BreadcrumbsProps {
  path: string;
  onNavigate: (path: string) => void;
  onGoBack: () => void;
}

export const Breadcrumbs = ({ path, onNavigate, onGoBack }: BreadcrumbsProps) => {
  const parts = path === '/' ? [] : path.split('/').filter(p => p);

  return (
    <div className="breadcrumbs">
      <button 
        className="breadcrumb-back"
        onClick={onGoBack}
        title="Назад"
      >
        ←
      </button>
      
      <button 
        className="breadcrumb-item"
        onClick={() => onNavigate('')}
      >
        Projects
      </button>
      
      {parts.map((part, index) => {
        const currentPath = parts.slice(0, index + 1).join('/');
        return (
          <span key={currentPath} className="breadcrumb-separator">
            ›
            <button 
              className="breadcrumb-item"
              onClick={() => onNavigate(currentPath)}
            >
              {part}
            </button>
          </span>
        );
      })}
    </div>
  );
};