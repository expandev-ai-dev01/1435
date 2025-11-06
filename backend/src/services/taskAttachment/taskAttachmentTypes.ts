/**
 * @interface TaskAttachmentEntity
 * @description Represents a task attachment entity in the system
 *
 * @property {number} idTaskAttachment - Unique attachment identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idTask - Associated task identifier
 * @property {string} fileName - File name
 * @property {number} fileSize - File size in bytes
 * @property {string} fileType - File type
 * @property {string} storageUrl - Storage URL
 * @property {Date} dateCreated - Creation timestamp
 */
export interface TaskAttachmentEntity {
  idTaskAttachment: number;
  idAccount: number;
  idTask: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  storageUrl: string;
  dateCreated: Date;
}

/**
 * @interface TaskAttachmentCreateRequest
 * @description Request parameters for creating a task attachment
 */
export interface TaskAttachmentCreateRequest {
  idAccount: number;
  idTask: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileContent: string;
}

/**
 * @type FileType
 * @description Valid file types for attachments
 */
export type FileType = 'pdf' | 'doc' | 'docx' | 'jpg' | 'png';
