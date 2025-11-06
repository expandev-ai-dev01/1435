/**
 * @summary
 * Updates an existing task with new values for specified fields.
 * Handles draft to active task conversion.
 *
 * @procedure spTaskUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to update
 *
 * @param {NVARCHAR(100)} title
 *   - Required: No
 *   - Description: Updated task title
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Updated task description
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Updated due date
 *
 * @param {TINYINT} priority
 *   - Required: No
 *   - Description: Updated priority level
 *
 * @param {TINYINT} status
 *   - Required: No
 *   - Description: Updated task status
 *
 * @param {NVARCHAR(MAX)} recurrenceConfig
 *   - Required: No
 *   - Description: Updated recurrence configuration
 *
 * @param {BIT} isDraft
 *   - Required: No
 *   - Description: Updated draft status
 *
 * @returns Success indicator
 *
 * @testScenarios
 * - Update task with valid parameters
 * - Convert draft to active task
 * - Update recurring task configuration
 * - Validation failures for invalid parameters
 * - Verify multi-tenancy isolation
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskUpdate]
  @idAccount INTEGER,
  @idTask INTEGER,
  @title NVARCHAR(100) = NULL,
  @description NVARCHAR(1000) = NULL,
  @dueDate DATE = NULL,
  @priority TINYINT = NULL,
  @status TINYINT = NULL,
  @recurrenceConfig NVARCHAR(MAX) = NULL,
  @isDraft BIT = NULL
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @isRecurring BIT;

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

    /**
     * @validation Title validation if provided
     * @throw {titleTooShort}
     */
    IF @title IS NOT NULL AND LEN(LTRIM(RTRIM(@title))) < 3
    BEGIN
      ;THROW 51000, 'titleTooShort', 1;
    END;

    /**
     * @validation Title length validation
     * @throw {titleTooLong}
     */
    IF @title IS NOT NULL AND LEN(@title) > 100
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
    IF @priority IS NOT NULL AND @priority NOT BETWEEN 0 AND 2
    BEGIN
      ;THROW 51000, 'invalidPriority', 1;
    END;

    /**
     * @validation Status range validation
     * @throw {invalidStatus}
     */
    IF @status IS NOT NULL AND @status NOT BETWEEN 0 AND 4
    BEGIN
      ;THROW 51000, 'invalidStatus', 1;
    END;

    /**
     * @rule {be-recurrence-config} Validate recurrence configuration if provided
     */
    IF @recurrenceConfig IS NOT NULL AND @recurrenceConfig <> ''
    BEGIN
      IF ISJSON(@recurrenceConfig) = 0
      BEGIN
        ;THROW 51000, 'invalidRecurrenceConfig', 1;
      END;
      SET @isRecurring = 1;
    END
    ELSE IF @recurrenceConfig = ''
    BEGIN
      SET @isRecurring = 0;
      SET @recurrenceConfig = NULL;
    END;

    /**
     * @rule {be-business-rule-022} Convert draft to active task
     */
    IF @isDraft = 0 AND EXISTS (
      SELECT 1
      FROM [functional].[task] [tsk]
      WHERE [tsk].[idTask] = @idTask
        AND [tsk].[idAccount] = @idAccount
        AND [tsk].[isDraft] = 1
    )
    BEGIN
      IF @status IS NULL
        SET @status = 1; -- Set to Pending when converting from draft
    END;

    BEGIN TRAN;

      /**
       * @rule {be-task-update} Update task with provided values
       */
      UPDATE [functional].[task]
      SET
        [title] = ISNULL(@title, [title]),
        [description] = CASE WHEN @description IS NOT NULL THEN @description ELSE [description] END,
        [dueDate] = CASE WHEN @dueDate IS NOT NULL THEN @dueDate ELSE [dueDate] END,
        [priority] = ISNULL(@priority, [priority]),
        [status] = ISNULL(@status, [status]),
        [isRecurring] = ISNULL(@isRecurring, [isRecurring]),
        [recurrenceConfig] = CASE WHEN @recurrenceConfig IS NOT NULL THEN @recurrenceConfig ELSE [recurrenceConfig] END,
        [isDraft] = ISNULL(@isDraft, [isDraft]),
        [dateModified] = GETUTCDATE()
      WHERE [idTask] = @idTask
        AND [idAccount] = @idAccount;

      /**
       * @output {TaskUpdated, 1, 1}
       * @column {BIT} success
       * - Description: Update success indicator
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