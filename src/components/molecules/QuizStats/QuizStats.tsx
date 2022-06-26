import _find from 'lodash-es/find';
import { FC } from 'react';

import { Card, Row } from 'antd';

import { WordStat } from '../../atoms/WordStat';

import { useAppSelector } from '../../../hooks';
import { selectTraining } from '../../../features/training/trainingSlice';

import { LearningWord } from '@prisma/client';
import { IQuestion } from '../../../interfaces/question';

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
	const { trainingWords, questions, correctAnswers, completedQuestions } =
		useAppSelector(selectTraining);

	const title = `Вы перевели ${correctAnswers} из ${completedQuestions} слов!`;

	const wordsStats = getWordsStats(questions, trainingWords);

	return (
		<Card className='quiz-stats' title={title}>
			<Row>{wordsStats}</Row>
		</Card>
	);
};
