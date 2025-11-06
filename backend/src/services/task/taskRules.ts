import {
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskListRequest,
  TaskListResponse,
  TaskDetailResponse,
} from './taskTypes';

/**
 * @summary
 * Creates a new task with validation and automatic field generation.
 *
 * @function taskCreate
 * @module task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.title - Task title
 * @param {string} [params.description] - Task description
 * @param {Date} [params.dueDate] - Due date
 * @param {number} [params.priority] - Priority level
 * @param {boolean} [params.isDraft] - Draft flag
 * @param {string} [params.recurrenceType] - Recurrence type
 * @param {number} [params.recurrenceInterval] - Recurrence interval
 * @param {Date} [params.recurrenceEndDate] - Recurrence end date
 *
 * @returns {Promise<{ idTask: number }>} Created task identifier
 *
 * @throws {Error} When validation fails
 * @throws {Error} When database operation fails
 */
export async function taskCreate(params: TaskCreateRequest): Promise<{ idTask: number }> {
  const tasks: any[] = [];

  /**
   * @validation Title required validation
   */
  if (!params.title || params.title.trim().length === 0) {
    throw new Error('titleRequired');
  }

  /**
   * @validation Title length validation
   */
  if (params.title.trim().length < 3) {
    throw new Error('titleTooShort');
  }

  if (params.title.length > 100) {
    throw new Error('titleTooLong');
  }

  /**
   * @validation Description length validation
   */
  if (params.description && params.description.length > 1000) {
    throw new Error('descriptionTooLong');
  }

  /**
   * @validation Due date validation
   */
  if (params.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(params.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      throw new Error('dueDateInPast');
    }
  }

  /**
   * @validation Recurrence validation
   */
  if (params.recurrenceType) {
    const validTypes = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validTypes.includes(params.recurrenceType)) {
      throw new Error('invalidRecurrenceType');
    }

    if (
      !params.recurrenceInterval ||
      params.recurrenceInterval < 1 ||
      params.recurrenceInterval > 365
    ) {
      throw new Error('invalidRecurrenceInterval');
    }

    if (params.recurrenceEndDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(params.recurrenceEndDate);
      endDate.setHours(0, 0, 0, 0);

      if (endDate <= today) {
        throw new Error('invalidRecurrenceEndDate');
      }
    }
  }

  /**
   * @rule {be-database-requirement} Create task in memory
   */
  const idTask = tasks.length + 1;
  const status = params.isDraft ? 0 : 1;

  const task = {
    idTask,
    idAccount: params.idAccount,
    idUser: params.idUser,
    title: params.title.trim(),
    description: params.description || null,
    dueDate: params.dueDate || null,
    priority: params.priority ?? 1,
    status,
    isDraft: params.isDraft ?? false,
    recurrenceType: params.recurrenceType || null,
    recurrenceInterval: params.recurrenceInterval || null,
    recurrenceEndDate: params.recurrenceEndDate || null,
    dateCreated: new Date(),
    dateModified: new Date(),
    deleted: false,
  };

  tasks.push(task);

  return { idTask };
}

/**
 * @summary
 * Lists tasks for a user with filtering options.
 *
 * @function taskList
 * @module task
 *
 * @param {TaskListRequest} params - List parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} [params.status] - Filter by status
 * @param {boolean} [params.isDraft] - Filter drafts
 *
 * @returns {Promise<TaskListResponse[]>} List of tasks
 */
export async function taskList(params: TaskListRequest): Promise<TaskListResponse[]> {
  const tasks: any[] = [];

  /**
   * @rule {be-database-requirement} Filter tasks from memory
   */
  let filteredTasks = tasks.filter(
    (task) =>
      task.idAccount === params.idAccount && task.idUser === params.idUser && task.deleted === false
  );

  if (params.status !== undefined && params.status !== null) {
    filteredTasks = filteredTasks.filter((task) => task.status === params.status);
  }

  if (params.isDraft !== undefined && params.isDraft !== null) {
    filteredTasks = filteredTasks.filter((task) => task.isDraft === params.isDraft);
  }

  /**
   * @rule {BR-003} Calculate urgent flag for tasks due within 24h
   */
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const result: TaskListResponse[] = filteredTasks.map((task) => ({
    idTask: task.idTask,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    isDraft: task.isDraft,
    isUrgent:
      task.dueDate && new Date(task.dueDate) <= tomorrow && task.status !== 3 && task.status !== 4,
    dateCreated: task.dateCreated,
  }));

  /**
   * @rule {BR-021} Sort tasks: drafts first, then by priority, due date, and creation date
   */
  result.sort((a, b) => {
    if (a.isDraft !== b.isDraft) return b.isDraft ? 1 : -1;
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (a.dueDate && b.dueDate) {
      const dateCompare = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (dateCompare !== 0) return dateCompare;
    }
    return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
  });

  return result;
}

