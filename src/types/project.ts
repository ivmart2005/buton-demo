export interface ProjectItem {
  name: string;
  type: 'folder' | 'file';
  path: string;
  size?: number;
  modified?: string;
}

export interface ProjectStructure {
  path: string;
  items: ProjectItem[];
  parentPath: string | null;
}