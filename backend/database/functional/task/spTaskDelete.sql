/**
 * @summary
 * Soft deletes a task by setting the deleted flag to 1.
 * Also soft deletes all associated subtasks.
 *
 * @procedure spTaskDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to delete
 *
 * @returns Success indicator
 *
 * @testScenarios
 * - Delete existing task
 * - Verify subtasks are also deleted
 * - Handle non-existent task
 * - Verify multi-tenancy isolation
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskDelete]
  @idAccount INTEGER,
  @idTask INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  BEGIN TRY
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

    BEGIN TRAN;

      /**
       * @rule {be-soft-delete} Soft delete task
       */
      UPDATE [functional].[task]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idTask] = @idTask
        AND [idAccount] = @idAccount;

      /**
       * @rule {be-cascade-delete} Soft delete all associated subtasks
       */
      UPDATE [functional].[subtask]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idTask] = @idTask
        AND [idAccount] = @idAccount
        AND [deleted] = 0;

      /**
       * @output {TaskDeleted, 1, 1}
       * @column {BIT} success
       * - Description: Delete success indicator
       */
      SELECT 1 AS [success];

    COMMIT TRAN;

  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0
      ROLLBACK TRAN;

    THROW;
  END CATCH;
END;
GO