/**
 * @summary
 * Retrieves detailed information for a specific task.
 *
 * @function taskGet
 * @module task
 *
 * @param {object} params - Get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<TaskDetailResponse>} Task details
 *
 * @throws {Error} When task not found
 */
export async function taskGet(params: {
  idAccount: number;
  idTask: number;
}): Promise<TaskDetailResponse> {
  const tasks: any[] = [];
  const attachments: any[] = [];

  /**
   * @validation Task existence validation
   */
  const task = tasks.find(
    (t) => t.idTask === params.idTask && t.idAccount === params.idAccount && t.deleted === false
  );

  if (!task) {
    throw new Error('taskNotFound');
  }

  /**
   * @rule {be-database-requirement} Get task attachments
   */
  const taskAttachments = attachments
    .filter((a) => a.idTask === params.idTask && a.idAccount === params.idAccount)
    .map((a) => ({
      idTaskAttachment: a.idTaskAttachment,
      fileName: a.fileName,
      fileSize: a.fileSize,
      fileType: a.fileType,
      storageUrl: a.storageUrl,
      dateCreated: a.dateCreated,
    }));

  return {
    idTask: task.idTask,
    idUser: task.idUser,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    isDraft: task.isDraft,
    recurrenceType: task.recurrenceType,
    recurrenceInterval: task.recurrenceInterval,
    recurrenceEndDate: task.recurrenceEndDate,
    dateCreated: task.dateCreated,
    dateModified: task.dateModified,
    attachments: taskAttachments,
  };
}

/**
 * @summary
 * Updates an existing task with validation.
 *
 * @function taskUpdate
 * @module task
 *
 * @param {TaskUpdateRequest} params - Update parameters
 *
 * @returns {Promise<{ success: boolean }>} Update result
 *
 * @throws {Error} When validation fails
 * @throws {Error} When task not found
 */
export async function taskUpdate(params: TaskUpdateRequest): Promise<{ success: boolean }> {
  const tasks: any[] = [];

  /**
   * @validation Task existence validation
   */
  const taskIndex = tasks.findIndex(
    (t) => t.idTask === params.idTask && t.idAccount === params.idAccount && t.deleted === false
  );

  if (taskIndex === -1) {
    throw new Error('taskNotFound');
  }

  /**
   * @validation Title validation
   */
  if (params.title !== undefined) {
    if (params.title.trim().length < 3) {
      throw new Error('titleTooShort');
    }
    if (params.title.length > 100) {
      throw new Error('titleTooLong');
    }
  }

  /**
   * @validation Description validation
   */
  if (params.description !== undefined && params.description && params.description.length > 1000) {
    throw new Error('descriptionTooLong');
  }

  /**
   * @validation Due date validation
   */
  if (params.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(params.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      throw new Error('dueDateInPast');
    }
  }

  /**
   * @rule {BR-022} Convert draft to active when isDraft changes to false
   */
  const task = tasks[taskIndex];
  const wasDraft = task.isDraft;

  if (params.title !== undefined) task.title = params.title.trim();
  if (params.description !== undefined) task.description = params.description;
  if (params.dueDate !== undefined) task.dueDate = params.dueDate;
  if (params.priority !== undefined) task.priority = params.priority;
  if (params.isDraft !== undefined) {
    task.isDraft = params.isDraft;
    if (wasDraft && !params.isDraft) {
      task.status = 1;
    }
  }
  if (params.status !== undefined && !(wasDraft && params.isDraft === false)) {
    task.status = params.status;
  }
  task.dateModified = new Date();

  return { success: true };
}

/**
 * @summary
 * Soft deletes a task by setting the deleted flag.
 *
 * @function taskDelete
 * @module task
 *
 * @param {object} params - Delete parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<{ success: boolean }>} Deletion result
 *
 * @throws {Error} When task not found
 */
export async function taskDelete(params: {
  idAccount: number;
  idTask: number;
}): Promise<{ success: boolean }> {
  const tasks: any[] = [];

  /**
   * @validation Task existence validation
   */
  const task = tasks.find(
    (t) => t.idTask === params.idTask && t.idAccount === params.idAccount && t.deleted === false
  );

  if (!task) {
    throw new Error('taskNotFound');
  }

  /**
   * @rule {be-database-requirement} Soft delete task
   */
  task.deleted = true;
  task.dateModified = new Date();

  return { success: true };
}
