import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { prisma } from '../../../src/server/db';
import superjson from 'superjson';
import { LearningWordModel } from '../../../prisma/zod/learningword';

export const appRouter = trpc
	.router()
	.transformer(superjson)
	.query('hello', {
		input: z
			.object({
				text: z.string().nullable(),
			})
			.nullish(),
		resolve({ input }) {
			return {
				greeting: `hello ${input?.text ?? 'world'}`,
			};
		},
	})
	.query('words', {
		input: z.string().nullable(),
		async resolve({ input }) {
			if (input === null) return [];

			const userWords = prisma.learningWord.findMany({
				where: {
					userEmail: input,
				},
			});

			// return {
			// 	words: userWords,
			// };
			return userWords;
		},
	})
	.query('collections', {
		async resolve() {
			const collections = prisma.collection.findMany();
			return collections;
		},
	})
	.query('collection-words', {
		input: z.number(),
		async resolve({ input }) {
			const collectionWords = prisma.collectionWord.findMany({
				where: {
					collectionId: input,
				},
			});
			return collectionWords;
		},
	})
	.mutation('add-word', {
		input: z.object({
			word: z.object({
				en: z.string(),
				ru: z.string(),
				image: z.string().url(),
				timeToTrain: z.number(),
				category: z.string().optional(),
			}),
			email: z.string().email(),
		}),
		async resolve({ input }) {
			const wordInDb = await prisma.learningWord.create({
				data: {
					userEmail: input.email,
					en: input.word.en,
					ru: input.word.ru,
					image: input.word.image,
					timeToTrain: input.word.timeToTrain,
					category: input.word.category,
				},
			});
			return { success: true, word: wordInDb };
		},
	})
	.mutation('update-word-trainingdata', {
		input: z.object({
			id: z.number(),
			completedTrains: z.number(),
			timeToTrain: z.number(),
		}),
		async resolve({ input }) {
			const wordInDb = await prisma.learningWord.update({
				where: {
					id: input.id,
				},
				data: {
					completedTrains: input.completedTrains,
					timeToTrain: input.timeToTrain,
				},
			});
			return { success: true, word: wordInDb };
		},
	})
	.mutation('update-word-category', {
		input: z.object({
			id: z.number(),
			category: z.string(),
		}),
		async resolve({ input }) {
			const dbWord = await prisma.learningWord.update({
				where: {
					id: input.id,
				},
				data: {
					category: input.category,
				},
			});
			return { success: true, word: dbWord };
		},
	})
	.mutation('update-words-status', {
		input: z.object({
			ids: z.array(z.number()),
			learned: z.boolean(),
		}),
		async resolve({ input }) {
			const dbWords = await prisma.learningWord.updateMany({
				where: {
					id: {
						in: input.ids,
					},
				},
				data: {
					learned: input.learned,
				},
			});
			return { success: true, count: dbWords };
		},
	})
	.mutation('delete-words', {
		input: z.array(z.number()),
		async resolve({ input }) {
			const wordsDeletionResults = await prisma.learningWord.deleteMany({
				where: {
					id: {
						in: input,
					},
				},
			});
			return { success: true, count: wordsDeletionResults };
		},
	});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
	batching: {
		enabled: true,
	},
	onError({ error }) {
		console.error('Something went wrong', error);
	},
	router: appRouter,
	createContext: () => null,
});
