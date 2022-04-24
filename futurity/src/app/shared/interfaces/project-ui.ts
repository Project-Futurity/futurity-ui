export interface ProjectUi {
  project: Project;
  isPreviewLoad: boolean;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  previewUrl: string;
}

export interface ProjectColumn {
  name: string;
  tasks: Task[];
}

export interface Task {
  name: string;
  columnIndex: number;
}
