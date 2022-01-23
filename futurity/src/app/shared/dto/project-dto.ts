export interface CreationProjectDto {
  name: string;
  description: string;
}

export interface CreationProjectResponseDto {
  projectId: number;
}

export interface ProjectResponseDto {
  projects: Project[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  previewUrl: string;
}
