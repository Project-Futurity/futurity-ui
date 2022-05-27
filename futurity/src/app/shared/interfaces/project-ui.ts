export interface ProjectUi {
  project: Project;
  isPreviewLoad: boolean;
}

export interface TaskChangingIndex {
  columnIndex: number,
  taskIndex: number
}

export interface Project {
  id: number;
  name: string;
  description: string;
  previewUrl: string;
}

export interface ProjectColumn {
  id?: number,
  name: string;
  tasks: Task[];
  isDone: boolean;
}

export interface Task {
  id?: number
  name: string;
  columnId: number;
  deadline: string;
}
