export interface CreationProjectDto {
  name: string;
  description: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  previewUrl: string;
}

export interface ProjectColumn {
  id: number;
  name: string;
}

export interface CreationColumnDto {
  name: string;
  projectId: number;
}

export interface DeletingColumnDto {
  index: number;
  projectId: number;
}

export interface ChangeColumnIndexRequest {
  from: number;
  to: number;
  projectId: number;
}
