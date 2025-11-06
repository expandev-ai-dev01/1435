/**
 * @module task
 * @summary Task management domain module
 * @domain functional
 * @version 1.0.0
 */

// Domain public exports - Types
export * from './types';

// Domain public exports - Services
export * from './services';

// Domain public exports - Hooks
export * from './hooks';

// Module metadata
export const moduleMetadata = {
  name: 'task',
  domain: 'functional',
  version: '1.0.0',
  publicServices: ['taskService'],
  publicHooks: ['useTaskCreate'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/types'],
    external: ['@tanstack/react-query', 'axios'],
    domains: [],
  },
  exports: {
    services: ['taskService'],
    hooks: ['useTaskCreate'],
    types: ['Task', 'CreateTaskDto', 'TaskFormData', 'RecurrenceConfig'],
  },
} as const;
