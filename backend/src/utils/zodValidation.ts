import { z } from 'zod';

/**
 * @summary
 * Reusable Zod validation schemas for common data types
 *
 * @module utils/zodValidation
 */

/**
 * String validation with maximum length
 */
export const zString = (maxLength?: number) => {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema;
};

/**
 * Nullable string with maximum length
 */
export const zNullableString = (maxLength?: number) => {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema.nullable();
};

/**
 * Name field validation (1-200 characters)
 */
export const zName = z.string().min(1).max(200);

/**
 * Description field validation (max 500 characters, nullable)
 */
export const zNullableDescription = z.string().max(500).nullable();

/**
 * Foreign key validation (positive integer, nullable)
 */
export const zNullableFK = z.number().int().positive().nullable();

/**
 * Foreign key validation (positive integer, required)
 */
export const zFK = z.number().int().positive();

/**
 * Bit/Boolean validation
 */
export const zBit = z.boolean();

/**
 * Date string validation (ISO format)
 */
export const zDateString = z.string().datetime();

/**
 * Nullable date string validation
 */
export const zNullableDateString = z.string().datetime().nullable();
