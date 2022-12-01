import _find from 'lodash-es/find';
import { FC } from 'react';
import shallow from "zustand/shallow";

import { Card, Row } from 'antd';

import { WordStat } from '../../atoms/WordStat';

import { LearningWord } from '@prisma/client';
import { IQuestion } from '../../../interfaces/question';
import { useStore } from "@/store/store";

const getWordsStats = (questions: IQuestion[], trainingWords: LearningWord[]) =>
	questions
		.map((question) => ({
			word: _find(trainingWords, {
				id: question.correctAnswerId,
			}) as LearningWord,
			correct: question.wasAnsweredCorrectly,
		}))
		.map((stat) => (
			<WordStat key={stat.word.id} word={stat.word} correct={stat.correct!} />
		));

export const QuizStats: FC = () => {
	const [trainingWords, questions, correctAnswers, completedQuestions] =
		useStore((store) => ([
			store.trainingWords,
			store.questions,
			store.correctAnswers,
			store.completedQuestions
		]), shallow);

	const title = `Вы перевели ${correctAnswers} из ${completedQuestions} слов!`;

	const wordsStats = getWordsStats(questions, trainingWords);

	return (
		<Card className='quiz-stats' title={title}>
			<Row>{wordsStats}</Row>
		</Card>
	);
};
