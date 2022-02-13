import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

import { ICollection } from '../../interfaces/collection';

interface CollectionsState {
  collections: Array<ICollection>,
  isShowErrorMessageAuth: boolean
};

const initialState: CollectionsState = {
  collections: [],
  isShowErrorMessageAuth: false
};

export const collectionSlice = createSlice({
  name: 'collectionsSlice',
  initialState,
  reducers: {
    setCollections: (state, action: PayloadAction<Array<ICollection>>) => {
      state.collections = action.payload;
    },
    setIsShowErrorMessage: (state, action: PayloadAction<boolean>) => {
      state.isShowErrorMessageAuth = action.payload;
    }
  }
});

export const { setCollections, setIsShowErrorMessage } = collectionSlice.actions;

export const collectionReducer = collectionSlice.reducer;
