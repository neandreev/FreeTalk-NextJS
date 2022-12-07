import { z } from 'zod';

import { publicProcedure, router } from '@/server/trpc';
import prisma from '@/server/db';

export const appRouter = router({
  words: publicProcedure
    .input(z.string().nullable())
    .query(async ({ input }) => {
      if (input === null) return [];

      const userWords = await prisma.learningWord.findMany({
        where: {
          userEmail: input,
        },
      });

      return userWords;
    }),
  collections: publicProcedure.query(async () => {
    const collections = await prisma.collection.findMany();
    return collections;
  }),
  collectionWords: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const collectionWords = await prisma.collectionWord.findMany({
        where: {
          collectionId: input,
        },
      });
      return collectionWords;
    }),
  addWord: publicProcedure
    .input(
      z.object({
        word: z.object({
          en: z.string(),
          ru: z.string(),
          image: z.string().url(),
          timeToTrain: z.number(),
          category: z.string().optional(),
        }),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
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
    }),
  updateWordTrainingdata: publicProcedure
    .input(
      z.object({
        id: z.number(),
        completedTrains: z.number(),
        timeToTrain: z.number(),
      })
    )
    .mutation(async ({ input }) => {
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
    }),
  updateWordCategory: publicProcedure
    .input(
      z.object({
        id: z.number(),
        category: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const dbWord = await prisma.learningWord.update({
        where: {
          id: input.id,
        },
        data: {
          category: input.category,
        },
      });
      return { success: true, word: dbWord };
    }),
  updateWordsStatus: publicProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
        learned: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
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
    }),
  deleteWords: publicProcedure
    .input(z.array(z.number()))
    .mutation(async ({ input }) => {
      const wordsDeletionResults = await prisma.learningWord.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });
      return { success: true, count: wordsDeletionResults };
    }),
});

export type AppRouter = typeof appRouter;
