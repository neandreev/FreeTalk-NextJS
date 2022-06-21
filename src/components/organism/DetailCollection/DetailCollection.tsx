import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { DetailCollectionWordCard } from '../../molecules/DetailCollectionWordCard';
import { IPagination } from '../../../interfaces/pagination';
import { IWord } from '../../../interfaces/word';

import { Row, Col, Pagination, Button } from 'antd';

import styles from './DetailCollection.module.css';
import { Collection, CollectionWord } from '@prisma/client';
import { trpc } from '../../../utils/trpc';
export const DetailCollection: FC<{ data: Collection[]; pid: number }> = ({
	data,
	pid,
}) => {
	const router = useRouter();
	const collectionWordsQuery = trpc.useQuery(['collection-words', pid]);
	const collectionWords = collectionWordsQuery.data || [];
	const [collections, setCollections] = useState<Array<Collection>>([]);
	const [selectedCollection, setSelectedCollection] = useState<Collection>();
	const [words, setWords] = useState<Array<CollectionWord>>();
	const [pagination, setPagination] = useState<IPagination>({
		limit: 6,
		index: 1,
		total: 0,
	});

	console.log('COLLECTION WORDS', collectionWords);
	console.log('WORDS', words);

	useEffect(() => {
		console.log('GOT INTO EFFECT');

		if (data) {
			console.log('GOT INFO EFFECT WITH DATA');
			setCollections(data as Array<Collection>);
			setSelectedCollection(
				collections.find((item) => item.id === pid) as Collection
			);
			setPagination({
				...pagination,
				total: collectionWords.length,
			});
			const newWords = collectionWords
				.slice(
					(pagination.index - 1) * pagination.limit,
					(pagination.index - 1) * pagination.limit + pagination.limit
				)
				.map((item) => {
					return { ...item };
				});
			console.log("NEW WORDS", newWords);
			setWords(newWords);
		}
	}, [collections, collectionWords, pid, selectedCollection, data, pagination.index]);

	const handleChangePagination = (page: number, pageSize: number) => {
		setPagination({
			...pagination,
			index: page,
			limit: pageSize,
		});
	};

	const handleBack = () => {
		router.push('/collections');
	};

	return (
		<>
			<Row>
				<Col span={24}>
					<h1 className={`page__title ${styles.title}`}>
						{selectedCollection?.title}
					</h1>
					<hr />
				</Col>
			</Row>
			<Row className={styles.cards} gutter={[8, 8]}>
				{words?.map((item) => (
					<Col key={item.en} xs={24} sm={12} lg={8}>
						<DetailCollectionWordCard
							word={item}
							// id={item.id}
							// en={item.en}
							// ru={item.ru}
							// image={item.image}
							// category={item.category}
							// completedTrains={item.completedTrains}
							// isLearned={item.isLearned}
							// timeToTrain={item.timeToTrain}
						/>
					</Col>
				))}
			</Row>
			<Row className={styles.pagination} justify='space-between'>
				<Col style={{ marginTop: '10px' }}>
					<Pagination
						total={pagination.total}
						pageSize={pagination.limit}
						current={pagination.index}
						onChange={handleChangePagination}
						hideOnSinglePage={false}
					/>
				</Col>
				<Col style={{ marginTop: '10px' }}>
					<Button
						className={`app-btn ${styles.btnCollections}`}
						onClick={handleBack}
					>
						Вернуться к коллекциям
					</Button>
				</Col>
			</Row>
		</>
	);
};
