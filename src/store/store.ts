import { configureStore } from '@reduxjs/toolkit';

import { collectionReducer } from '../features/collections/collectionsSlice';
import {trainingReducer} from "../features/training/trainingSlice";
import {usersApi} from "../features/database/users";

export const store = configureStore({
  reducer: {
    collections: collectionReducer,
    training: trainingReducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(usersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
