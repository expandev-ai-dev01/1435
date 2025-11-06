/**
 * @module task/components/TaskForm/types
 * @summary Type definitions for TaskForm component
 */

import type { CreateTaskDto } from '../../types';

export interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateTaskDto>;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: '0' | '1' | '2';
  isDraft: boolean;
  hasRecurrence: boolean;
  recurrenceType?: 'diária' | 'semanal' | 'mensal' | 'anual';
  recurrenceInterval?: number;
  recurrenceEndDate?: string;
}
