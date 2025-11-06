/**
 * @service taskService
 * @summary Task management service for authenticated endpoints
 * @domain task
 * @type rest-service
 * @apiContext internal
 */

import { authenticatedClient } from '@/core/lib/api';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskListParams } from '../types';
import type { ApiResponse } from '@/core/types';

export const taskService = {
  /**
   * @endpoint GET /api/v1/internal/task
   * @summary Fetches list of tasks with filters
   */
  async list(params?: TaskListParams): Promise<Task[]> {
    const response = await authenticatedClient.get<ApiResponse<Task[]>>('/task', { params });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/task/:id
   * @summary Fetches single task by ID
   */
  async getById(id: number): Promise<Task> {
    const response = await authenticatedClient.get<ApiResponse<Task>>(`/task/${id}`);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/task
   * @summary Creates new task
   */
  async create(data: CreateTaskDto): Promise<Task> {
    const response = await authenticatedClient.post<ApiResponse<Task>>('/task', data);
    return response.data.data;
  },

  /**
   * @endpoint PUT /api/v1/internal/task/:id
   * @summary Updates existing task
   */
  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const response = await authenticatedClient.put<ApiResponse<Task>>(`/task/${id}`, data);
    return response.data.data;
  },

  /**
   * @endpoint DELETE /api/v1/internal/task/:id
   * @summary Deletes task
   */
  async delete(id: number): Promise<void> {
    await authenticatedClient.delete(`/task/${id}`);
  },
};
