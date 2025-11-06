/**
 * @summary
 * Retrieves detailed information for a specific task including
 * subtasks and attachments.
 *
 * @procedure spTaskGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier
 *
 * @returns Multiple result sets with task details, subtasks, and attachments
 *
 * @testScenarios
 * - Retrieve existing task with all details
 * - Verify multi-tenancy isolation
 * - Handle non-existent task
 * - Retrieve task with subtasks and attachments
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskGet]
  @idAccount INTEGER,
  @idTask INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Task existence validation
   * @throw {taskNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [functional].[task] [tsk]
    WHERE [tsk].[idTask] = @idTask
      AND [tsk].[idAccount] = @idAccount
      AND [tsk].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'taskNotFound', 1;
  END;

  /**
   * @output {TaskDetail, 1, n}
   * @column {INT} idTask - Task identifier
   * @column {INT} idUser - User identifier
   * @column {NVARCHAR} title - Task title
   * @column {NVARCHAR} description - Task description
   * @column {DATE} dueDate - Due date
   * @column {TINYINT} priority - Priority level
   * @column {TINYINT} status - Task status
   * @column {BIT} isRecurring - Recurring flag
   * @column {NVARCHAR} recurrenceConfig - Recurrence configuration JSON
   * @column {BIT} isDraft - Draft flag
   * @column {DATETIME2} dateCreated - Creation timestamp
   * @column {DATETIME2} dateModified - Last modification timestamp
   */
  SELECT
    [tsk].[idTask],
    [tsk].[idUser],
    [tsk].[title],
    [tsk].[description],
    [tsk].[dueDate],
    [tsk].[priority],
    [tsk].[status],
    [tsk].[isRecurring],
    [tsk].[recurrenceConfig],
    [tsk].[isDraft],
    [tsk].[dateCreated],
    [tsk].[dateModified]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idTask] = @idTask
    AND [tsk].[idAccount] = @idAccount
    AND [tsk].[deleted] = 0;

  /**
   * @output {SubtaskList, n, n}
   * @column {INT} idSubtask - Subtask identifier
   * @column {NVARCHAR} title - Subtask title
   * @column {NVARCHAR} description - Subtask description
   * @column {TINYINT} status - Subtask status
   * @column {INT} orderIndex - Display order
   * @column {DATETIME2} dateCreated - Creation timestamp
   */
  SELECT
    [stsk].[idSubtask],
    [stsk].[title],
    [stsk].[description],
    [stsk].[status],
    [stsk].[orderIndex],
    [stsk].[dateCreated]
  FROM [functional].[subtask] [stsk]
  WHERE [stsk].[idTask] = @idTask
    AND [stsk].[idAccount] = @idAccount
    AND [stsk].[deleted] = 0
  ORDER BY [stsk].[orderIndex];

  /**
   * @output {AttachmentList, n, n}
   * @column {INT} idTaskAttachment - Attachment identifier
   * @column {NVARCHAR} fileName - File name
   * @column {INT} fileSize - File size in bytes
   * @column {VARCHAR} fileType - File MIME type
   * @column {NVARCHAR} storageUrl - Storage URL
   * @column {DATETIME2} dateCreated - Upload timestamp
   */
  SELECT
    [tskAtt].[idTaskAttachment],
    [tskAtt].[fileName],
    [tskAtt].[fileSize],
    [tskAtt].[fileType],
    [tskAtt].[storageUrl],
    [tskAtt].[dateCreated]
  FROM [functional].[taskAttachment] [tskAtt]
  WHERE [tskAtt].[idTask] = @idTask
    AND [tskAtt].[idAccount] = @idAccount
  ORDER BY [tskAtt].[dateCreated];
END;
GO