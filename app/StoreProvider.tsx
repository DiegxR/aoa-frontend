// providers/ReduxProvider.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';
import { useEffect } from 'react';
import { hydrateFromStorage } from '@/lib/features/authSlice';
import { hydrateUsersFromStorage } from '@/lib/features/usersSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateFromStorage());
    store.dispatch(hydrateUsersFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}