import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {ITrainingWord} from "../../interfaces/trainingWord";

interface IUpdateUserWords {
  userId: string;
  wordId: string;
  word: Partial<ITrainingWord>;
}

interface IWordsObj {
  [id: string]: Partial<ITrainingWord>
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://freetalk2022-default-rtdb.firebaseio.com/users/',
  }),
  endpoints: (builder) => ({
    getUserWordsByUid: builder.query<ITrainingWord[], string>({
      query: (uid) => `${uid}/words.json`,
      transformResponse: (response: IWordsObj) => {
        const wordsEntries = Object.entries(response);
        const wordsArray: ITrainingWord[] = wordsEntries.map(([id, word]) => ({ ...word, id } as ITrainingWord));

        return wordsArray;
      },
    }),
    addUserWord: builder.mutation<void, Partial<IUpdateUserWords>>({
      query: ({ word, userId }) => ({
        url: `${userId}/words.json`,
        method: 'POST',
        body: word,
      }),
    }),
    updateUserWord: builder.mutation<void, IUpdateUserWords>({
      query: ({ word, wordId, userId }) => ({
        url: `${userId}/words/${wordId}.json`,
        method: 'PATCH',
        body: word,
      }),
    }),
    deleteUserWord: builder.mutation<void, Partial<IUpdateUserWords>>({
      query: ({ userId, wordId }) => ({
        url: `${userId}/words/${wordId}.json`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetUserWordsByUidQuery,
  useUpdateUserWordMutation,
  useAddUserWordMutation,
  useDeleteUserWordMutation,
} = usersApi;
