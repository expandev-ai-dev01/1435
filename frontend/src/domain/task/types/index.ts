/**
 * @module task/types
 * @summary Type definitions for task domain
 * @domain task
 * @category types
 */

export interface Task {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: 0 | 1 | 2;
  status: 0 | 1 | 2 | 3 | 4;
  isDraft: boolean;
  isRecurring: boolean;
  recurrenceConfig: RecurrenceConfig | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrenceConfig {
  type: 'diária' | 'semanal' | 'mensal' | 'anual';
  interval: number;
  endDate: string | null;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: 0 | 1 | 2;
  recurrenceConfig?: RecurrenceConfig | null;
  isDraft?: boolean;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: 0 | 1 | 2;
  status?: 0 | 1 | 2 | 3 | 4;
  recurrenceConfig?: RecurrenceConfig | null;
  isDraft?: boolean;
}

export interface TaskListParams {
  idUser?: number;
  status?: 0 | 1 | 2 | 3 | 4;
  isDraft?: boolean;
}

export const PRIORITY_LABELS = {
  0: 'Baixa',
  1: 'Média',
  2: 'Alta',
} as const;

export const STATUS_LABELS = {
  0: 'Rascunho',
  1: 'Pendente',
  2: 'Em Andamento',
  3: 'Concluída',
  4: 'Cancelada',
} as const;
