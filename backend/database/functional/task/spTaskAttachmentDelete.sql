/**
 * @summary
 * Deletes a task attachment.
 *
 * @procedure spTaskAttachmentDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/task/:id/attachment/:idAttachment
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier
 *
 * @param {INT} idTaskAttachment
 *   - Required: Yes
 *   - Description: Attachment identifier
 *
 * @returns Success indicator
 *
 * @testScenarios
 * - Valid attachment deletion
 * - Attachment not found
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskAttachmentDelete]
  @idAccount INTEGER,
  @idTask INTEGER,
  @idTaskAttachment INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Attachment existence validation
   * @throw {attachmentNotFound}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [functional].[taskAttachment] [tskAtt]
    WHERE [tskAtt].[idTaskAttachment] = @idTaskAttachment
      AND [tskAtt].[idTask] = @idTask
      AND [tskAtt].[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'attachmentNotFound', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {be-database-requirement} Hard delete attachment
       */
      DELETE FROM [tskAtt]
      FROM [functional].[taskAttachment] [tskAtt]
      WHERE [tskAtt].[idTaskAttachment] = @idTaskAttachment
        AND [tskAtt].[idTask] = @idTask
        AND [tskAtt].[idAccount] = @idAccount;

      /**
       * @output {AttachmentDeleted, 1, 1}
       * @column {BIT} success
       * - Description: Deletion success indicator
       */
      SELECT 1 AS [success];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO
