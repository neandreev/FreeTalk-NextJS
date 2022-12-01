import create, { StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { IWord } from '@/interfaces/word';
import { IQuestion } from '../interfaces/question';
import { LearningWord } from '@prisma/client';

type TWordWithoutID = Omit<IWord, 'id'>;
type TranslateStatus = 'idle' | 'loading' | 'error' | 'success';

interface DictionaryState {
	selectedRows: number[];

	setSelectedRows: (rows: number[]) => void;
}

interface TrainingState {
	questions: IQuestion[];
	trainingWords: LearningWord[];
	currentQuestionId: number;
	isCompleted: boolean;
	correctAnswers: number;
	completedQuestions: number;

	setQuestions: (questions: IQuestion[]) => void;
	setTrainingWords: (words: LearningWord[]) => void;
	answerQuestion: (answer: {
		answerId: number;
		isAnsweredCorrectly: boolean;
	}) => void;
	nextQuestion: () => void;
	resetTraining: () => void;
}

const createDictionarySlice: StateCreator<
	DictionaryState & TrainingState,
	[['zustand/devtools', never], ['zustand/immer', never]],
	[],
	DictionaryState
> = (set) => ({
	selectedRows: [],

	setSelectedRows: (rows: number[]) =>
		set((state) => {
			state.selectedRows = rows;
		}),
});

const createTrainingSlice: StateCreator<
	DictionaryState & TrainingState,
	[['zustand/devtools', never], ['zustand/immer', never]],
	[],
	TrainingState
> = (set) => ({
	questions: [],
	trainingWords: [],
	currentQuestionId: 0,
	isCompleted: false,
	correctAnswers: 0,
	completedQuestions: 0,

	setQuestions: (questions: IQuestion[]) =>
		set((state) => {
			state.questions = questions;
		}),
	setTrainingWords: (words: LearningWord[]) =>
		set((state) => {
			state.trainingWords = words;
		}),
	answerQuestion: (answer: { answerId: number; isAnsweredCorrectly: boolean }) =>
		set((state) => {
			const question = state.questions[state.currentQuestionId];
			const { answerId, isAnsweredCorrectly } = answer;

			question.answerId = answerId;
			question.wasAnswered = true;
			if (isAnsweredCorrectly) {
				state.correctAnswers += 1;
			}
			question.wasAnsweredCorrectly = isAnsweredCorrectly;
		}),
	nextQuestion: () =>
		set((state) => {
			state.completedQuestions += 1;
			if (state.currentQuestionId + 1 === 10) {
				state.isCompleted = true;
			} else {
				state.currentQuestionId += 1;
			}
		}),
	resetTraining: () =>
		set((state) => {
			state.questions = [];
			state.trainingWords = [];
			state.currentQuestionId = 0;
			state.isCompleted = false;
			state.correctAnswers = 0;
			state.completedQuestions = 0;
		}),
});

export const useStore = create<TrainingState & DictionaryState>()(
	devtools(
		immer((...a) => ({
			...createDictionarySlice(...a),
			...createTrainingSlice(...a),
		}))
	)
);

export const selectCurrentQuestion = (state: TrainingState) =>
	state.questions[state.currentQuestionId];
