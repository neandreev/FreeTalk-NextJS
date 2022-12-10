import { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Collection, CollectionWord } from '@prisma/client';

import { Row, Col, Pagination, Button } from 'antd';

import trpc from '../../../utils/trpc';

import DetailCollectionWordCard from '../../molecules/DetailCollectionWordCard';

import { IPagination } from '../../../interfaces/pagination';

import styles from './DetailCollection.module.css';

const DetailCollection: FC<{ data: Collection[]; pid: number }> = ({
  data,
  pid,
}) => {
  const router = useRouter();
  const collectionWordsQuery = trpc.collectionWords.useQuery(pid);
  const collectionWords = useMemo(
    () => collectionWordsQuery.data || [],
    [collectionWordsQuery]
  );

  const [collections, setCollections] = useState<Array<Collection>>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection>();
  const [words, setWords] = useState<Array<CollectionWord>>();
  const [pagination, setPagination] = useState<IPagination>({
    limit: 6,
    index: 1,
    total: 0,
  });

  useEffect(() => {
    if (data) {
      setCollections(data as Array<Collection>);
      setSelectedCollection(
        collections.find((item) => item.id === pid) as Collection
      );
      setPagination((pagination) => ({
        ...pagination,
        total: collectionWords.length,
      }));
      const newWords = collectionWords
        .slice(
          (pagination.index - 1) * pagination.limit,
          (pagination.index - 1) * pagination.limit + pagination.limit
        )
        .map((item) => ({ ...item }));
      setWords(newWords);
    }
  }, [
    collections,
    collectionWords,
    pid,
    selectedCollection,
    data,
    pagination.index,
    pagination.limit,
  ]);

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
          <h1 className={`page-title ${styles.title}`}>
            {selectedCollection?.title}
          </h1>
          <hr />
        </Col>
      </Row>
      <Row className={styles.cards} gutter={[8, 8]}>
        {words?.map((item) => (
          <Col key={item.en} xs={24} sm={12} lg={8}>
            <DetailCollectionWordCard word={item} />
          </Col>
        ))}
      </Row>
      <Row className={styles.pagination} justify="space-between">
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
            className={`app-btn ${styles['btn-collections']}`}
            onClick={handleBack}
          >
            Вернуться к коллекциям
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default DetailCollection;
