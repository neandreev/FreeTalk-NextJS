import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import _ from 'lodash';
import { ITrainingWord } from '../../interfaces/trainingWord';

interface IAddUserWords {
	userId: string;
	word: Omit<ITrainingWord, 'id'>;
}

interface IUpdateUserWords {
	userId: string;
	wordId: string;
	word: Partial<ITrainingWord>;
}

interface IDeleteUserWords {
	userId: string;
	wordId: string;
}

interface IWordsObj {
	[id: string]: Partial<ITrainingWord>;
}

export const usersApi = createApi({
	reducerPath: 'usersApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://freetalk2022-default-rtdb.firebaseio.com/users/',
	}),
	tagTypes: ['Words'],
	endpoints: (builder) => ({
		getUserWordsByUid: builder.query<ITrainingWord[], string | undefined>({
			query: (userId) => `${userId}/words.json`,
			transformResponse: (response: IWordsObj) => {
				if (_.isNull(response)) {
					return [];
				} else {
					const wordsEntries = Object.entries(response);
					const wordsArray: ITrainingWord[] = wordsEntries.map(
						([id, word]) => ({ ...word, id } as ITrainingWord)
					);
					return wordsArray;
				}
			},
			providesTags: ['Words'],
		}),
		addUserWord: builder.mutation<void, IAddUserWords>({
			query: ({ word, userId }) => ({
				url: `${userId}/words.json`,
				method: 'POST',
				body: word,
			}),
			invalidatesTags: ['Words'],
		}),
		updateUserWord: builder.mutation<void, IUpdateUserWords>({
			query: ({ word, wordId, userId }) => ({
				url: `${userId}/words/${wordId}.json`,
				method: 'PATCH',
				body: word,
			}),
			async onQueryStarted({ word, wordId, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUserWordsByUid', userId, (draft) => {
						const updateWord = _.find(draft, { id: wordId });
            Object.assign(updateWord, word)
          })
        );
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
				}
			},
			invalidatesTags: ['Words'],
		}),
		deleteUserWord: builder.mutation<void, IDeleteUserWords>({
			query: ({ userId, wordId }) => ({
				url: `${userId}/words/${wordId}.json`,
				method: 'DELETE',
			}),
			async onQueryStarted({ userId, wordId }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					usersApi.util.updateQueryData('getUserWordsByUid', userId, (draft) => {
						const updatedWords = draft.filter((word) => word.id !== wordId );
						return updatedWords;
					})
				);
				try {
					await queryFulfilled
				} catch {
					patchResult.undo()
				}
			},
			invalidatesTags: ['Words'],
		}),
	}),
});

export const {
	useGetUserWordsByUidQuery,
	useUpdateUserWordMutation,
	useAddUserWordMutation,
	useDeleteUserWordMutation,
} = usersApi;
