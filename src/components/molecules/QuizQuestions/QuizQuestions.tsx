import _find from 'lodash-es/find';
import _shuffle from 'lodash-es/shuffle';
import { FC, useMemo } from 'react';
import shallow from "zustand/shallow";

import { Card, Space } from 'antd';

import { QuizList } from '../QuizList';
import { QuizResponse } from '../../atoms/QuizResponse';

import { selectCurrentQuestion, useStore } from "@/store/store";

import { ITrainingAnswer } from '../../../interfaces/training';
import { LearningWord } from '@prisma/client';

export const QuizQuestions: FC = () => {
	const { wasAnswered, correctAnswerId, wrongAnswersIds } = useStore(selectCurrentQuestion);
	const [currentQuestionId, trainingWords] = useStore((store) => (
		[store.currentQuestionId, store.trainingWords]), shallow
	);

	const nextQuestion = useStore(({ nextQuestion }) => nextQuestion);

	const correctWord = _find(trainingWords, {
		id: correctAnswerId,
	}) as LearningWord;
	const [wrongAnswer1, wrongAnswer2, wrongAnswer3] = wrongAnswersIds;

	const handleNextQuestionLink: React.MouseEventHandler = (e) => {
		e.preventDefault();
		nextQuestion();
	};

	const variants: ITrainingAnswer[] = [
		{ wordId: correctAnswerId, isCorrect: true },
		{ wordId: wrongAnswer1, isCorrect: false },
		{ wordId: wrongAnswer2, isCorrect: false },
		{ wordId: wrongAnswer3, isCorrect: false },
	];

	const shuffledVariants = useMemo(
		() => _shuffle(variants),
		[currentQuestionId]
	);

	const QuestionTitle = (
		<Space wrap>
			<span>Выберите перевод слова:</span>
			<span style={{ fontWeight: 'bold' }}>{correctWord.en}</span>
		</Space>
	);

	return (
		<Card title={QuestionTitle}>
			<QuizList variants={shuffledVariants} />
			<QuizResponse
				wasAnswered={wasAnswered}
				handleNextQuestion={handleNextQuestionLink}
			/>
		</Card>
	);
};
