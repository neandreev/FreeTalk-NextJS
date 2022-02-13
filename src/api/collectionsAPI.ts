import { AppDispatch } from "../store/store";

import { fetchCollections } from "./mock-collections";

import { setCollections, setIsShowErrorMessage } from "../features/collections/collectionsSlice";

export const getCollectionsAsync = () => (dispatch: AppDispatch) => {
  return fetchCollections()
    .then((res) => {
      dispatch(setCollections(res));
      return res;
    })
    .catch((e) => {
      dispatch(setIsShowErrorMessage(e));
    })
};
