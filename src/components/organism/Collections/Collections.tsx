import { FC, useEffect, useState } from 'react';

import { Pagination, Row, Col } from 'antd';

import { Collection } from '@prisma/client';
import CollectionCard from '../../molecules/CollectionCard';

import { IPagination } from '../../../interfaces/pagination';

import styles from './Collections.module.css';

const Collections: FC<{ data: Collection[] }> = ({ data }) => {
  const [collections, setCollections] = useState<Array<Collection>>([]);
  const [pagination, setPagination] = useState<IPagination>({
    limit: 3,
    index: 1,
    total: 0,
  });

  useEffect(() => {
    if (data) {
      setPagination((pagination) => ({
        ...pagination,
        total: data.length,
      }));

      setCollections(
        data
          .slice(
            (pagination.index - 1) * pagination.limit,
            (pagination.index - 1) * pagination.limit + pagination.limit
          )
          .map((item) => ({ ...item }))
      );
    }
  }, [data, pagination.index, pagination.limit]);

  const handleChangePagination = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      index: page,
      limit: pageSize,
    });
  };

  return (
    <>
      <Row className={styles.cards} gutter={[16, 16]}>
        {collections.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <CollectionCard
              id={item.id}
              title={item.title}
              cover={item.cover}
            />
          </Col>
        ))}
      </Row>
      <Row className={styles.pagination}>
        <Col span={24}>
          <Pagination
            total={pagination.total}
            pageSize={pagination.limit}
            current={pagination.index}
            onChange={handleChangePagination}
            hideOnSinglePage={false}
          />
        </Col>
      </Row>
    </>
  );
};

export default Collections;
