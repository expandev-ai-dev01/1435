import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';
import * as taskAttachmentController from '@/api/v1/internal/task/attachment/controller';

const router = Router();

// Task routes
router.post('/task', taskController.createHandler);
router.get('/task', taskController.listHandler);
router.get('/task/:id', taskController.getHandler);
router.put('/task/:id', taskController.updateHandler);
router.delete('/task/:id', taskController.deleteHandler);

// Task attachment routes
router.post('/task/:id/attachment', taskAttachmentController.createHandler);
router.delete('/task/:id/attachment/:idAttachment', taskAttachmentController.deleteHandler);

export default router;
