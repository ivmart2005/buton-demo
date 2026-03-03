import { useEffect, RefObject } from 'react';

// для закрытия каталога при клике вне
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClickOutside: () => void,
  excludeSelectors: string[] = [] // исключения
) => {
  useEffect(() => {
    if (!isActive) return;
    // клик вне каталога закрывает его
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isInsideRef = ref.current && ref.current.contains(target);
      const isExcluded = excludeSelectors.some(selector => 
        target.closest(selector)
      ); // внутри окна?  //исключения
      if (!isInsideRef && !isExcluded) {
        onClickOutside();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, onClickOutside, ref, excludeSelectors]);
};