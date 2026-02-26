import { useState, useRef } from 'react';
import { useFlowersContext } from '@/contexts/FlowersContext';
import { ProjectsExplorer } from './ProjectsExplorer';
import './ProjectsWindowStyles/index.css';

interface ProjectsWindowProps {
  onClose: () => void;
  mode?: 'load' | 'save';
}

export const ProjectsWindow = ({ onClose, mode = 'load' }: ProjectsWindowProps) => {
  const { flowers, setCurrentProject } = useFlowersContext();
  const [fileName, setFileName] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSaveBouquet = async () => {
    if (!fileName.trim()) return;
    setIsSaving(true);
    console.log("!!! ProjectsWindow: Сохранение файла:", fileName);

    try {
      if (!window.electronAPI?.saveBouquetToPath) {
        onClose();
        return;
      }

      const flowersDataToSave = flowers.map(flower => ({
        flowerName: flower.name,
        flower_type_id: (flower as any).flower_type_id || 1,
        x: flower.x,
        y: flower.y,
        zIndex: flower.zIndex,
        scale: flower.scale,
        rotation: flower.rotation,
        currentAngle: flower.currentAngle,
        saturation: (flower as any).saturation || 1.0,
        isFlipped: (flower as any).isFlipped || false
      }));

      let filePath = currentPath && currentPath !== '/' 
        ? `Projects/${currentPath}/${fileName}.json` 
        : `Projects/${fileName}.json`;

      await window.electronAPI.saveBouquetToPath({
        flowers: flowersDataToSave,
        filePath: filePath
      });

      console.log("!!! ProjectsWindow: Успешно сохранено. Путь:", filePath);
      setCurrentProject({
        name: `${fileName}.json`,
        path: filePath,
        type: 'file'
      });

      onClose();
    } catch (error: any) {
      console.error("!!! ProjectsWindow ERROR:", error);
      alert("Ошибка при сохранении: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePathChange = (path: string) => setCurrentPath(path);

  return (
    <div 
      className="projects-window-container"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div className="projects-window-header">
        <div className="header-content">
          <div className="header-text">
            {mode === 'save' ? 'Сохранить букет' : 'Мои проекты'}
          </div>
          <div className="header-actions">
            <div className="header-icon" onClick={onClose}>
              <img src="./images/interface/black-cross.svg" alt="Закрыть" className="close-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="projects-window-explorer">
        <ProjectsExplorer 
          onPathChange={handlePathChange} 
          onClose={onClose} 
          setCurrentProject={setCurrentProject} 
        />
      </div>

      {mode === 'save' && (
        <div className="projects-window-footer">
          <div className="save-panel-row">
            <label className="save-label">Имя файла:</label>
            <div className="save-input-group" onClick={() => inputRef.current?.focus()}>
              <input
                ref={inputRef}
                type="text"
                autoFocus
                placeholder="Введите название"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="file-name-input"
                disabled={isSaving}
              />
            </div>
            <button 
              className="save-action-button"
              onClick={(e) => { e.stopPropagation(); handleSaveBouquet(); }}
              disabled={!fileName.trim() || isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить букет'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};