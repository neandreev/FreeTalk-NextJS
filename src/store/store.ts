import { configureStore } from '@reduxjs/toolkit';

import { collectionReducer } from '@/features/collections/collectionsSlice';
import { dictionaryReducer } from '@/features/dictionary/dictionarySlice';
import { translateReducer } from '@/features/translate/translateSlice';
import { trainingReducer } from '@/features/training/trainingSlice';

export const store = configureStore({
	reducer: {
		translate: translateReducer,
		collections: collectionReducer,
		dictionary: dictionaryReducer,
		training: trainingReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
