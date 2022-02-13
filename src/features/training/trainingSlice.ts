import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { Question } from '../../interfaces/question';
import { Word } from '../../interfaces/word';

interface TrainingSliceType {
  questions: Question[];
  trainingWords: Word[],
  currentQuestionId: number;
  isCompleted: boolean;
  correctAnswers: number,
  completedQuestions: number,
};

const initialState: TrainingSliceType = {
  questions: [],
  trainingWords: [],
  currentQuestionId: 0,
  isCompleted: false,
  correctAnswers: 0,
  completedQuestions: 0,
};

export const trainingSlice = createSlice({
	name: 'words',
	initialState,
	reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setTrainingWords: (state, action: PayloadAction<Word[]>) => {
      state.trainingWords = action.payload;
    },
    answerQuestion: (state, action: PayloadAction<{ wordId: string, isAnsweredCorrectly: boolean }>) => {
      const question = state.questions[state.currentQuestionId];
      const { isAnsweredCorrectly } = action.payload;

      question.wasAnswered = true;
      if (isAnsweredCorrectly) {
        state.correctAnswers += 1;
      }
      question.wasAnsweredCorrectly = isAnsweredCorrectly;
    },
    nextQuestion: (state) => {
      state.completedQuestions += 1;
      if (state.currentQuestionId + 1 === 10) {
        state.isCompleted = true;
      } else {
        state.currentQuestionId += 1;
      }
    }
  },
});

export const { setTrainingWords ,setQuestions, answerQuestion, nextQuestion } = trainingSlice.actions;

export const selectTraining = (state: RootState) => state.training;

export const selectCurrentQuestion = (state: RootState) => (
  state.training.questions[state.training.currentQuestionId]
);

export default trainingSlice.reducer;
