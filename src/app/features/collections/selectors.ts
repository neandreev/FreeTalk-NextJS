import { RootState } from "../../store";

export const selectCollections = (state: RootState) => state.collections.collections;
export const selectIsShowErrorMessage = (state: RootState) => state.collections.isShowErrorMessageAuth;
