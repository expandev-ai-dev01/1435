/**
 * @module pages/TaskCreate/_impl/TaskForm/types
 * @summary Type definitions for TaskForm component
 */

import type { TaskFormData } from '@/domain/task/types';

export interface TaskFormProps {
  onSubmit: (data: TaskFormData, isDraft: boolean) => void;
  isSubmitting: boolean;
}
