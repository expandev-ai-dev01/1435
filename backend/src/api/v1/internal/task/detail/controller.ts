import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { taskGet } from '@/services/task';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {get} /api/v1/internal/task/:id Get Task Details
 * @apiName GetTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information for a specific task including attachments
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Boolean} success Success indicator
 * @apiSuccess {Object} data Task details
 * @apiSuccess {Number} data.idTask Task identifier
 * @apiSuccess {String} data.title Task title
 * @apiSuccess {String} data.description Task description
 * @apiSuccess {Date} data.dueDate Due date
 * @apiSuccess {Number} data.priority Priority level
 * @apiSuccess {Number} data.status Task status
 * @apiSuccess {Boolean} data.isDraft Draft indicator
 * @apiSuccess {Boolean} data.isRecurring Recurring task indicator
 * @apiSuccess {Object} data.recurrenceConfig Recurrence configuration
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  try {
    const validated = paramsSchema.parse(req.params);

    /**
     * @remarks In a real implementation, idAccount and idUser would come from authentication middleware
     * For now, using mock values
     */
    const mockIdAccount = 1;
    const mockIdUser = 1;

    const data = await taskGet({
      idAccount: mockIdAccount,
      idUser: mockIdUser,
      idTask: validated.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'requiredParametersMissing') {
      res.status(400).json(errorResponse('Required parameters missing'));
    } else if (error.message === 'taskDoesntExist') {
      res.status(404).json(errorResponse('Task not found', 'TASK_NOT_FOUND'));
    } else {
      next(error);
    }
  }
}
