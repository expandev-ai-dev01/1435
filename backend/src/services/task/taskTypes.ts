/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {number} idTask - Unique task identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User identifier who created the task
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {Date | null} dueDate - Task due date
 * @property {TaskPriority} priority - Task priority level
 * @property {TaskStatus} status - Current task status
 * @property {boolean} isRecurring - Recurring task indicator
 * @property {RecurrenceConfig | null} recurrenceConfig - Recurrence configuration
 * @property {boolean} isDraft - Draft indicator
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 */
export interface TaskEntity {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  isRecurring: boolean;
  recurrenceConfig: RecurrenceConfig | null;
  isDraft: boolean;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for creating a new task
 */
export interface TaskCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority?: TaskPriority;
  isRecurring?: boolean;
  recurrenceConfig?: RecurrenceConfig | null;
  isDraft?: boolean;
}

/**
 * @interface TaskUpdateRequest
 * @description Request parameters for updating an existing task
 */
export interface TaskUpdateRequest {
  idAccount: number;
  idTask: number;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  isRecurring: boolean;
  recurrenceConfig?: RecurrenceConfig | null;
  isDraft: boolean;
}

/**
 * @interface TaskListRequest
 * @description Request parameters for listing tasks
 */
export interface TaskListRequest {
  idAccount: number;
  idUser: number;
  statusFilter?: TaskStatus;
  showDrafts?: boolean;
}

/**
 * @interface TaskGetRequest
 * @description Request parameters for getting a specific task
 */
export interface TaskGetRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
}

/**
 * @interface TaskListResponse
 * @description Response format for task list queries
 */
export interface TaskListResponse {
  idTask: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  isDraft: boolean;
  isHighPriority: boolean;
  isDueSoon: boolean;
  isRecurring: boolean;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface TaskDetailResponse
 * @description Response format for task detail queries
 */
export interface TaskDetailResponse {
  idTask: number;
  idUser: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  isRecurring: boolean;
  recurrenceConfig: RecurrenceConfig | null;
  isDraft: boolean;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface RecurrenceConfig
 * @description Configuration for recurring tasks
 */
export interface RecurrenceConfig {
  type: RecurrenceType;
  interval: number;
  endDate?: Date | null;
}

/**
 * @enum TaskPriority
 * @description Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

/**
 * @enum TaskStatus
 * @description Task status values
 */
export enum TaskStatus {
  Draft = 0,
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

/**
 * @type RecurrenceType
 * @description Recurrence type values
 */
export type RecurrenceType = 'diária' | 'semanal' | 'mensal' | 'anual';
