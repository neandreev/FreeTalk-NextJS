import {FC} from 'react';

import { Card, Button } from 'antd';

import {ICardTranslateRes} from "../../../interfaces/translate";

import style from './CardTranslateRes.module.css';

export const CardTranslateRes: FC<ICardTranslateRes> = ({
	title,
	translateResponse,
}) => {
	return (
		<Card title={title} style={{ width: 300 }}>
			<div className={style.wrapper}>
				<p className={style.cardText}>{translateResponse || 'Перевод'}</p>
				<Button disabled={!translateResponse}>Добавить в словарь</Button>
			</div>
		</Card>
	);
};
