import { FC } from 'react';
import Link from 'next/link';

import { Card } from 'antd';

import { Collection } from '@prisma/client';

import styles from './CollectionCard.module.css';

export const CollectionCard: FC<Collection> = ({ id, title, cover }) => {
	return (
		<Card cover={<img alt={title} src={cover} className={styles.cardImg} />}>
			<div className={styles.info}>
				<span>{title}</span>
				<Link href={`/collections/${id}`}>Изучить слова</Link>
			</div>
		</Card>
	);
};
