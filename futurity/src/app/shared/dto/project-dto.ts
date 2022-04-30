export interface CreationProjectDto {
  name: string;
  description: string;
}

export interface CreationColumnDto {
  name: string;
  projectId: number;
}

export interface DeletingColumnDto {
  index: number;
  projectId: number;
}

export interface ChangeColumnIndexDto {
  from: number;
  to: number;
  projectId: number;
}

export interface CreationTaskDto {
  projectId: number;
  columnIndex: number;
  taskName: string;
}

export interface DeletingTaskDto {
  projectId: number;
  columnIndex: number;
  taskIndex: number;
}

export interface ChangeTaskIndexDto {
  fromColumn: number;
  toColumn: number;
  from: number;
  to: number;
}

export interface ChangeColumnNameDto {
  projectId: number;
  columnIndex: number;
  columnName: string;
}

export interface ChangeTaskNameDto {
  projectId: number;
  columnIndex: number;
  taskIndex: number;
  taskName: string;
}
