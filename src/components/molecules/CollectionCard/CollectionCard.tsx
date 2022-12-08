import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Card } from 'antd';

import { Collection } from '@prisma/client';

import styles from './CollectionCard.module.css';

const CollectionCard: FC<Collection> = ({ id, title, cover }) => (
  <Card
    cover={
      <div className={styles['card-cover']}>
        <Image alt={title} src={cover} fill className={styles['card-img']} />
      </div>
    }
  >
    <div className={styles.info}>
      <span>{title}</span>
      <Link href={`/collections/${id}`}>Изучить слова</Link>
    </div>
  </Card>
);

export default CollectionCard;
