/**
 * @summary
 * Creates a standardized success response object
 *
 * @function successResponse
 * @module utils/response
 *
 * @param {T} data - Response data
 * @param {object} [metadata] - Optional metadata
 *
 * @returns {object} Standardized success response
 *
 * @example
 * const response = successResponse({ id: 1, name: 'Task' });
 */
export function successResponse<T>(data: T, metadata?: any): object {
  return {
    success: true,
    data,
    ...(metadata && { metadata: { ...metadata, timestamp: new Date().toISOString() } }),
  };
}
