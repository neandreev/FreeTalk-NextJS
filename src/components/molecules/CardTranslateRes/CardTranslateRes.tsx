import { FC, useCallback } from 'react';

import { Row, Col, Card, Button, message } from 'antd';

import { ICardTranslateRes } from '../../../interfaces/translate';

import styles from './CardTranslateRes.module.css'
// import './CardTranslateRes.css'

export const CardTranslateRes: FC<ICardTranslateRes> = (
	{ word, onAddWordToDictionary }
) => {
	const handleAddWordToDictionary = useCallback(() => {
		onAddWordToDictionary && onAddWordToDictionary(word);
	}, [onAddWordToDictionary]);

	return (
			<Card
				className={styles['card-translate-res']}
				cover={<img className='card-cover' alt={word.en} src={word.imageURL} />}
			>
				<Row
					justify='space-between'
					align='middle'
					wrap={false}
					gutter={[8, 8]}
				>
					<Col className={styles.cardText}>
						<p className={styles.translate}>
							<span className={styles.title}>
								EN:
							</span>
							{word.en}
						</p>
						<p className={styles.translate}>
							<span className={styles.title}>
								RU:
							</span>
							{word.ru}
						</p>
					</Col>
					<Col>
						<Button
							className='app-btn _green'
							onClick={handleAddWordToDictionary}
						>
							Добавить
						</Button>
					</Col>
				</Row>
			</Card>
	);
};
