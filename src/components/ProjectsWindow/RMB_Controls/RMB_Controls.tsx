import './RMB_Controls.css';

export type RMBTarget = {
  type: 'file' | 'folder' | 'non_file';
  path?: string;
  name?: string;
};

interface RMB_ControlsProps {
  x: number;
  y: number;
  target: RMBTarget;
  currentPath: string; 
  onClose: () => void;
  onRenameRequest: (path: string) => void; 
  onUpdate: () => void; 
  clipboard: { path: string, action: 'copy' | 'cut' } | null;
  onCopy: (path: string) => void;
  onCut: (path: string) => void;
  onClearClipboard: () => void;
}

export const RMB_Controls = ({ 
  x, y, target, currentPath, onClose, onRenameRequest, onUpdate,
  clipboard, onCopy, onCut, onClearClipboard 
}: RMB_ControlsProps) => {
  
  const isItem = target.type === 'file' || target.type === 'folder';

  const handleCreateFile = async () => {
    try {
      const newPath = await window.electronAPI.createNewBouquet(currentPath);
      if (newPath) {
        onUpdate();
        setTimeout(() => onRenameRequest(newPath), 50); 
      }
    } catch (err) {
      console.error("Ошибка при создании букета:", err);
    } finally {
      onClose();
    }
  };

  const handleCreateFolder = async () => {
    try {
      const newPath = await window.electronAPI.createNewFolder(currentPath);
      if (newPath) {
        onUpdate();
        setTimeout(() => onRenameRequest(newPath), 50);
      }
    } catch (err) {
      console.error("Ошибка при создании папки:", err);
    } finally {
      onClose();
    }
  };


  const handleCopyClick = () => {
    if (target.path) {
        onCopy(target.path); 
    }
    onClose();
  };

  const handleCutClick = () => {
    if (target.path) onCut(target.path);
    onClose();
  };

  const handlePasteClick = async () => {
    if (!clipboard) return;

    try {
      await window.electronAPI.pasteItem({
        srcPath: clipboard.path,
        destDir: currentPath,
        action: clipboard.action
      });

      if (clipboard.action === 'cut') {
        onClearClipboard();
      }
      
      onUpdate();
    } catch (err) {
      console.error("Ошибка вставки:", err);
    } finally {
      onClose();
    }
  };

  const handleDeleteClick = async () => {
    if (!target.path) return;
    try {
      const success = await window.electronAPI.deleteProjectItem(target.path);
      if (success) onUpdate();
    } catch (err) {
      console.error("Ошибка при удалении:", err);
    } finally {
      onClose();
    }
  };

  const handleRenameClick = () => {
    if (target.path) onRenameRequest(target.path);
    onClose();
  };

  return (
    <>
      <div 
        className="rmb-overlay" 
        onClick={onClose} 
        onContextMenu={(e) => { e.preventDefault(); onClose(); }} 
      />
      
      <div 
        className="rmb-menu" 
        style={{ top: y, left: x }}
        onClick={(e) => e.stopPropagation()}
      >
        {isItem && (
          <>
            <div className="rmb-header">
              <span className="rmb-target-name">{target.name}</span>
            </div>
            
            <div className="rmb-item" onClick={handleRenameClick}>
              Переименовать
            </div>
            <div className="rmb-item" onClick={handleCopyClick}>
              Копировать
            </div>
            <div className="rmb-item" onClick={handleCutClick}>
              Вырезать
            </div>
            
            <div className="rmb-divider" />
            
            <div className="rmb-item delete" onClick={handleDeleteClick}>
              Удалить {target.type === 'folder' ? 'папку' : 'файл'}
            </div>
          </>
        )}

        {target.type === 'non_file' && (
          <>
            <div className="rmb-header">Создать</div>
            <div className="rmb-item" onClick={handleCreateFile}>
              Новый букет
            </div>
            <div className="rmb-item" onClick={handleCreateFolder}>
              Новая папка
            </div>
            
            {clipboard && (
              <>
                <div className="rmb-divider" />
                <div className="rmb-item paste" onClick={handlePasteClick}>
                  Вставить <span className="rmb-hint">({clipboard.action === 'copy' ? 'копия' : 'перемещение'})</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};