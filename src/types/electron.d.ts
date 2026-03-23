import { Bouquet, SavedFlower } from "./bouquet";
import { ProjectStructure } from "./project";

export interface ElectronAPI {
  saveBouquetToProject: (bouquet: Bouquet) => Promise<any>;
  loadBouquetFromProject: () => Promise<SavedFlower[]>;
  loadBouquetFromPath: (filePath: string) => Promise<SavedFlower[]>;
  getFlowerImage: (flowerName: string) => Promise<string>;
  getFlowers: () => Promise<any[]>;
  getFlowerTypes: () => Promise<any[]>;
  getFlowerTypeImage: (typeId: number) => Promise<string>;
  getFlowerTypeById: (typeId: number) => Promise<any>;
  getProjectsStructure: (relativePath?: string) => Promise<ProjectStructure>;
  createNewBouquet: (targetDir: string) => Promise<string>;
  createNewFolder: (targetDir: string) => Promise<string>;
  renameProjectItem: (oldPath: string, newName: string) => Promise<string>;
  deleteProjectItem: (path: string) => Promise<boolean>;
  pasteItem: (data: { srcPath: string, destDir: string, action: "copy" | "cut" }) => Promise<string>;
  saveBouquetToPath: (bouquetData: {
    flowers: SavedFlower[];
    filePath: string;
  }) => Promise<{
    success: boolean;
    path: string;
    fileName: string;
    savedAt: string;
  }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}