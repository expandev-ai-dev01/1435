import { getErrorMessageClassName } from './variants';
import type { ErrorMessageProps } from './types';

/**
 * @component ErrorMessage
 * @summary Error message display component
 * @domain core
 * @type ui-component
 * @category feedback
 */
export const ErrorMessage = ({
  title,
  message,
  onRetry,
  onBack,
  variant = 'error',
}: ErrorMessageProps) => {
  return (
    <div className={getErrorMessageClassName({ variant })}>
      <div className="text-center">
        {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
        {message && <p className="text-gray-600 mb-4">{message}</p>}
        <div className="flex gap-2 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
            >
              Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
