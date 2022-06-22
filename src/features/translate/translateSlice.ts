import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store/store';
import { IWord } from '@/interfaces/word';

type TWordWithoutID = Omit<IWord, 'id'>;
type TranslateStatus = 'idle' | 'loading' | 'error' | 'success';

interface ITranslateSlice {
	translateStatus: TranslateStatus;
	isStarted: boolean;

	translateResponse: TWordWithoutID | null;
	isLoading: boolean;
	isError: boolean;

	additionalWords: (TWordWithoutID | null)[];
	isAdditionalWordsError: boolean;
	isAdditionalWordsLoading: boolean;

	isFormDisabled: boolean,
}

const initialState: ITranslateSlice = {
	translateStatus: 'idle',
	isStarted: false,

	translateResponse: null,
	isLoading: false,
	isError: false,

	additionalWords: [],
	isAdditionalWordsError: false,
	isAdditionalWordsLoading: false,

	isFormDisabled: false,
};

export const translateSlice = createSlice({
	name: 'words',
	initialState,
	reducers: {
		startTranslate: (state) => {
			state.translateStatus = 'loading',
			state.isStarted = true;
			state.isError = false;
			state.isLoading = true;
			state.translateResponse = null;
			state.additionalWords = [];
			state.isAdditionalWordsError = false;
			state.isAdditionalWordsLoading = true;
		},
		errorInTranslate: (state) => {
			state.translateStatus = 'error';
			state.isError = true;
		},
		errorInAdditionalWords: (state) => {
			state.translateStatus = 'error';
			state.isAdditionalWordsError = true;
		},
		completeTranslate: (state) => {
			state.translateStatus = 'success',
			state.isLoading = false;
			state.isAdditionalWordsError = false;
			state.isAdditionalWordsLoading = false;
			state.isFormDisabled = false;
		},
	},
});

export const {
	startTranslate,
	errorInTranslate,
	errorInAdditionalWords,
	completeTranslate,
} = translateSlice.actions;

export const selectTranslate = (state: RootState) => state;

export const translateReducer = translateSlice.reducer;
