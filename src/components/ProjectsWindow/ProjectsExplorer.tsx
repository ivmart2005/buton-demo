import { useState, useEffect, useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Breadcrumbs } from './Breadcrumbs';
import { ProjectItem as ProjectItemComponent } from './ProjectItem';
import { useConvertBouquet } from '@/hooks/BouquetHooks/useBouquet';
import { RMB_Controls, RMBTarget } from './RMB_Controls/RMB_Controls'; 
import './ProjectsWindow.css';

interface ProjectItemData {
  name: string;
  type: 'folder' | 'file';
  path: string;
  preview?: string;
  modifiedAt?: string;
}

const MOCK_FOLDERS_COUNT = 2;
const MOCK_FILES_COUNT = 16;
const GENERATED_MOCKS: ProjectItemData[] = [
  ...Array.from({ length: MOCK_FOLDERS_COUNT }).map((_, i) => ({
    name: `Папка ${i + 1}`, type: 'folder' as const, path: `folder-${i}`,
  })),
  ...Array.from({ length: MOCK_FILES_COUNT }).map((_, i) => ({
    name: `Букет ${i + 1}`, type: 'file' as const, path: `mock-file-${i}.json`,
    preview: './images/example.png', modifiedAt: '05.02.2026'
  }))
];
const MOCK_STRUCTURE = { path: '/', items: GENERATED_MOCKS };

interface ProjectsExplorerProps {
  onPathChange?: (path: string) => void;
  onClose?: () => void;
  setCurrentProject: (project: any) => void;
}

export const ProjectsExplorer = ({ onPathChange, onClose, setCurrentProject }: ProjectsExplorerProps) => {
  const { 
    currentPath, 
    structure: realStructure, 
    isLoading: isRealLoading, 
    error: realError, 
    enterFolder, 
    goBack,
    loadStructure 
  } = useProjects();
  
  const { convert } = useConvertBouquet();
  const [isLoadingBouquet, setIsLoadingBouquet] = useState(false);
  const [rmbMenu, setRmbMenu] = useState<(RMBTarget & { x: number, y: number }) | null>(null);
  const [renamingPath, setRenamingPath] = useState<string | null>(null);

  const isWebMode = !window.electronAPI;
  const [clipboard, setClipboard] = useState<{ path: string, action: 'copy' | 'cut' } | null>(null);

  const structure = useMemo(() => {
    if (!isWebMode && realStructure) return realStructure;
    return (currentPath === '' || currentPath === '/') ? MOCK_STRUCTURE : { path: currentPath, items: [] as ProjectItemData[] };
  }, [isWebMode, realStructure, currentPath]);

  useEffect(() => {
    if (onPathChange && structure) onPathChange(structure.path);
  }, [structure, onPathChange]);

  const handleItemContextMenu = (e: React.MouseEvent, item: ProjectItemData) => {
    e.preventDefault();
    e.stopPropagation();
    setRmbMenu({ x: e.clientX, y: e.clientY, type: item.type, path: item.path, name: item.name });
  };

  const handleGlobalContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setRmbMenu({ x: e.clientX, y: e.clientY, type: 'non_file' });
  };

  const handleFileDoubleClick = async (itemPath: string) => {
    if (isLoadingBouquet || renamingPath) return;
    console.log("!!! ProjectsExplorer: Дабл-клик по файлу:", itemPath);
    setIsLoadingBouquet(true);
    try {
      if (!window.electronAPI) {
        console.warn("!!! ProjectsExplorer: electronAPI не доступен");
        return;
      }
      
      const fullPath = `Projects/${itemPath}`;
      const savedFlowers = await window.electronAPI.loadBouquetFromPath(fullPath);
      
      if (!savedFlowers || savedFlowers.length === 0) {
        console.warn("!!! ProjectsExplorer: Загруженный букет пуст");
        return;
      }
      
      const fileName = itemPath.split('/').pop() || itemPath;
      const projectData = { name: fileName, path: fullPath, type: 'file' as const };
      console.log("!!! ProjectsExplorer: Вызываю setCurrentProject с данными:", projectData);
      setCurrentProject(projectData);

      const convertedFlowers = await convert(savedFlowers);
      window.dispatchEvent(new CustomEvent('bouquet-loaded', { detail: convertedFlowers }));
      
      if (onClose) onClose();
    } catch (e) { 
      console.error("!!! ProjectsExplorer: Ошибка при загрузке:", e); 
    } finally { 
      setIsLoadingBouquet(false); 
    }
  };

  if (isRealLoading && !isWebMode) return <div className="projects-explorer-loading">Загрузка структуры...</div>;
  if (realError && !isWebMode) return <div className="projects-explorer-error">Ошибка: {realError}</div>;
  if (!structure) return <div className="projects-explorer-empty">Нет данных</div>;

  const folders = structure.items.filter(item => item.type === 'folder');
  const files = structure.items.filter(item => item.type === 'file');

  return (
    <div className="projects-explorer" onContextMenu={handleGlobalContextMenu}>
      <Breadcrumbs path={currentPath} onNavigate={enterFolder} onGoBack={goBack} />
      
      {isLoadingBouquet && <div className="bouquet-loading-indicator">Загрузка...</div>}
      
      <div className="projects-content-scroll">
        {structure.items.length === 0 ? (
          <div className="projects-empty">Папка пуста</div>
        ) : (
          <>
            <div className="projects-grid">
              {folders.map((item) => (
                <ProjectItemComponent
                  key={item.path}
                  item={item as any} 
                  isRenaming={renamingPath === item.path}
                  onRenameComplete={() => { setRenamingPath(null); loadStructure(currentPath); }}
                  onRenameCancel={() => setRenamingPath(null)}
                  onClick={() => !renamingPath && enterFolder(item.path)}
                  onContextMenu={(e) => handleItemContextMenu(e, item)}
                />
              ))}
              {folders.length > 0 && files.length > 0 && <div className="projects-divider" style={{gridColumn: '1/-1'}} />}
              {files.map((item) => (
                <ProjectItemComponent
                  key={item.path}
                  item={item as any}
                  isRenaming={renamingPath === item.path}
                  onRenameComplete={() => { setRenamingPath(null); loadStructure(currentPath); }}
                  onRenameCancel={() => setRenamingPath(null)}
                  onClick={() => {}} 
                  onDoubleClick={() => handleFileDoubleClick(item.path)}
                  onContextMenu={(e) => handleItemContextMenu(e, item)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {rmbMenu && (
        <RMB_Controls 
          x={rmbMenu.x} y={rmbMenu.y} target={rmbMenu} currentPath={currentPath}
          onClose={() => setRmbMenu(null)}
          onRenameRequest={(path) => setRenamingPath(path)}
          onUpdate={() => loadStructure(currentPath)}
          clipboard={clipboard}
          onCopy={(path) => setClipboard({ path, action: 'copy' })}
          onCut={(path) => setClipboard({ path, action: 'cut' })}
          onClearClipboard={() => setClipboard(null)}
        />
      )}
    </div>
  );
};