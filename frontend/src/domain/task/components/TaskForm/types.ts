/**
 * @module task/components/TaskForm/types
 * @summary Type definitions for TaskForm component
 */

import type { CreateTaskDto } from '../../types';

export interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<CreateTaskDto>;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  recurrenceType: string;
  recurrenceInterval: string;
  recurrenceEndDate: string;
  isDraft: boolean;
}
