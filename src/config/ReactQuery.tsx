import { STALE } from '@/common/QueryStaleTime';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';
import {
  PersistQueryClientProvider,
  removeOldestQuery,
} from '@tanstack/react-query-persist-client';

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  retry: removeOldestQuery,
});

const persistOptions = {
  persister,
  gcTime: STALE.HOURS.TWELVE,
  dehydrateOptions: {
    shouldDehydrateQuery: query => {
      return defaultShouldDehydrateQuery(query) && query?.meta?.persist === true;
    },
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0, // Data is immediately considered stale (default behavior)
      refetchOnWindowFocus: true, // Refetch when window gains focus (if stale)
    },
  },
});

export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      {children}
    </PersistQueryClientProvider>
  );
};

export default ReactQueryProvider;
