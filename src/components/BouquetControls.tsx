import { useState, useEffect } from "react";
import { useFlowersContext } from "@/contexts/FlowersContext";
import { ProjectsWindow } from "./ProjectsWindow/ProjectsWindow";
import { SaveConfirmModal, useModal } from "@/components/Modal";
import "./BouquetControls.css";

export const BouquetControls = () => {
  const {
    flowers,
    setFlowers,
    isDirty,
    currentProject,
    setIsDirty,
    setCurrentProject,
    resetProject
  } = useFlowersContext();
  const [showProjects, setShowProjects] = useState(false);
  const [projectsMode, setProjectsMode] = useState<"load" | "save">("load");
  const { isOpen, open, close } = useModal();
  const [pendingAction, setPendingAction] = useState<"new" | "load" | null>(null);

  useEffect(() => {
    const handleBouquetLoaded = (event: CustomEvent) => {
      if (event.detail && event.detail.flowers) { // если поступил полный проект
        setFlowers(event.detail.flowers); // отрисовка цветов
        if (event.detail.project) {
          setCurrentProject(event.detail.project);
          setIsDirty(false);
        }
      }
      else if (Array.isArray(event.detail)) { // пустой букет
        setFlowers(event.detail);
      }
    };
    window.addEventListener("bouquet-loaded", handleBouquetLoaded as EventListener);
    return () => {
      window.removeEventListener("bouquet-loaded", handleBouquetLoaded as EventListener);
    };
  }, [setFlowers, setCurrentProject, setIsDirty]);

  // сохраение с именем
  const handleSaveAs = () => {
    setProjectsMode("save");
    setShowProjects(true);
    close();
    setPendingAction(null);
  };

  // опция "не сохранять"
  const handleDiscard = () => {
    resetProject ? resetProject() : (() => {
      setFlowers([]);
      setCurrentProject(null);
      setIsDirty(false);
    }) ();

    if (pendingAction === "load") {
      setProjectsMode("load");
      setShowProjects(true);
    }

    setPendingAction(null);
    close();
  };

  // кнопка "создать новый букет"
  const handleNewBouquetClick = () => {
    if (isDirty) {
      setPendingAction("new");
      open();
    } else {
      resetProject ? resetProject() : (() => {
        setFlowers([]);
        setCurrentProject(null);
        setIsDirty(false);
      })();
    }
  };

  // сохранение по пути
  const handleDirectSave = async () => {
    if (currentProject && currentProject.path) {
      try {
        const flowersToSave = flowers.map(flower => ({
          flowerName: flower.name,
          flower_type_id: (flower as any).flower_type_id || 1,
          x: flower.x,
          y: flower.y,
          zIndex: flower.zIndex,
          scale: flower.scale,
          rotation: flower.rotation,
          currentAngle: flower.currentAngle,
          saturation: (flower as any).saturation ?? 1.0,
          isFlipped: (flower as any).isFlipped ?? false
        }));
        await window.electronAPI.saveBouquetToPath({
          filePath: currentProject.path,
          flowers: flowersToSave as any
        });
        setIsDirty(false);
        if (pendingAction === "new") {
           resetProject ? resetProject() : (() => { setFlowers([]); setCurrentProject(null); })();
        } else if (pendingAction === "load") {
           setProjectsMode("load");
           setShowProjects(true);
        }
        setPendingAction(null);
        close();
      } catch (error: any) {
        console.error("BouquetControls - ошибка тихого сохранения:", error);
        handleSaveAs();
      }
    } else {
      handleSaveAs();
    }
  };
  // клик на "Мои проекты"
  const handleMyProjectsClick = () => {
    if (isDirty) {
      setPendingAction("load");
      open();
    } else {
      setProjectsMode("load");
      setShowProjects(true);
    }
  };

  return (
    <>
      <div className="bouquet-controls-container">
        <button className="btn-control" onClick={handleNewBouquetClick}>
          Новый букет
        </button>
        <button className="btn-control" onClick={handleDirectSave}>
          Сохранить
        </button>
        <button className="btn-control" onClick={handleSaveAs}>
          Сохранить как
        </button>
        <button className="btn-control" onClick={handleMyProjectsClick}>
          Мои проекты
        </button>
      </div>

      <SaveConfirmModal
        isOpen={isOpen}
        onClose={() => {close(); setPendingAction(null);}}
        onSave={handleDirectSave}
        onSaveAs={handleSaveAs}
        onDiscard={handleDiscard}
      />

      {showProjects && (
        <ProjectsWindow
          onClose={() => setShowProjects(false)}
          mode={projectsMode}
        />
      )}
    </>
  );
};