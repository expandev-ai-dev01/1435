/**
 * @component TaskForm
 * @summary Form component for creating and editing tasks
 * @domain task
 * @type domain-component
 * @category form
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TaskFormProps, TaskFormData } from './types';
import type { CreateTaskDto } from '../../types';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres').optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['0', '1', '2']).optional(),
  isDraft: z.boolean().optional(),
  hasRecurrence: z.boolean().optional(),
  recurrenceType: z.enum(['diária', 'semanal', 'mensal', 'anual']).optional(),
  recurrenceInterval: z.string().optional(),
  recurrenceEndDate: z.string().optional(),
});

export const TaskForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      dueDate: defaultValues?.dueDate || '',
      priority: defaultValues?.priority?.toString() || '1',
      isDraft: defaultValues?.isDraft || false,
      hasRecurrence: false,
      recurrenceType: 'diária',
      recurrenceInterval: '1',
      recurrenceEndDate: '',
    },
  });

  const hasRecurrence = watch('hasRecurrence');
  const isDraft = watch('isDraft');

  const handleFormSubmit = (data: TaskFormData) => {
    const submitData: CreateTaskDto = {
      idAccount: 1,
      idUser: 1,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      dueDate: data.dueDate || null,
      priority: parseInt(data.priority || '1') as 0 | 1 | 2,
      isDraft: data.isDraft || false,
      recurrenceConfig:
        data.hasRecurrence && data.recurrenceType
          ? {
              type: data.recurrenceType as 'diária' | 'semanal' | 'mensal' | 'anual',
              interval: parseInt(data.recurrenceInterval || '1'),
              endDate: data.recurrenceEndDate || null,
            }
          : null,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o título da tarefa"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descreva os detalhes da tarefa"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Vencimento
          </label>
          <input
            {...register('dueDate')}
            type="date"
            id="dueDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Prioridade
          </label>
          <select
            {...register('priority')}
            id="priority"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Baixa</option>
            <option value="1">Média</option>
            <option value="2">Alta</option>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center mb-4">
          <input
            {...register('hasRecurrence')}
            type="checkbox"
            id="hasRecurrence"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hasRecurrence" className="ml-2 block text-sm text-gray-700">
            Configurar recorrência
          </label>
        </div>

        {hasRecurrence && (
          <div className="space-y-4 pl-6 border-l-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="recurrenceType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Recorrência
                </label>
                <select
                  {...register('recurrenceType')}
                  id="recurrenceType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="diária">Diária</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="recurrenceInterval"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Intervalo
                </label>
                <input
                  {...register('recurrenceInterval')}
                  type="number"
                  id="recurrenceInterval"
                  min="1"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="recurrenceEndDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Data de Término (opcional)
              </label>
              <input
                {...register('recurrenceEndDate')}
                type="date"
                id="recurrenceEndDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...register('isDraft')}
          type="checkbox"
          id="isDraft"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isDraft" className="ml-2 block text-sm text-gray-700">
          Salvar como rascunho
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Salvando...' : isDraft ? 'Salvar Rascunho' : 'Criar Tarefa'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
