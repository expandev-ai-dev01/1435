/**
 * @summary
 * Creates a new task with all specified parameters including optional fields
 * for attachments, recurrence configuration, and draft status.
 *
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier who is creating the task
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title (3-100 characters)
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Detailed task description (max 1000 characters)
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Task due date (cannot be in the past)
 *
 * @param {TINYINT} priority
 *   - Required: No
 *   - Description: Priority level (0=Low, 1=Medium, 2=High), defaults to 1
 *
 * @param {NVARCHAR(MAX)} recurrenceConfig
 *   - Required: No
 *   - Description: JSON configuration for recurring tasks
 *
 * @param {BIT} isDraft
 *   - Required: No
 *   - Description: Indicates if task is saved as draft, defaults to 0
 *
 * @returns {INT} idTask - Created task identifier
 *
 * @testScenarios
 * - Valid task creation with only required fields
 * - Task creation with all optional fields
 * - Draft task creation
 * - Recurring task creation with valid configuration
 * - Validation failures for invalid parameters
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = NULL,
  @dueDate DATE = NULL,
  @priority TINYINT = 1,
  @recurrenceConfig NVARCHAR(MAX) = NULL,
  @isDraft BIT = 0
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @idTask INTEGER;
  DECLARE @status TINYINT;
  DECLARE @isRecurring BIT = 0;

  BEGIN TRY
    /**
     * @validation Required parameter validation
     * @throw {titleRequired}
     */
    IF @title IS NULL OR LTRIM(RTRIM(@title)) = ''
    BEGIN
      ;THROW 51000, 'titleRequired', 1;
    END;

    /**
     * @validation Title length validation
     * @throw {titleTooShort}
     */
    IF LEN(LTRIM(RTRIM(@title))) < 3
    BEGIN
      ;THROW 51000, 'titleTooShort', 1;
    END;

    /**
     * @validation Title length validation
     * @throw {titleTooLong}
     */
    IF LEN(@title) > 100
    BEGIN
      ;THROW 51000, 'titleTooLong', 1;
    END;

    /**
     * @validation Description length validation
     * @throw {descriptionTooLong}
     */
    IF @description IS NOT NULL AND LEN(@description) > 1000
    BEGIN
      ;THROW 51000, 'descriptionTooLong', 1;
    END;

    /**
     * @validation Due date validation
     * @throw {dueDateInPast}
     */
    IF @dueDate IS NOT NULL AND @dueDate < CAST(GETUTCDATE() AS DATE)
    BEGIN
      ;THROW 51000, 'dueDateInPast', 1;
    END;

    /**
     * @validation Priority range validation
     * @throw {invalidPriority}
     */
    IF @priority NOT BETWEEN 0 AND 2
    BEGIN
      ;THROW 51000, 'invalidPriority', 1;
    END;

    /**
     * @rule {be-business-rule-005} Determine task status based on draft flag
     */
    IF @isDraft = 1
    BEGIN
      SET @status = 0; -- Draft
    END
    ELSE
    BEGIN
      SET @status = 1; -- Pending
    END;

    /**
     * @rule {be-recurrence-config} Process recurrence configuration if provided
     */
    IF @recurrenceConfig IS NOT NULL AND @recurrenceConfig <> ''
    BEGIN
      SET @isRecurring = 1;

      /**
       * @validation Recurrence configuration JSON validation
       * @throw {invalidRecurrenceConfig}
       */
      IF ISJSON(@recurrenceConfig) = 0
      BEGIN
        ;THROW 51000, 'invalidRecurrenceConfig', 1;
      END;
    END;

    BEGIN TRAN;

      /**
       * @rule {be-task-creation} Insert new task record
       */
      INSERT INTO [functional].[task] (
        [idAccount],
        [idUser],
        [title],
        [description],
        [dueDate],
        [priority],
        [status],
        [isRecurring],
        [recurrenceConfig],
        [isDraft],
        [dateCreated],
        [dateModified]
      )
      VALUES (
        @idAccount,
        @idUser,
        @title,
        @description,
        @dueDate,
        @priority,
        @status,
        @isRecurring,
        @recurrenceConfig,
        @isDraft,
        GETUTCDATE(),
        GETUTCDATE()
      );

      SET @idTask = SCOPE_IDENTITY();

      /**
       * @output {TaskCreated, 1, 1}
       * @column {INT} idTask
       * - Description: Created task identifier
       */
      SELECT @idTask AS [idTask];

    COMMIT TRAN;

  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0
      ROLLBACK TRAN;

    THROW;
  END CATCH;
END;
GO