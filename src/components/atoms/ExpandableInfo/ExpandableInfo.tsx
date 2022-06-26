import { FC } from 'react';
import cn from 'classnames';
import plural from 'plural-ru';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import { Checkbox, Col, Grid, Row, Space } from 'antd';

import { LearningWord } from '@prisma/client';
import { WordCategory } from '../WordCategory';

import style from './ExpandableInfo.module.css';

const { useBreakpoint } = Grid;

const getWordsRepeatsPlural = (count: number) =>
	plural(count, '%d раз', '%d раза', '%d раз');

interface IExpandableInfo {
	record: LearningWord;
	onUpdateCategory: (id: number, category: string) => void;
	onUpdateStatus: (id: number[], multiple?: boolean) => void;
}

const ExpandableInfo: FC<IExpandableInfo> = ({
	record,
	onUpdateCategory,
	onUpdateStatus,
}) => {
	const breakpoint = useBreakpoint();

	const timeToTrainFormat = dayjs(record.timeToTrain * 1000).format(
		'DD MMMM YYYY'
	);
	const isAvailableForTraining = record.timeToTrain * 1000 < Date.now();

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
							<WordCategory record={record} handleUpdateWord={onUpdateCategory} />
						</Space>
					)}
				</Col>
				<Col style={{ textAlign: 'start' }} span={12}>
					{!breakpoint.md && (
						<Space>
							<span>Изучено:</span>
							<Checkbox
								checked={record.learned}
								onClick={() => onUpdateStatus([record.id])}
							/>
						</Space>
					)}
				</Col>
			</Row>
			{record.learned ? null : (
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
