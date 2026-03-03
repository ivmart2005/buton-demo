import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ProjectItem as ProjectItemType } from '@/types/project';
import { BouquetPreview } from './BouquetPreview'; 
import './ProjectsWindow.css';

interface ProjectItemProps {
  item: ProjectItemType;
  isRenaming?: boolean;
  onRenameComplete?: () => void;
  onRenameCancel?: () => void;
  onClick: () => void;
  onDoubleClick?: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
}

// папка или файл на холсте
export const ProjectItem = ({
  item, 
  isRenaming,
  onRenameComplete,
  onRenameCancel,
  onClick, 
  onDoubleClick, 
  onContextMenu 
}: ProjectItemProps) => {
  const [tempName, setTempName] = useState(item.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFolder = item.type === 'folder';

  useEffect(() => { // переименование
    if (isRenaming) {
      const nameToShow = isFolder ? item.name : item.name.replace(/\.json$/, '');
      setTempName(nameToShow);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select(); // выбор поля и начало печати в нем
      }, 50);
    }
  }, [isRenaming, item.name, isFolder]);

  const handleSaveRename = async () => {
    const trimmed = tempName.trim();
    const oldCleanName = isFolder ? item.name : item.name.replace(/\.json$/, '');
    if (!trimmed || trimmed === oldCleanName) {
      onRenameCancel?.();
      return;
    }
    try {
      const success = await window.electronAPI.renameProjectItem(item.path, trimmed);
      if (success) {
        onRenameComplete?.();
      } else {
        onRenameCancel?.();
      }
    } catch (error) {
      console.error("ProjectItem.tsx - ошибка при переименовании:", error);
      onRenameCancel?.();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter')
      handleSaveRename();
    if (event.key === 'Escape')
      onRenameCancel?.();
  };

  // клики не должны проваливаться под окно проектов
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isRenaming)
      return;
    onClick();
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDoubleClick && !isFolder && !isRenaming) {
      onDoubleClick();
    }
  };

  const previewPath = `Projects/${item.path}`;

  const renderName = () => {
    if (isRenaming) {
      return (
        <input
          ref={inputRef}
          className="project-item-rename-input"
          value={tempName}
          onChange={(event) => setTempName(event.target.value)}
          onBlur={handleSaveRename}
          onKeyDown={handleKeyDown}
          onClick={(event) => event.stopPropagation()}
        />
      );
    }
    const displayName = isFolder ? item.name : item.name.replace(/\.json$/, '');
    return <div className={isFolder ? "folder-name" : "file-header"}>{displayName}</div>;
  };
  
  return (
    <div 
      className={`project-item ${item.type} ${isRenaming ? 'renaming' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={onContextMenu}
    >
      {isFolder ? (
        <>
          <div className="folder-icon">📁</div>
          <div className="folder-info">{renderName()}</div>
        </>
      ) : (
        <>
          {renderName()}
          <div className="file-preview">
            <BouquetPreview filePath={previewPath} size={180} />
          </div>
          <div className="file-footer">
            {item.modified && (
              <div className="file-date">
                {new Date(item.modified).toLocaleDateString()}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};