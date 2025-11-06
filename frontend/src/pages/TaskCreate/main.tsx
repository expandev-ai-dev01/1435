/**
 * @page TaskCreatePage
 * @summary Page for creating new tasks with full form
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
      // Show success notification (to be implemented)
      setTimeout(() => {
        navigate('/tasks');
      }, 3000);
    },
    onError: (error: Error) => {
      console.error('Failed to create task:', error);
    },
  });

  const handleSubmit = async (data: CreateTaskDto) => {
    await createTask(data);
  };

  const handleCancel = () => {
    navigate('/tasks');
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
