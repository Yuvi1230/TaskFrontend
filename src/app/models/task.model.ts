export type TaskStatus ='ALL_TASK'| 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskResponse {
  id: number;
  title: string;
  description?: string | null;
  dueDate: string;     // yyyy-mm-dd
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string | null;
}

export interface TaskRequest {
  title: string;
  description?: string | null;
  dueDate: string;
  status: TaskStatus;
}