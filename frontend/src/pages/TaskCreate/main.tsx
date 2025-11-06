/**
 * @page TaskCreatePage
 * @summary Page for creating new tasks with form and validation
 * @domain task
 * @type form-page
 * @category task-management
 */

import { useNavigate } from 'react-router-dom';
import { TaskForm } from '@/domain/task/components/TaskForm';
import { useTaskCreate } from '@/domain/task/hooks/useTaskCreate';
import type { CreateTaskDto } from '@/domain/task/types';

export const TaskCreatePage = () => {
  const navigate = useNavigate();

  const { createTask, isCreating } = useTaskCreate({
    onSuccess: (task) => {
      // Show success notification (to be implemented in FC-007)
      console.log('Task created successfully:', task);
      navigate('/');
    },
    onError: (error: Error) => {
      // Show error notification (to be implemented in FC-007)
      console.error('Failed to create task:', error);
    },
  });

  const handleSubmit = async (data: CreateTaskDto) => {
    try {
      await createTask(data);
    } catch (error: unknown) {
      console.error('Error creating task:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Criar Nova Tarefa</h1>
        <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isCreating} />
      </div>
    </div>
  );
};

export default TaskCreatePage;
