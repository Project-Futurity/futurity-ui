export interface CreationProjectDto {
  name: string;
  description: string;
}

export interface CreationColumnDto {
  name: string;
  projectId: number;
}

export interface DeletingColumnDto {
  columnId: number;
  projectId: number;
}

export interface ChangeColumnIndexDto {
  from: number;
  to: number;
  projectId: number;
}

export interface CreationTaskDto {
  projectId: number;
  columnId: number;
  taskName: string;
  deadline: string;
}

export interface DeletingTaskDto {
  projectId: number;
  columnId: number;
  taskId: number;
}

export interface ChangeTaskIndexDto {
  fromColumn: number;
  toColumn: number;
  from: number;
  to: number;
}

export interface ChangeColumnNameDto {
  projectId: number;
  columnId: number;
  columnName: string;
}

export interface ChangeTaskNameDto {
  projectId: number;
  columnId: number;
  taskId: number;
  taskName: string;
}

export interface ChangeTaskDeadlineDto {
  projectId: number;
  columnId: number;
  taskId: number;
  deadline: string;
}
