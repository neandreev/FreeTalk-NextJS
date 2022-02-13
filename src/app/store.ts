import { configureStore } from '@reduxjs/toolkit';

import { collectionReducer } from './features/collections/collectionsSlice';

export const store = configureStore({
  reducer: {
    collections: collectionReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
