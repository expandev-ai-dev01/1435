import { QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './router';
import { queryClient } from '@/core/lib/queryClient';

/**
 * @component App
 * @summary Root application component that provides global context and routing
 * @domain core
 * @type root-component
 * @category application
 */
export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
};
