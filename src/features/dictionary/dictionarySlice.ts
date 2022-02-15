import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'react';

import type { RootState } from "../../store/store";

interface IDictionarySlice {
	selectedRows: Key[];
};

const initialState: IDictionarySlice = {
	selectedRows: [],
};

export const trainingSlice = createSlice({
  name: 'dictionary',
  initialState,
  reducers: {
    setSelectedRows: (state, action: PayloadAction<Key[]>) => {
      state.selectedRows = action.payload;
    },
	},
});

export const { setSelectedRows } = trainingSlice.actions;

export const selectSelectedRows = (state: RootState) => state.dictionary.selectedRows;

export const dictionaryReducer = trainingSlice.reducer;
