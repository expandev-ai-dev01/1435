/**
 * @module task/hooks/useTaskList/types
 * @summary Type definitions for useTaskList hook
 */

import type { Task, TaskListParams } from '../../types';

export interface UseTaskListOptions {
  params: TaskListParams;
  enabled?: boolean;
}

export interface UseTaskListReturn {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
