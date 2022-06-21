import { FC } from 'react';
import cn from 'classnames';

import { Col } from 'antd';

import { IWord } from '../../../interfaces/word';

import style from './WordStat.module.css';
import { LearningWord } from '@prisma/client';

interface IWordStat {
	word: LearningWord;
	correct: boolean;
}

export const WordStat: FC<IWordStat> = (props) => {
	const { correct } = props;
	const wordStyle = cn( [style.wordStat], {
		[style.wordStat_correct]: correct,
		[style.wordStat_wrong]: !correct,
	});

	return (
		<Col className={wordStyle} span={12}>
			<span>{props.word.en}</span>
		</Col>
	);
};
