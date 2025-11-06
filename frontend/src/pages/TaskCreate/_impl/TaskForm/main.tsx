/**
 * @component TaskForm
 * @summary Form component for creating tasks with validation
 * @domain task
 * @type form-component
 * @category task-management
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import type { TaskFormProps } from './types';
import type { TaskFormData } from '@/domain/task/types';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres')
    .refine((val) => val.trim().length > 0, 'O título não pode conter apenas espaços em branco'),
  description: z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres').optional(),
  dueDate: z.coerce.date().nullable().optional(),
  priority: z.coerce.number().int().min(0).max(2),
  isRecurring: z.boolean(),
  recurrenceConfig: z
    .object({
      type: z.enum(['diária', 'semanal', 'mensal', 'anual']),
      interval: z.coerce.number().int().min(1).max(365),
      endDate: z.coerce.date().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const TaskForm = ({ onSubmit, isSubmitting }: TaskFormProps) => {
  const [showRecurrence, setShowRecurrence] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 1,
      isRecurring: false,
      recurrenceConfig: null,
    },
  });

  const isRecurring = watch('isRecurring');

  const handleFormSubmit = (data: TaskFormData, isDraft: boolean) => {
    onSubmit(data, isDraft);
  };

  return (
    <form className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título <span className="text-red-500">*</span>
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

      {/* Description Field */}
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

      {/* Due Date Field */}
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

      {/* Priority Field */}
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
        {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
      </div>

      {/* Recurrence Toggle */}
      <div className="flex items-center">
        <input
          {...register('isRecurring')}
          type="checkbox"
          id="isRecurring"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          onChange={(e) => setShowRecurrence(e.target.checked)}
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
          Tarefa Recorrente
        </label>
      </div>

      {/* Recurrence Configuration */}
      {(isRecurring || showRecurrence) && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700">Configuração de Recorrência</h3>

          <div>
            <label
              htmlFor="recurrenceType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo
            </label>
            <select
              {...register('recurrenceConfig.type')}
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
              Intervalo (1-365)
            </label>
            <input
              {...register('recurrenceConfig.interval')}
              type="number"
              id="recurrenceInterval"
              min="1"
              max="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="recurrenceEndDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data de Término (opcional)
            </label>
            <input
              {...register('recurrenceConfig.endDate')}
              type="date"
              id="recurrenceEndDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleSubmit((data) => handleFormSubmit(data, false))}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
        </button>
        <button
          type="button"
          onClick={handleSubmit((data) => handleFormSubmit(data, true))}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Salvar Rascunho
        </button>
      </div>
    </form>
  );
};
