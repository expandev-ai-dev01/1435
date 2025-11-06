/**
 * @hook useTaskList
 * @summary Hook for fetching and managing task lists
 * @domain task
 * @type domain-hook
 * @category data
 */

import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { UseTaskListOptions, UseTaskListReturn } from './types';

export const useTaskList = (options: UseTaskListOptions): UseTaskListReturn => {
  const { params, enabled = true } = options;

  const query = useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskService.list(params),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
