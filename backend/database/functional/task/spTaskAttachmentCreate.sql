/**
 * @summary
 * Creates a new task attachment with validation.
 * Validates file format, size, and attachment count limits.
 *
 * @procedure spTaskAttachmentCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task/:id/attachment
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
 * @param {NVARCHAR(255)} fileName
 *   - Required: Yes
 *   - Description: File name
 *
 * @param {INT} fileSize
 *   - Required: Yes
 *   - Description: File size in bytes (max 5MB)
 *
 * @param {VARCHAR(50)} fileType
 *   - Required: Yes
 *   - Description: File type (pdf, doc, docx, jpg, png)
 *
 * @param {NVARCHAR(500)} storageUrl
 *   - Required: Yes
 *   - Description: Storage URL for the file
 *
 * @returns {INT} idTaskAttachment - Created attachment identifier
 *
 * @testScenarios
 * - Valid attachment creation
 * - Task not found
 * - Invalid file format
 * - File too large
 * - Too many attachments (max 5)
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskAttachmentCreate]
  @idAccount INTEGER,
  @idTask INTEGER,
  @fileName NVARCHAR(255),
  @fileSize INTEGER,
  @fileType VARCHAR(50),
  @storageUrl NVARCHAR(500)
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
   * @validation File format validation
   * @throw {invalidFileFormat}
   */
  IF (@fileType NOT IN ('pdf', 'doc', 'docx', 'jpg', 'png'))
  BEGIN
    ;THROW 51000, 'invalidFileFormat', 1;
  END;

  /**
   * @validation File size validation
   * @throw {fileTooLarge}
   */
  IF (@fileSize <= 0 OR @fileSize > 5242880)
  BEGIN
    ;THROW 51000, 'fileTooLarge', 1;
  END;

  /**
   * @validation Maximum attachments validation
   * @throw {tooManyAttachments}
   */
  DECLARE @attachmentCount INTEGER;
  
  SELECT @attachmentCount = COUNT(*)
  FROM [functional].[taskAttachment] [tskAtt]
  WHERE [tskAtt].[idTask] = @idTask
    AND [tskAtt].[idAccount] = @idAccount;

  IF (@attachmentCount >= 5)
  BEGIN
    ;THROW 51000, 'tooManyAttachments', 1;
  END;

  DECLARE @idTaskAttachment INTEGER;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {be-database-requirement} Insert attachment with validated data
       */
      INSERT INTO [functional].[taskAttachment] (
        [idAccount],
        [idTask],
        [fileName],
        [fileSize],
        [fileType],
        [storageUrl]
      )
      VALUES (
        @idAccount,
        @idTask,
        @fileName,
        @fileSize,
        @fileType,
        @storageUrl
      );

      SET @idTaskAttachment = SCOPE_IDENTITY();

      /**
       * @output {AttachmentCreated, 1, 1}
       * @column {INT} idTaskAttachment
       * - Description: Created attachment identifier
       */
      SELECT @idTaskAttachment AS [idTaskAttachment];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO
