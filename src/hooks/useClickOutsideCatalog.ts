import { useEffect, RefObject } from 'react';

// для закрытия каталога при клике вне
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClickOutside: () => void,
  excludeSelectors: string[] = []
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isInsideRef = ref.current && ref.current.contains(target);
      const isExcluded = excludeSelectors.some(selector => 
        target.closest(selector)
      );
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