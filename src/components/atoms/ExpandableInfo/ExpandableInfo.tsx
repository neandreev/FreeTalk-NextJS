import { Checkbox, Col, Grid, Row, Space } from 'antd';
import cn from 'classnames';
import plural from 'plural-ru';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import _find from 'lodash/find';
import { FC, Key } from 'react';
import firebase from 'firebase';

import { IWord } from '../../../interfaces/word';
import { WordCategory } from '../WordCategory';

import style from './ExpandableInfo.module.css';
import {
	useGetUserWordsByUidQuery,
	useUpdateUserWordMutation,
} from '../../../features/database/users';
import { useAuth } from '../../../hooks';

const { useBreakpoint } = Grid;

const getWordsRepeatsPlural = (count: number) =>
	plural(count, '%d раз', '%d раза', '%d раз');

interface IExpandableInfo {
	record: IWord;
}

const ExpandableInfo: FC<IExpandableInfo> = ({ record }) => {
	const auth = useAuth();
	const user = auth!.user as firebase.User;

	const breakpoint = useBreakpoint();
	const { data: words } = useGetUserWordsByUidQuery(user.uid);
	const [updateWord] = useUpdateUserWordMutation();

	const timeToTrainFormat = dayjs(record.timeToTrain).format('DD MMMM YYYY');
	const isAvailableForTraining = record.timeToTrain < Date.now();

	const handleUpdateWord = (wordKey: Key, wordData: Partial<IWord>) => {
		const word = _find(words, { id: wordKey }) as IWord;
		const wordsUpdate = { wordId: word.id, userId: user.uid, word: wordData };
		updateWord(wordsUpdate);
	};

	const handleLearnWord = (wordKey: Key, fixLearn?: boolean) => {
		const word = _find(words, { id: wordKey }) as IWord;
		const wordsUpdate = {
			wordId: word.id,
			userId: user.uid,
			word: { isLearned: fixLearn || !word.isLearned },
		};
		updateWord(wordsUpdate);
	};

	const dayToTrainStyles = cn({
		[style.green]: isAvailableForTraining,
	});
	const dayToTrain = (
		<span className={dayToTrainStyles}>{timeToTrainFormat}</span>
	);

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
						<span>Доступно в тренировке с: {dayToTrain}</span>
					</Col>
				</Row>
			)}
		</>
	);
};

export { ExpandableInfo };
