/**
 * @schema functional
 * Business logic schema for task management system
 */
CREATE SCHEMA [functional];
GO

/**
 * @table task Task management entity
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(1000) NULL,
  [dueDate] DATE NULL,
  [priority] TINYINT NOT NULL,
  [status] TINYINT NOT NULL,
  [isRecurring] BIT NOT NULL DEFAULT (0),
  [recurrenceConfig] NVARCHAR(MAX) NULL,
  [isDraft] BIT NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskAttachment Task file attachments
 * @multitenancy true
 * @softDelete false
 * @alias tskAtt
 */
CREATE TABLE [functional].[taskAttachment] (
  [idTaskAttachment] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [fileName] NVARCHAR(255) NOT NULL,
  [fileSize] INTEGER NOT NULL,
  [fileType] VARCHAR(50) NOT NULL,
  [storageUrl] NVARCHAR(500) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @table subtask Task subtasks
 * @multitenancy true
 * @softDelete true
 * @alias stsk
 */
CREATE TABLE [functional].[subtask] (
  [idSubtask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(500) NULL,
  [status] TINYINT NOT NULL,
  [orderIndex] INTEGER NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskTemplate Task templates for quick creation
 * @multitenancy true
 * @softDelete true
 * @alias tskTpl
 */
CREATE TABLE [functional].[taskTemplate] (
  [idTaskTemplate] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  [description] NVARCHAR(200) NULL,
  [templateData] NVARCHAR(MAX) NOT NULL,
  [isShared] BIT NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @primaryKey pkTaskAttachment
 * @keyType Object
 */
ALTER TABLE [functional].[taskAttachment]
ADD CONSTRAINT [pkTaskAttachment] PRIMARY KEY CLUSTERED ([idTaskAttachment]);
GO

/**
 * @primaryKey pkSubtask
 * @keyType Object
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [pkSubtask] PRIMARY KEY CLUSTERED ([idSubtask]);
GO

/**
 * @primaryKey pkTaskTemplate
 * @keyType Object
 */
ALTER TABLE [functional].[taskTemplate]
ADD CONSTRAINT [pkTaskTemplate] PRIMARY KEY CLUSTERED ([idTaskTemplate]);
GO

/**
 * @check chkTask_Priority Priority enumeration
 * @enum {0} Low priority
 * @enum {1} Medium priority
 * @enum {2} High priority
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_Status Status enumeration
 * @enum {0} Draft
 * @enum {1} Pending
 * @enum {2} In progress
 * @enum {3} Completed
 * @enum {4} Cancelled
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Status] CHECK ([status] BETWEEN 0 AND 4);
GO

/**
 * @check chkSubtask_Status Subtask status enumeration
 * @enum {0} Pending
 * @enum {1} Completed
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [chkSubtask_Status] CHECK ([status] BETWEEN 0 AND 1);
GO

/**
 * @index ixTask_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_User
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_User]
ON [functional].[task]([idAccount], [idUser])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Status
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Status]
ON [functional].[task]([idAccount], [status])
INCLUDE ([title], [dueDate], [priority])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_DueDate
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_DueDate]
ON [functional].[task]([idAccount], [dueDate])
INCLUDE ([title], [priority], [status])
WHERE [deleted] = 0 AND [dueDate] IS NOT NULL;
GO

/**
 * @index ixTask_Draft
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Draft]
ON [functional].[task]([idAccount], [isDraft])
INCLUDE ([title], [dateCreated])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskAttachment_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskAttachment_Task]
ON [functional].[taskAttachment]([idAccount], [idTask]);
GO

/**
 * @index ixSubtask_Task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSubtask_Task]
ON [functional].[subtask]([idAccount], [idTask])
WHERE [deleted] = 0;
GO

/**
 * @index ixSubtask_Order
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixSubtask_Order]
ON [functional].[subtask]([idAccount], [idTask], [orderIndex])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Account]
ON [functional].[taskTemplate]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_User
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_User]
ON [functional].[taskTemplate]([idAccount], [idUser])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_Shared
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Shared]
ON [functional].[taskTemplate]([idAccount], [isShared])
INCLUDE ([name], [description])
WHERE [deleted] = 0;
GO