/**
 * @hook useTaskCreate
 * @summary Hook for creating new tasks with mutation handling
 * @domain task
 * @type domain-hook
 * @category data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { UseTaskCreateOptions, UseTaskCreateReturn } from './types';

export const useTaskCreate = (options: UseTaskCreateOptions = {}): UseTaskCreateReturn => {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  const mutation = useMutation({
    mutationFn: taskService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    create: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
