import { useRef } from "react";

export const useCatalogControl = () => {
  const catalogRef = useRef<{open: () => void}>(null);
  const openCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.open();
    }
  };

  return {
    catalogRef,
    openCatalog
  };
};