import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Word } from '../interfaces/word';

interface UpdateUserWords {
  userId: string;
  wordId: string;
  word: Partial<Word>;
};

interface WordsObj {
  [id: string]: Partial<Word>
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://freetalk2022-default-rtdb.firebaseio.com/users/',
  }),
  endpoints: (builder) => ({
    getUserWordsByUid: builder.query<Word[], string>({
      query: (uid) => `${uid}/words.json`,
      transformResponse: (response: WordsObj) => {
        const wordsEntries = Object.entries(response);
        const wordsArray: Word[] = wordsEntries.map(([id, word]) => ({ ...word, id } as Word));
        console.log(wordsArray);

        return wordsArray;
      },
    }),
    addUserWord: builder.mutation<void, Partial<UpdateUserWords>>({
      query: ({ word, userId }) => ({
        url: `${userId}/words.json`,
        method: 'POST',
        body: word,
      }),
    }),
    updateUserWord: builder.mutation<void, UpdateUserWords>({
      query: ({ word, wordId, userId }) => ({
        url: `${userId}/words/${wordId}.json`,
        method: 'PATCH',
        body: word,
      }),
    }),
    deleteUserWord: builder.mutation<void, Partial<UpdateUserWords>>({
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
