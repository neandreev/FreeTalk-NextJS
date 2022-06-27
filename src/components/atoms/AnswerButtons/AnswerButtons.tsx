import { FC, useEffect } from 'react';

import { Col, Row } from 'antd';

import { QuizButton } from '../QuizButton';

import { useAppSelector } from '../../../hooks';
import { selectTraining } from '../../../features/training/trainingSlice';

import { ITrainingAnswer } from '../../../interfaces/training';

interface IAnswerButtons {
	variants: ITrainingAnswer[];
}

export const AnswerButtons: FC<IAnswerButtons> = (props) => {
	const { currentQuestionId } = useAppSelector(selectTraining);

	return (
		<Row gutter={[16, 16]}>
			{props.variants.map((variant, i) => {
				const key = `w${variant.wordId}q${currentQuestionId}`;

				return (
					<Col span={12} key={key}>
						<QuizButton
							key={key}
							placement={i % 2 === 1 ? 'right' : 'left'}
							{...variant}
						/>
					</Col>
				);
			})}
		</Row>
	);
};
