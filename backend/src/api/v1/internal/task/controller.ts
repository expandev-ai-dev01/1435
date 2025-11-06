import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { taskCreate, taskList } from '@/services/task';
import { zNullableDateString, zBit } from '@/utils/zodValidation';

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with specified parameters
 *
 * @apiParam {Number} idAccount Account identifier
 * @apiParam {Number} idUser User identifier
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {Date} [dueDate] Due date (must be future date)
 * @apiParam {Number} [priority] Priority level (0=Low, 1=Medium, 2=High)
 * @apiParam {Boolean} [isDraft] Save as draft
 * @apiParam {Object} [recurrenceConfig] Recurrence configuration
 *
 * @apiSuccess {Number} idTask Created task identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const bodySchema = z.object({
    idAccount: z.number().int().positive(),
    idUser: z.number().int().positive(),
    title: z.string().min(3).max(100),
    description: z.string().max(1000).nullable().optional(),
    dueDate: zNullableDateString.optional(),
    priority: z.number().int().min(0).max(2).optional(),
    isDraft: zBit.optional(),
    recurrenceConfig: z
      .object({
        type: z.enum(['diária', 'semanal', 'mensal', 'anual']),
        interval: z.number().int().min(1).max(365),
        endDate: zNullableDateString.optional(),
      })
      .nullable()
      .optional(),
  });

  try {
    /**
     * @validation Request body validation
     * @throw {ValidationError}
     */
    const validated = bodySchema.parse(req.body);

    /**
     * @rule {be-database-requirement} Transform date strings to Date objects
     */
    const params = {
      ...validated,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      recurrenceConfig: validated.recurrenceConfig
        ? {
            ...validated.recurrenceConfig,
            endDate: validated.recurrenceConfig.endDate
              ? new Date(validated.recurrenceConfig.endDate)
              : null,
          }
        : null,
    };

    const result = await taskCreate(params);
    res.status(201).json(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'requiredParametersMissing') {
      res.status(400).json(errorResponse('Required parameters missing', 'VALIDATION_ERROR'));
    } else if (error.message === 'titleRequired') {
      res.status(400).json(errorResponse('O título da tarefa é obrigatório', 'VALIDATION_ERROR'));
    } else if (error.message === 'titleTooShort') {
      res
        .status(400)
        .json(errorResponse('O título deve ter pelo menos 3 caracteres', 'VALIDATION_ERROR'));
    } else if (error.message === 'titleTooLong') {
      res
        .status(400)
        .json(errorResponse('O título deve ter no máximo 100 caracteres', 'VALIDATION_ERROR'));
    } else if (error.message === 'descriptionTooLong') {
      res
        .status(400)
        .json(errorResponse('A descrição deve ter no máximo 1000 caracteres', 'VALIDATION_ERROR'));
    } else if (error.message === 'dueDateInPast') {
      res
        .status(400)
        .json(
          errorResponse(
            'A data de vencimento não pode ser anterior à data atual',
            'VALIDATION_ERROR'
          )
        );
    } else if (error.message === 'invalidPriority') {
      res.status(400).json(errorResponse('Prioridade inválida', 'VALIDATION_ERROR'));
    } else if (error.message === 'invalidRecurrenceConfig') {
      res
        .status(400)
        .json(errorResponse('Configuração de recorrência inválida', 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /api/v1/internal/task List Tasks
 * @apiName ListTasks
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists tasks for the authenticated user
 *
 * @apiParam {Number} idAccount Account identifier
 * @apiParam {Number} idUser User identifier
 * @apiParam {Number} [statusFilter] Filter by status
 * @apiParam {Boolean} [showDrafts] Include draft tasks
 *
 * @apiSuccess {Array} tasks Array of tasks
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const querySchema = z.object({
    idAccount: z.coerce.number().int().positive(),
    idUser: z.coerce.number().int().positive(),
    statusFilter: z.coerce.number().int().min(0).max(4).optional(),
    showDrafts: z.coerce.boolean().optional(),
  });

  try {
    const validated = querySchema.parse(req.query);
    const result = await taskList(validated);
    res.json(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else {
      next(error);
    }
  }
}
