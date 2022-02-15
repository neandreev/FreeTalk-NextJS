import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ITrainingWord } from '../../interfaces/trainingWord';

import _ from 'lodash';

interface IUpdateUserWords {
	userId: string;
	wordId: string;
	word: Partial<ITrainingWord>;
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
		addUserWord: builder.mutation<void, Partial<IUpdateUserWords>>({
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
			invalidatesTags: ['Words'],
		}),
		deleteUserWord: builder.mutation<void, Partial<IUpdateUserWords>>({
			query: ({ userId, wordId }) => ({
				url: `${userId}/words/${wordId}.json`,
				method: 'DELETE',
			}),
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
