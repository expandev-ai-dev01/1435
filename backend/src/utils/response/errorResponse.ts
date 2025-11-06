/**
 * @summary
 * Creates a standardized error response object
 *
 * @function errorResponse
 * @module utils/response
 *
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 * @param {any} [details] - Additional error details
 *
 * @returns {object} Standardized error response
 *
 * @example
 * const response = errorResponse('Validation failed', 'VALIDATION_ERROR');
 */
export function errorResponse(message: string, code?: string, details?: any): object {
  return {
    success: false,
    error: {
      code: code || 'ERROR',
      message,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
  };
}
