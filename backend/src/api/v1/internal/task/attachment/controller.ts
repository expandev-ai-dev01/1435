import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { taskAttachmentCreate, taskAttachmentDelete } from '@/services/taskAttachment';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {post} /api/v1/internal/task/:id/attachment Upload Task Attachment
 * @apiName CreateTaskAttachment
 * @apiGroup TaskAttachment
 * @apiVersion 1.0.0
 *
 * @apiDescription Uploads a file attachment to a task
 *
 * @apiParam {Number} id Task identifier
 * @apiParam {File} file File to upload (max 5MB)
 *
 * @apiSuccess {Number} idTaskAttachment Created attachment identifier
 *
 * @apiError {String} taskNotFound Task not found
 * @apiError {String} invalidFileFormat Invalid file format
 * @apiError {String} fileTooLarge File exceeds 5MB limit
 * @apiError {String} tooManyAttachments Maximum 5 attachments per task
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const bodySchema = z.object({
    fileName: z.string().min(1).max(255),
    fileSize: z.number().int().positive().max(5242880),
    fileType: z.enum(['pdf', 'doc', 'docx', 'jpg', 'png']),
    fileContent: z.string(),
  });

  try {
    const validatedParams = paramsSchema.parse(req.params);
    const validatedBody = bodySchema.parse(req.body);

    const data = await taskAttachmentCreate({
      idAccount: 1,
      idTask: validatedParams.id,
      ...validatedBody,
    });

    res.status(201).json(successResponse(data));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'taskNotFound') {
      res.status(404).json(errorResponse('Task not found'));
    } else if (error.message === 'invalidFileFormat') {
      res
        .status(400)
        .json(errorResponse('Invalid file format. Accepted formats: PDF, DOC, DOCX, JPG, PNG'));
    } else if (error.message === 'fileTooLarge') {
      res.status(400).json(errorResponse('File size exceeds 5MB limit'));
    } else if (error.message === 'tooManyAttachments') {
      res.status(400).json(errorResponse('Maximum 5 attachments per task exceeded'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {delete} /api/v1/internal/task/:id/attachment/:idAttachment Delete Task Attachment
 * @apiName DeleteTaskAttachment
 * @apiGroup TaskAttachment
 * @apiVersion 1.0.0
 *
 * @apiDescription Deletes a file attachment from a task
 *
 * @apiParam {Number} id Task identifier
 * @apiParam {Number} idAttachment Attachment identifier
 *
 * @apiSuccess {Boolean} success Deletion success
 *
 * @apiError {String} attachmentNotFound Attachment not found
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
    idAttachment: z.coerce.number().int().positive(),
  });

  try {
    const validated = paramsSchema.parse(req.params);

    const data = await taskAttachmentDelete({
      idAccount: 1,
      idTask: validated.id,
      idTaskAttachment: validated.idAttachment,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'attachmentNotFound') {
      res.status(404).json(errorResponse('Attachment not found'));
    } else {
      next(error);
    }
  }
}
