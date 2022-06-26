import { FC } from 'react';
import cn from 'classnames';

import { Col } from 'antd';

import { LearningWord } from '@prisma/client';

import style from './WordStat.module.css';

interface IWordStat {
	word: LearningWord;
	correct: boolean;
}

export const WordStat: FC<IWordStat> = (props) => {
	const { correct } = props;
	const wordStyle = cn([style.wordStat], {
		[style.wordStat_correct]: correct,
		[style.wordStat_wrong]: !correct,
	});

	return (
		<Col className={wordStyle} span={12}>
			<span>{props.word.en}</span>
		</Col>
	);
};
