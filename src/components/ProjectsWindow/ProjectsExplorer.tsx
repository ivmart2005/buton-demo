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

const MOCK_FOLDERS_COUNT = 9;
const MOCK_FILES_COUNT = 9;
const GENERATED_MOCKS: ProjectItemData[] = [];
for (let i = 0; i < MOCK_FOLDERS_COUNT; i++) {
  const folderNumber = i + 1;
  GENERATED_MOCKS.push({
    name: "Папка " + folderNumber,
    type: 'folder',
    path: "folder-" + i
  });
}
for (let i = 0; i < MOCK_FILES_COUNT; i++) {
  const fileNumber = i + 1;
  GENERATED_MOCKS.push({
    name: "Букет " + fileNumber,
    type: 'file',
    path: "mock-file-" + i + ".json",
    preview: './images/example.png',
    modifiedAt: '01.01.2026'
  });
}
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
  const isWebMode = !window.electronAPI; // в веб версии нет файловой системы
  const [clipboard, setClipboard] = useState<{ path: string, action: 'copy' | 'cut' } | null>(null);

  // в вебе моковые данные, в десктопе из БД
  const structure = useMemo(() => {
    if (!isWebMode && realStructure)
      return realStructure;
            // в корне или не в корне?                  если в корне, то моки
    return (currentPath === '' || currentPath === '/') ? MOCK_STRUCTURE : { path: currentPath, items: [] as ProjectItemData[] };
  }, [isWebMode, realStructure, currentPath]);

  // отслеживание реального положения при переходе между папками
  useEffect(() => {
    if (onPathChange && structure)
      onPathChange(structure.path);
  }, [structure, onPathChange]);

  // обработка ПКМ клика по папке/файлу
  const handleItemContextMenu = (event: React.MouseEvent, item: ProjectItemData) => {
    event.preventDefault();
    event.stopPropagation();
    setRmbMenu({ x: event.clientX,
      y: event.clientY,
      type: item.type,
      path: item.path,
      name: item.name });
  };

  // обработка ПКМ клика
  const handleGlobalContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setRmbMenu({ x: event.clientX, y: event.clientY, type: 'non_file' });
  };

  // обработка загрузки букета двойным кликом
  const handleFileDoubleClick = async (itemPath: string) => {
    if (isLoadingBouquet || renamingPath)
      return;
    setIsLoadingBouquet(true);
    try {
      if (!window.electronAPI) {
        console.warn("!!! ProjectsExplorer: electron API не доступен");
        return;
      }
      const fullPath = `Projects/${itemPath}`;
      const savedFlowers = await window.electronAPI.loadBouquetFromPath(fullPath);
      // пустой букет
      if (!savedFlowers || savedFlowers.length === 0) {
        return;
      }
      const fileName = itemPath.split('/').pop() || itemPath;
      const projectData = { name: fileName, path: fullPath, type: 'file' as const };
      setCurrentProject(projectData);
      const convertedFlowers = await convert(savedFlowers);
      window.dispatchEvent(new CustomEvent('bouquet-loaded', { detail: convertedFlowers }));
      if (onClose)
        onClose();
    } catch (error) { 
      console.error("!!! ProjectsExplorer: Ошибка при загрузке:", error); 
    } finally { 
      setIsLoadingBouquet(false); 
    }
  };

  const folders = structure.items.filter(item => item.type === 'folder');
  const files = structure.items.filter(item => item.type === 'file');

  return (
    <div className="projects-explorer" onContextMenu={handleGlobalContextMenu}>
      <Breadcrumbs path={currentPath} onNavigate={enterFolder} onGoBack={goBack} />
           
      <div className="projects-content-scroll">
        {structure.items.length === 0 ? (
          <div className="projects-empty">Папка пуста</div>
        ) : (
          <>
            <div className="projects-grid">
              {folders.map((item) => ( // сначала все папки
                <ProjectItemComponent
                  key={item.path}
                  item={item as any} 
                  isRenaming={renamingPath === item.path}
                  onRenameComplete={() => { setRenamingPath(null); loadStructure(currentPath); }}
                  onRenameCancel={() => setRenamingPath(null)}
                  onClick={() => enterFolder(item.path)}
                  onContextMenu={(event) => handleItemContextMenu(event, item)}
                />
              ))}
              {folders.length > 0 && files.length > 0 && <div className="projects-divider" style={{gridColumn: '1/-1'}} />}
              {files.map((item) => ( // потом все букеты
                <ProjectItemComponent
                  key={item.path}
                  item={item as any}
                  isRenaming={renamingPath === item.path}
                  onRenameComplete={() => { setRenamingPath(null);loadStructure(currentPath); }}
                  onRenameCancel={() => setRenamingPath(null)}
                  onClick={() => {}} 
                  onDoubleClick={() => handleFileDoubleClick(item.path)}
                  onContextMenu={(event) => handleItemContextMenu(event, item)}
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