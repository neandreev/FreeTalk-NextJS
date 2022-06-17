import { FC } from 'react';
import firebase from 'firebase';
import cn from 'classnames';
import plural from 'plural-ru';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import { Checkbox, Col, Grid, Row, Space } from 'antd';

import { WordCategory } from '../WordCategory';

import { useUpdateUserWordMutation } from '../../../features/database/users';
import { useAuth } from '../../../hooks';

import { IWord } from '../../../interfaces/word';

import style from './ExpandableInfo.module.css';

const { useBreakpoint } = Grid;

const getWordsRepeatsPlural = (count: number) =>
	plural(count, '%d раз', '%d раза', '%d раз');

interface IExpandableInfo {
	record: IWord;
}

const ExpandableInfo: FC<IExpandableInfo> = ({ record }) => {
	const user = useAuth()!.user as firebase.User;

	const breakpoint = useBreakpoint();
	const [updateWord] = useUpdateUserWordMutation();

	const timeToTrainFormat = dayjs(record.timeToTrain).format('DD MMMM YYYY');
	const isAvailableForTraining = record.timeToTrain < Date.now();

	const handleUpdateWord = (wordKey: string, wordData: Partial<IWord>) => {
		const wordsUpdate = { wordId: wordKey, userId: user.uid, word: wordData };
		updateWord(wordsUpdate);
	};

	const handleLearnWord = (wordKey: string, fixLearn?: boolean) => {
		const wordsUpdate = {
			wordId: wordKey,
			userId: user.uid,
			word: { isLearned: fixLearn || !record.isLearned },
		};
		updateWord(wordsUpdate);
	};

	const dayToTrainStyles = cn({
		[style.green]: isAvailableForTraining,
	});

	return (
		<>
			<Row justify='space-between' gutter={[8, 8]} align='middle' wrap={false}>
				<Col style={{ textAlign: 'start' }} span={12}>
					{!breakpoint.md && (
						<Space>
							<span>Категория:</span>
							<WordCategory record={record} handleUpdateWord={handleUpdateWord} />
						</Space>
					)}
				</Col>
				<Col style={{ textAlign: 'start' }} span={12}>
					{!breakpoint.md && (
						<Space>
							<span>Изучено:</span>
							<Checkbox
								checked={record.isLearned}
								onClick={() => handleLearnWord(record.id)}
							/>
						</Space>
					)}
				</Col>
			</Row>
			{record.isLearned ? null : (
				<Row justify='space-between' gutter={[8, 8]} align='middle' wrap={false}>
					<Col span={12}>
						<span>
							Кол-во повторений: {getWordsRepeatsPlural(record.completedTrains)}
						</span>
					</Col>
					<Col span={12}>
						<span>
							<span>Доступно в тренировке с: </span>
							<span className={dayToTrainStyles}>{timeToTrainFormat}</span>
						</span>
					</Col>
				</Row>
			)}
		</>
	);
};

export { ExpandableInfo };
