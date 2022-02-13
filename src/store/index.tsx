import { configureStore } from '@reduxjs/toolkit';
import trainingReducer from '../features/training/trainingSlice';
import { usersApi } from '../services/users';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    training: trainingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
