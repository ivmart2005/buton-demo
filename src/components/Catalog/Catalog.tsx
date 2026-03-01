import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CatalogButton } from './CatalogButton';
import { CatalogContent } from './CatalogContent';
import { CatalogProps } from './types';
import './Catalog.css';

export const Catalog = forwardRef<{ open: () => void }, CatalogProps>(
  ({ width = '900px' }, ref) => {
    // открытие каталога
    const [isOpen, setIsOpen] = useState(false);
    // ссылка на каталог
    const catalogContentRef = useRef<HTMLDivElement>(null);
    // открытие окна типов цветов
    const [isTypesWindowOpen, setIsTypesWindowOpen] = useState(false);
    
    // открытие каталога через холст (родитель)
    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true)
    }));
    
    // закрывание открытого каталога через один клик вне каталога
    useEffect(() => {
      if (!isOpen || isTypesWindowOpen) return; // если закрыт
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;

        // клик вне каталога
        if (catalogContentRef.current?.contains(event.target as Node))
          return;
        // клик на кнопку открытия каталога (исключение)
        if (target.closest('.catalog-button'))
          return;
        // клик на окно типов цветов (исключение)
        if (target.closest('.flower-types-modal-overlay'))
          return;
        // ещё исключения
        if (target.closest('.projects-window-container') || 
            target.closest('.projects-explorer') || 
            target.closest('.save-bouquet-modal') ||
            target.closest('.context-menu-overlay'))
          return;

        // закрытие
        setIsOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isTypesWindowOpen]);

    // открытие окна типов цветов
    const handleOpenTypesWindow = () => {
      setIsTypesWindowOpen(true);
    };

    // закрытие окна типов цветов
    const handleCloseTypesWindow = () => {
      setIsTypesWindowOpen(false);
    };

    return (
      <>
        <CatalogButton 
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        />
        <CatalogContent 
          isOpen={isOpen}
          ref={catalogContentRef}
          onOpenTypesWindow={handleOpenTypesWindow}
          onCloseTypesWindow={handleCloseTypesWindow}
          isTypesWindowOpen={isTypesWindowOpen}
        />
      </>
    );
  }
);

Catalog.displayName = 'Catalog';