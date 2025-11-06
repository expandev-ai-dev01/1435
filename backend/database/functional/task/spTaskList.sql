/**
 * @summary
 * Retrieves a list of tasks for a specific account with filtering options
 * for status, draft flag, and due date proximity.
 *
 * @procedure spTaskList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: No
 *   - Description: Filter by specific user (optional)
 *
 * @param {TINYINT} status
 *   - Required: No
 *   - Description: Filter by task status (optional)
 *
 * @param {BIT} isDraft
 *   - Required: No
 *   - Description: Filter by draft status (optional)
 *
 * @returns Multiple result sets with task information
 *
 * @testScenarios
 * - List all tasks for account
 * - Filter tasks by user
 * - Filter tasks by status
 * - Filter draft tasks
 * - Verify multi-tenancy isolation
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskList]
  @idAccount INTEGER,
  @idUser INTEGER = NULL,
  @status TINYINT = NULL,
  @isDraft BIT = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @output {TaskList, n, n}
   * @column {INT} idTask - Task identifier
   * @column {INT} idUser - User identifier
   * @column {NVARCHAR} title - Task title
   * @column {NVARCHAR} description - Task description
   * @column {DATE} dueDate - Due date
   * @column {TINYINT} priority - Priority level
   * @column {TINYINT} status - Task status
   * @column {BIT} isRecurring - Recurring flag
   * @column {BIT} isDraft - Draft flag
   * @column {BIT} isDueSoon - Due within 24 hours flag
   * @column {INT} subtaskCount - Number of subtasks
   * @column {INT} completedSubtaskCount - Number of completed subtasks
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
    [tsk].[isDraft],
    CASE
      WHEN [tsk].[dueDate] IS NOT NULL
        AND [tsk].[dueDate] <= DATEADD(DAY, 1, CAST(GETUTCDATE() AS DATE))
        AND [tsk].[dueDate] >= CAST(GETUTCDATE() AS DATE)
      THEN 1
      ELSE 0
    END AS [isDueSoon],
    (
      SELECT COUNT(*)
      FROM [functional].[subtask] [stsk]
      WHERE [stsk].[idAccount] = [tsk].[idAccount]
        AND [stsk].[idTask] = [tsk].[idTask]
        AND [stsk].[deleted] = 0
    ) AS [subtaskCount],
    (
      SELECT COUNT(*)
      FROM [functional].[subtask] [stsk]
      WHERE [stsk].[idAccount] = [tsk].[idAccount]
        AND [stsk].[idTask] = [tsk].[idTask]
        AND [stsk].[status] = 1
        AND [stsk].[deleted] = 0
    ) AS [completedSubtaskCount],
    [tsk].[dateCreated],
    [tsk].[dateModified]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idAccount] = @idAccount
    AND [tsk].[deleted] = 0
    AND (@idUser IS NULL OR [tsk].[idUser] = @idUser)
    AND (@status IS NULL OR [tsk].[status] = @status)
    AND (@isDraft IS NULL OR [tsk].[isDraft] = @isDraft)
  ORDER BY
    [tsk].[priority] DESC,
    [tsk].[dueDate] ASC,
    [tsk].[dateCreated] DESC;
END;
GO