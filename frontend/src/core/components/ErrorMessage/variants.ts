import { clsx } from 'clsx';

export interface ErrorMessageVariantProps {
  variant?: 'error' | 'warning' | 'info';
}

export function getErrorMessageClassName(props: ErrorMessageVariantProps): string {
  const { variant = 'error' } = props;

  return clsx('p-6 rounded-lg border-2', {
    'bg-red-50 border-red-200': variant === 'error',
    'bg-yellow-50 border-yellow-200': variant === 'warning',
    'bg-blue-50 border-blue-200': variant === 'info',
  });
}
