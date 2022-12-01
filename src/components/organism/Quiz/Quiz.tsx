import { FC } from 'react';

import { QuizStats } from '../../molecules/QuizStats';
import { QuizQuestions } from '../../molecules/QuizQuestions';

import { useStore } from "@/store/store";

export const Quiz: FC = () => {
	const isCompleted = useStore(({ isCompleted }) => isCompleted);

	return (
		<div className='quiz'>{!isCompleted ? <QuizQuestions /> : <QuizStats />}</div>
	);
};
