export interface CreationProjectDto {
  name: string;
  description: string;
}

export interface CreationColumnDto {
  name: string;
  projectId: number;
}

export interface IdResponse {
  id: number;
}

export interface ListResponse<T> {
  values: T[];
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
  index?: number;
}

export interface ChangeColumnIndexRequest {
  from: number;
  to: number;
  projectId: number;
}
